import { useEffect } from 'react'
import { selectAll } from 'd3'

import { Surface3D } from './Surface3D'
import { linspace } from './utils'


export const Walls = ({ df, scaleAxes, center, angles }) => {
    const [xMin, xMax] = scaleAxes.x.domain()
    const [yMin, yMax] = scaleAxes.y.domain()
    const [zMin, zMax] = scaleAxes.z.domain()

    // xWall
    const xCond = angles.beta > Math.PI
    const xFill = xCond ? xMin : xMax
    const xOffset = (xMax - xMin) * (xCond ? -0.075 : 0.075)
    const xValues = df.index.map(() => linspace(zMin, zMax, df.columns.length))

    let xWall = new Surface3D({ ...df, columns: Array(df.columns.length).fill(xFill + xOffset), values: xValues })
        .scale(scaleAxes)
        .rotate(center, angles)

    // yWall
    const yCond = angles.beta < 1.5 * Math.PI && angles.beta > 0.5 * Math.PI
    const yFill = yCond ? yMin : yMax
    const yOffset = (yCond ? -0.075 : 0.075) * (yMax - yMin)
    const yValues = linspace(zMin, zMax, df.index.length).map(value => Array(df.columns.length).fill(value))

    let yWall = new Surface3D({ ...df, index: Array(df.index.length).fill(yFill + yOffset), values: yValues })
        .scale(scaleAxes)
        .rotate(center, angles)

    // bind the data to the DOM elemenents
    useEffect(() => {
        selectAll('.xWall').data(xWall.paths)
        selectAll('.yWall').data(yWall.paths)
    })

    return (<g>
        {xWall.paths.map((path, index) => <path
            className='xWall'
            key={index}
            d={path.data}
            opacity='0.6'
            fill='gray'
        />)}
        {yWall.paths.map((path, index) => <path
            className='yWall'
            key={index}
            d={path.data}
            opacity='0.6'
            fill='gray'
        />)}
    </g>)
}