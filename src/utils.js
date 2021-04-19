export const readData = data => {
    const index_name = data.columns[0]
    let columns = data.columns.slice(1)

    return {
        columns: columns.map(column => +column),
        values: data.map(row => columns.map(column => +row[column])),
        index: data.map(row => +row[index_name])   
    }
}