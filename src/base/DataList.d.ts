interface Props {
    data: any[];
    columns: DataColumn[];
    options: DataListOptions;
    onRowClick?: (row: any) => void;
    onRowDoubleClick?: (row: any) => void;
    onRowContextMenu?: (row: any) => void;
    onShowDetails?: (row: any) => Boolean;

};

interface DataListOptions {
    showHeader: boolean;
    showFooter: boolean;
    showPager: boolean;
    showSearch: boolean;
    showFilter: boolean;
    showSort: boolean;
    showDetails: boolean;
    showCheckbox: boolean;
    showRowNumber: boolean;
    showSelectAll: boolean;
    pageSize: number;
    
}

interface DataColumn{
    name: string;
    title: string;
    type: string;
    format?: string;
    width?: number;
    sortable?: boolean;
    filterable?: boolean;
    searchable?: boolean;
    visible?: boolean;
    align?: string;
    render?: (row: any, column: DataColumn) => any;
    renderHeader?: (column: DataColumn) => any;
    renderFooter?: (column: DataColumn) => any;
    renderPager?: (column: DataColumn) => any;
    renderFilter?: (column: DataColumn) => any;
    renderSearch?: (column: DataColumn) => any;
    renderSort?: (column: DataColumn) => any;
    renderDetails?: (column: DataColumn) => any;

}

export function DataList(props: Props) { }