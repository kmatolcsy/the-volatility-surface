import { useState, useEffect, useRef } from 'react';
import { scaleLinear, scaleSequential, interpolateViridis, extent, selectAll, select, drag } from 'd3';
import { mean, mod } from 'mathjs';

import { Point3D } from './Point3D';
import { compare } from './utils';
import { Marks } from './Marks';
import { Walls } from './Walls';
import { Floor } from './Floor';



const initialAngles = {
    alpha: 0,
    beta: 0,
    gamma: 0
}

export const Surface = ({ df, width, height }) => {
    let [angles, setAngles] = useState(initialAngles)
    let entryPoint = useRef({ x: 0, y: 0 })

    // dragging behaviour
    const handleStart = event => {
        entryPoint.current = { x: event.x, y: event.y }
    }

    const handleDrag = event => setAngles({
        alpha: angles.alpha,
        beta: mod(angles.beta + (event.x - entryPoint.current.x) / 300 * Math.PI, 2 * Math.PI),
        gamma: mod(angles.gamma - (event.y - entryPoint.current.y) / 300 * Math.PI, 2 * Math.PI)
})

    useEffect(() => {
        const dragBehaviour = drag()
            .on('start', handleStart)
            .on('drag', handleDrag)
            .on('end', event => console.log('end'))

        select('svg').call(dragBehaviour)

        selectAll('.three').sort(compare)
    })

// scales
const scaleAxes = {
    x: scaleLinear()
        .domain(extent(df.columns))
        .range([0, height / 2]),

    y: scaleLinear()
        .domain(extent(df.index))
        .range([height / 2, 0]),

    z: scaleLinear()
        // .domain([0, 1])
        .domain(extent(df.values.flat()))
        .range([0, height / 2])
        .nice()
}

const scaleColor = scaleSequential(interpolateViridis)
    .domain(extent(df.values.flat()))

// objects NOTE: creating new objects for every render might lead to performance issues
let center = new Point3D([1, 1, mean(df.values.flat())])
    .scale(scaleAxes)

let refPoint = new Point3D([0, 0.75, scaleAxes.z.domain()[0]])
    .scale(scaleAxes)
    .rotate(center, angles)

return (
    <svg width={width} height={height}>
        <g transform={`translate(${width / 2}, ${height / 2})`}>
            <circle cx={refPoint.x} cy={refPoint.y} r={3} />
            <Floor df={df} scaleAxes={scaleAxes} center={center} angles={angles} />
            <Walls df={df} scaleAxes={scaleAxes} center={center} angles={angles} />

            <Marks df={df} scaleAxes={scaleAxes} scaleColor={scaleColor} center={center} angles={angles} />
        </g>
        <text x={10} y={10}>Alpha: {angles.alpha}</text>
        <text x={10} y={30}>Beta: {angles.beta}</text>
        <text x={10} y={50}>Gamma: {angles.gamma}</text>
    </svg>
)
}