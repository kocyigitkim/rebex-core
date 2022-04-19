import { Box, Grid, IconButton, Paper, Skeleton, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TablePagination, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { useRebexData } from '../contexts/RebexDataProvider';
import { DataFormatRegistry } from '../core/DataFormat';
import { DataRenderRegistry } from '../core/DataRender';
import { chooseIfNotUndefined, chooseIfTrue } from '../utils';
import { styled } from '@mui/material/styles';
import color from 'color'
import { DataUtils } from '../core/DataUtils';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ContextMenu } from './components/ContextMenu';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon, Search as SearchIcon, SearchOff as SearchOffIcon } from '@mui/icons-material';

const StyledTableRow = styled(TableRow)(({ theme, selected }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: color(theme.palette.action.hover).alpha(theme.palette.action.hoverOpacity * 0.5).rgb().string(),
    },
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:not(:hover)': {
        backgroundColor: (selected ? theme.palette.action.selected : 'inherit') + ' !important',
    }
}));

export function RebexTable(props) {
    const { translate, provider, isMobile } = useRebexData();
    const [currentData, setData] = useState([]);
    const [dataSource, setDataSource] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const isEmpty = currentData.length === 0;
    const [filter, setFilterCore] = useState({});
    const [search, setSearch] = useState('');
    const [sort, setSortCore] = useState({});
    const [page, setPageCore] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [selected, setSelected] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const title = chooseIfNotUndefined(props.title, '');
    const columns = props.columns;
    const source = props.source;
    const keyField = chooseIfNotUndefined(props.keyField, 'id');
    const calculatedColumns = columns.filter(column => column.calculate);
    const multipleSelection = chooseIfNotUndefined(props.multipleSelection, false);
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
        {showSearch && <TextField value={search} onChange={(evt) => {
            setSearch(evt.target.value);
        }} onKeyUp={(evt) => {
            if (evt.key === 'Escape') {
                setShowSearch(false);
            }
        }} autoFocus label={translate("search")} variant="outlined" size="small" fullWidth style={{ maxWidth: 400 }} />}
        {!showSearch && <div style={{ marginBottom: 8 }}><Typography variant="h6">{title}</Typography></div>}
    </>);
    const rightSide = (<>
        <IconButton onClick={() => setShowSearch(!showSearch)}>
            {!showSearch ? <SearchIcon /> : <SearchOffIcon />}
        </IconButton>
    </>);
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

    const getRowKey = (row) => {
        return row[keyField];
    };

    return (
        <div>
            {/* Table Container */}
            <TableContainer style={{
                userSelect: 'none',
                borderRadius: 16,
                ...props.style,
                position: 'relative',
                overflow: 'hidden',
            }}
                elevation={chooseIfNotUndefined(props.elevation, 20)} component={chooseIfNotUndefined(props.container, Paper)}>
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
                <div style={{
                    overflow: 'auto',
                    marginBottom: 15
                }}>
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
                            {error && (<TableRow key={"0"}>
                                <TableCell colSpan={columns.length}>{error}</TableCell>
                            </TableRow>)}
                            {!loading && !error && data.map((row, index) => {
                                var component = (
                                    <StyledTableRow key={"r-" + index} selected={enableSelect && Boolean(selected.filter(item => getRowKey(item) === getRowKey(row)).length > 0)} onClick={(evt) => {
                                        if (onRowClick) onRowClick(row, index);
                                        if (enableSelect) {
                                            var isSelected = Boolean(selected.find(item => getRowKey(item) === getRowKey(row)));
                                            if (isSelected) {
                                                setSelected(selected.filter(item => getRowKey(item) !== getRowKey(row)));
                                            }
                                            else {
                                                if (multipleSelection) {
                                                    setSelected(selected.includes(row) ? selected.filter(r => r !== row) : [...selected, row]);
                                                }
                                                else {
                                                    setSelected([row]);
                                                }
                                            }
                                        }
                                    }} onDoubleClick={(evt) => {
                                        if (onRowDoubleClick) onRowDoubleClick(row, index);
                                    }} hover>
                                        {columns.map((column, index) => {
                                            return <TableCell key={index}  {...(column.computedProps ? (column.computedProps({})) : {})}>
                                                <RenderDataCell column={column} row={row} index={index} data={data} />
                                            </TableCell>;
                                        })}
                                    </StyledTableRow>
                                );

                                if (contextMenu) {
                                    return (<ContextMenu key={"r-" + index} menuItemsData={contextMenu(row, index, data)}>
                                        {component}
                                    </ContextMenu>);
                                }
                                return component;
                            })}
                        </TableBody>

                    </Table>
                </div>
                {enablePagination && <Paper>
                    <Grid container spacing={1}>
                        <Grid item flex={1}>
                            <Box p={1} m={1}>
                                <Typography variant="caption">
                                    {selected.length > 0 ? (translate('rows.selected').replace('{0}', selected.length)) : (translate('rows.total').replace('{0}', total))}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item p={1}>
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
                                sx={{
                                    border: 'none'
                                }}
                                onRowsPerPageChange={(event) => {
                                    if (event.target.value === -1) {
                                        setPageSize(total);
                                    }
                                    else {
                                        setPageSize(event.target.value);
                                    }
                                }}
                            ></TablePagination>
                        </Grid>
                    </Grid>
                </Paper>
                }
            </TableContainer>
        </div>
    );
}
function RenderDataCell({ column, row, index, data }) {
    const [CurrentRenderer, setCurrentRenderer] = useState(() => {
        if (!column) return null;
        const renderer = DataRenderRegistry.get(typeof column.renderer === 'object' ? column.renderer.name : (column.renderer || 'default'));
        return renderer;
    });
    const [CurrentFormat, setCurrentFormat] = useState(() => {
        return column.format ? DataFormatRegistry.get(column.format.name).create(column.format) : null;
    });

    // useEffect(() => {
    //     if (!column) return;
    //     if (typeof column.renderer === 'object') {
    //         setCurrentRenderer(DataRenderRegistry.get(column.renderer.name));
    //     }
    //     else {
    //         setCurrentRenderer(DataRenderRegistry.get(column.renderer || 'default'));
    //     }
    // }, [column.renderer]);

    if (!CurrentRenderer || (typeof CurrentRenderer === 'function') === false || !column || !row || !data) return null;

    var value = row[column.field];
    if (column.customValue) {
        try {
            value = column.customValue(row);
        } catch (e) {
            console.error(e);
        }
    }

    const formattedValue = CurrentFormat && CurrentFormat.format ? CurrentFormat.format(value) : value;
    const rendered = (CurrentRenderer({
        ...(typeof column.renderer === 'object' ? column.renderer : {}),
        key: 'c-' + index,
        value: formattedValue,
        column: column,
        row: row,
        index: index,
        data: data
    }));
    console.log(rendered);

    return (
        <div style={{
            textAlign: column.align || 'left',
            display: 'block',
            height: '100%'
        }}>
            {rendered}
        </div>
    );
}
function RenderDataCellHeader({ column, index, enableSort, onSort, sort }) {
    if (enableSort && !column.disableSort) {
        return (
            <TableSortLabel
                active={sort && sort.field === column.field}
                direction={(sort && sort.field === column.field && sort.direction) || 'asc'}
                onClick={() => {
                    onSort({
                        field: column.field,
                        active: true,
                        direction: sort.direction === 'asc' ? 'desc' : 'asc'
                    });
                }}
                sx={{
                    display: 'flex',
                    justifyContent: { left: 'flex-start', center: 'center', right: 'flex-start' }[column.align || 'left'],
                    flexDirection: column.align === 'right' ? 'row-reverse' : 'row',
                }}
            >
                {column.title}
            </TableSortLabel>
        );
    }
    return (
        <div style={{
            textAlign: column.align || 'left',
        }}>
            {column.title}
        </div>
    );
}
