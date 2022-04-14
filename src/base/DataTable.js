import { Box, Grid, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useRebexData } from '../contexts/RebexDataProvider';
import { DataFormatRegistry } from '../core/DataFormat';
import { DataRenderRegistry } from '../core/DataRender';
import { chooseIfNotUndefined, chooseIfTrue } from '../utils';
import { styled } from '@mui/material/styles';
import color from 'color'
import { DataUtils } from '../core/DataUtils';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ContextMenu } from './components/ContextMenu';
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: color(theme.palette.action.hover).alpha(theme.palette.action.hoverOpacity * 0.5).rgb().string(),
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function DataTable(props) {
    const { translate, provider, isMobile } = useRebexData();

    const [currentData, setData] = useState([]);
    const [dataSource, setDataSource] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const isEmpty = currentData.length === 0;
    const [filter, setFilterCore] = useState({});
    const [sort, setSortCore] = useState({});
    const [page, setPageCore] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState([]);

    const columns = props.columns;
    const source = props.source;
    const calculatedColumns = columns.filter(column => column.calculate);

    const enableHeader = chooseIfNotUndefined(props.enableHeader, true);
    const enablePagination = chooseIfNotUndefined(props.enablePagination, true);
    const enableSearch = chooseIfNotUndefined(props.enableSearch, true);
    const enableSelect = chooseIfNotUndefined(props.enableSelect, true);
    const enableSort = chooseIfNotUndefined(props.enableSort, true);
    const enableFilter = chooseIfNotUndefined(props.enableFilter, true);
    const onRowClick = chooseIfNotUndefined(props.onRowClick, null);
    const onRowDoubleClick = chooseIfNotUndefined(props.onRowDoubleClick, null);
    const onRowSelectionChange = chooseIfNotUndefined(props.onRowSelectionChange, null);
    const onRowExpansionChange = chooseIfNotUndefined(props.onRowExpansionChange, null);
    const sortFunction = chooseIfNotUndefined(props.sortFunction, DataUtils.DefaultSortFunction);
    const dataFunction = chooseIfNotUndefined(props.dataFunction, DataUtils.DefaultDataFunction);
    const remote = chooseIfNotUndefined(props.remote, false);
    const remoteSort = chooseIfNotUndefined(props.remoteSort, remote);
    const remotePagination = chooseIfNotUndefined(props.remotePagination, remote);
    const remoteFilter = chooseIfNotUndefined(props.remoteFilter, remote);
    const contextMenu = chooseIfNotUndefined(props.contextMenu, null);
    const enableActions = chooseIfTrue(enableSearch, enableSelect, enableSort, enableFilter);
    const paginationFunction = chooseIfNotUndefined(source && source.pagination, DataUtils.DefaultPaginationFunction);

    var data = currentData;
    if (dataFunction) {
        data = dataFunction(data);
    }
    data = data.map(row => {
        calculatedColumns.forEach(column => {
            row[column.field] = column.calculate(row);
        });
        return row;
    });
    if (!remoteSort && sort.field) {
        data = sortFunction(dataSource.data, data, sort);
    }

    const leftSide = (<>
        <TextField label={translate("search")} variant="filled" size="small" />
    </>);
    const rightSide = (null);
    const headerActions = (null);

    const refreshList = async () => {
        if (!dataSource) {
            setData([]);
            return;
        }
        setLoading(true);
        await dataSource.retrieve();
        if (dataSource.success) {
            setError(null);
            setData(dataSource.data);

            var paginationData = paginationFunction && paginationFunction(dataSource.response, dataSource.data, page, pageSize);
            if (paginationData) {
                const { page, pageSize, total } = paginationData;
                setPage(page || 0);
                if (pageSize) setPageSize(pageSize);
                setTotal(total || (dataSource.data && dataSource.data.length));
            }
            else {
                setPage(0);
                setTotal(0);
            }
        }
        else {
            setData([]);
            setError(dataSource.error);
        }
        setTimeout(() => {
            setLoading(false);
        }, 300)
    };

    const setSort = (sort) => {
        setSortCore(sort);
        if (remoteSort) {
            refreshList();
        }
    };
    const setFilter = (filter) => {
        setFilterCore(filter);
        if (remoteFilter) {
            refreshList();
        }
    }
    const setPage = (page) => {
        setPageCore(page);
        if (remotePagination) {
            refreshList();
        }
    }

    useEffect(() => {
        if (provider) {
            setDataSource(provider.create(source));
        }
    }, [provider, source]);

    useEffect(() => {
        if (dataSource) {
            refreshList();
        }
    }, [provider, source, dataSource]);
    if (isMobile) return <div style={{ color: 'white' }}>"hello mobile"</div>;
    return (
        <div>
            {/* Table Container */}
            <TableContainer style={{
                userSelect: 'none',
                borderRadius: 16,
                ...props.style,
                position: 'relative'
            }} elevation={chooseIfNotUndefined(props.elevation, 20)} component={chooseIfNotUndefined(props.container, Paper)}>
                {/* Table Actions */}
                {enableActions && (<>
                    <Box>
                        <Box p={2}>
                            <Grid container>
                                <Grid item flex={1}>
                                    {leftSide}
                                </Grid>
                                <Grid item>
                                    {rightSide}
                                    {headerActions}
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </>)}
                {/* Table */}
                <LoadingOverlay loading={loading} />
                <Table stickyHeader size="small">
                    {/* Table Head */}
                    {enableHeader && <TableHead>
                        <TableRow>
                            {columns.map((column, index) => {
                                return (
                                    <TableCell key={index}>
                                        <RenderDataCellHeader enableSort sort={sort} onSort={setSort} title={column.title} column={column} index={index} />
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableHead>}
                    {/* Table Body */}
                    <TableBody>

                        {loading && ((new Array(10).fill(0)).map((row, index) => {
                            return (<TableRow key={index}>
                                {columns.map((column, index) => {
                                    return (
                                        <TableCell key={index}>
                                            <Skeleton animation="wave" />
                                        </TableCell>
                                    );
                                })}
                            </TableRow>)
                        }))}
                        {error && (<TableRow>
                            <TableCell colSpan={columns.length}>{error}</TableCell>
                        </TableRow>)}
                        {!loading && !error && data.map((row, index) => {
                            var component = (
                                <StyledTableRow onClick={onRowClick} onDoubleClick={onRowDoubleClick} hover key={index}>
                                    {columns.map((column, index) => {
                                        return <TableCell key={index}>
                                            <RenderDataCell column={column} row={row} index={index} data={data} />
                                        </TableCell>;
                                    })}
                                </StyledTableRow>
                            );

                            if (contextMenu) {
                                return (<ContextMenu menuItemsData={contextMenu(row, index, data)}>
                                    {component}
                                </ContextMenu>);
                            }
                            return component;
                        })}
                    </TableBody>

                </Table>
                {enablePagination && <Paper>
                    <Table>
                        {/* Table Footer */}
                        <TableFooter>
                            <TableRow>
                                <Box justifyContent={"flex-end"} display="flex" p={1}>
                                    <TablePagination
                                        colSpan={columns.length}
                                        count={total}
                                        rowsPerPage={pageSize}
                                        page={page}
                                        onPageChange={(event, newPage) => {
                                            setPage(newPage);
                                        }}
                                        showFirstButton
                                        showLastButton
                                        onRowsPerPageChange={(event) => {
                                            if (event.target.value === -1) {
                                                setPageSize(total);
                                            }
                                            else {
                                                setPageSize(event.target.value);
                                            }
                                        }}
                                    ></TablePagination>
                                </Box>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Paper>
                }
            </TableContainer>
        </div>
    );
}
function RenderDataCell({ column, row, index, data }) {
    const currentFormat = column.format && DataFormatRegistry.get(column.format.name).create(column.format);
    var value = row[column.field];
    if (column.customValue) {
        value = column.customValue(row);
    }
    const formattedValue = currentFormat ? currentFormat.format(value) : value;
    const render = column.render;
    if (render) {
        return render(formattedValue, row, index, data);
    }
    const renderer = DataRenderRegistry.get(typeof column.renderer === 'object' ? column.renderer.name : (column.renderer || 'default'));
    const rendered = renderer ? renderer({
        value: formattedValue,
        column: column,
        row: row,
        index: index,
        data: data,
        ...(typeof renderer === 'object' ? column.renderer : {})
    }) : formattedValue;

    return (
        rendered
    );
}
function RenderDataCellHeader({ column, index, enableSort, onSort, sort }) {
    if (enableSort && !column.disableSort) {
        return (
            <TableSortLabel
                active={sort && sort.field === column.field}
                direction={sort && sort.direction}
                onClick={() => {
                    onSort({
                        field: column.field,
                        active: true,
                        direction: sort.direction === 'asc' ? 'desc' : 'asc'
                    });
                }}
            >
                {column.title}
            </TableSortLabel>
        );
    }
    return (
        <>
            {column.title}
        </>
    );
}
