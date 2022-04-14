export const DataUtils = {
    DefaultPaginationFunction: (response, data, page, pageSize) => {
        return {
            page: response && response.pagination && response.pagination.page,
            pageSize: response && response.pagination && response.pagination.pageSize,
            total: response && response.total,
        }
    },
    DefaultSortFunction: (response, data, sort) => {
        if (Array.isArray(data)) {
            var isAsc = sort.direction === 'asc';
            var sortedData = data.sort((a, b) => {
                var aField = (a[sort.field] || "").toString();
                var bField = (b[sort.field] || "").toString();
                if (aField > bField) return isAsc ? 1 : -1;
                if (aField < bField) return isAsc ? -1 : 1;
                return 0;
            });
            return sortedData;
        }
        return [];
    },
    DefaultDataFunction: (data) => data
}