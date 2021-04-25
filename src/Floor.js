import { useEffect } from 'react'
import { selectAll } from 'd3'

import { Surface3D } from './Surface3D'

export const Floor = ({ df, scaleAxes, center, angles }) => {

    const offset = -0.075 * (scaleAxes.z.domain()[1] - scaleAxes.z.domain()[0])

    let floor = new Surface3D({ ...df, values: df.values.map(row => row.map(() => scaleAxes.z.domain()[0] + offset)) })
        .scale(scaleAxes)
        .rotate(center, angles)

    // bind the data to the DOM elemenents
    useEffect(() => selectAll('.floor').data(floor.paths))

    return floor.paths.map((path, index) => <path
        className='floor'
        key={index}
        d={path.data}
        opacity='0.6'
        fill='gray'
    />)
}