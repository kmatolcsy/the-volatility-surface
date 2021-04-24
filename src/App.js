import { useState, useEffect, useRef } from 'react';
import { csv, scaleLinear, extent, select, drag } from 'd3';
import { mean } from 'mathjs';

import { Marks } from './Marks'
import { Point3D } from './Point3D'
import { Surface3D } from './Surface3D';
import { readData } from './utils'


const url = 'https://raw.githubusercontent.com/kmatolcsy/options/master/2021-04-16/implied_vols_parametric_dfw.csv'

const initialAngles = {
  alpha: 0,
  beta: 0,
  gamma: 0
}

export const App = () => {
  let [angles, setAngles] = useState(initialAngles)
  let [data, setData] = useState(null)

  // before render
  useEffect(() => csv(url).then(setData), [])

  const start = useRef({ x: 0, y: 0 })

  const handleStart = event => {
    start.current = { x: event.x, y: event.y }
  }

  const handleDrag = event => setAngles({
    alpha: angles.alpha,
    beta: angles.beta + (event.x - start.current.x) / 300 * Math.PI,
    gamma: angles.gamma - (event.y - start.current.y) / 300 * Math.PI
  })

  useEffect(() => {
    const dragBehaviour = drag()
      .on('start', handleStart)
      .on('drag', handleDrag)
      .on('end', event => console.log('end'))

    select('svg').call(dragBehaviour)
  })

  if (!data)
    return 'loading'

  const df = readData(data)

  const scaler = 300
  const scales = {
    x: scaleLinear()
      .domain(extent(df.columns))
      .range([0, scaler]),

    y: scaleLinear()
      .domain(extent(df.index))
      .range([scaler, 0]),

    z: scaleLinear()
      .domain(extent(df.values.flat()))
      .range([0, scaler])
  }

  let center = new Point3D([1, 1, mean(extent(df.values.flat()))]).scale(scales)
  let surface = new Surface3D(df).scale(scales).rotate(center, angles)

  return (
    <svg width='900' height='600' color='red'>
      <g transform='translate(450, 300)'>
        <circle cx={0} cy={0} r='3' fill='red'></circle>
        <circle cx={center.x} cy={center.y} r='3'></circle>
        <Marks surface={surface} />
      </g>
    </svg>
  );
}
