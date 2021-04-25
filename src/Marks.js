import { useEffect } from 'react'
import { selectAll, color } from 'd3'

import { Surface3D } from './Surface3D'

export const Marks = ({ df, scaleAxes, scaleColor, center, angles }) => {
    let marks = new Surface3D(df)
        .scale(scaleAxes)
        .rotate(center, angles)

    // bind the data to the DOM elemenents
    useEffect(() => selectAll('.marks').data(marks.paths))

    return marks.paths.map((path, index) => <path
        className='three marks'
        key={index}
        d={path.data}
        fill={path.area > 0 ? color(scaleColor(path.colorValue)) : color(scaleColor(path.colorValue)).darker()}
    />)
}
