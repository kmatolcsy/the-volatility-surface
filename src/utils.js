export const readData = data => {
    const index_name = data.columns[0]
    let columns = data.columns.slice(1)

    return {
        columns: columns.map(column => +column),
        values: data.map(row => columns.map(column => +row[column])),
        index: data.map(row => +row[index_name])
    }
}

export const linspace = (start, stop, num, endpoint = true) => {
    const div = endpoint ? (num - 1) : num;
    const step = (stop - start) / div;
    return Array.from({ length: num }, (_, i) => start + step * i);
}

export const compare = (a, b) => {
    const coord = 'z'
    
    if (a.centroid[coord] < b.centroid[coord]) return -1
    if (a.centroid[coord] > b.centroid[coord]) return +1
    return 0
}
