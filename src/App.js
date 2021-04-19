import { useState, useEffect } from 'react';
import { csv, line, scaleLinear, extent } from 'd3';

import { Point3D } from './Point3D'
import { Surface3D } from './Surface3D'
import { readData } from './utils'

const url = 'https://raw.githubusercontent.com/kmatolcsy/options/master/2021-04-16/implied_vols_parametric_dfw.csv'

export const App = () => {
  let [data, setData] = useState(null)
  let [beta, setBeta] = useState(0)
  let [gamma, setGamma] = useState(0)

  useEffect(() => {
    csv(url).then(setData)
  }, [])

  if (!data)
    return 'loading'

  const df = readData(data)

  // const angles = {alpha: Math.PI, beta: Math.PI / 2, gamma: -Math.PI / 2}
  const scaler = 300
  const scales = {
    x: scaleLinear()
      .domain(extent(df.columns))
      .range([0, scaler]),

    y: scaleLinear()
      .domain(extent(df.index))
      .range([0, scaler]),

    z: scaleLinear()
      .domain(extent(df.values.flat()))
      .range([0, scaler])
  }

  const angles = {
    alpha: 0,
    beta: beta,
    gamma: gamma
  }

  let center = new Point3D([1, 1, 0.1392]).scale(scales);
  let surface = new Surface3D(df).scale(scales).rotate(center, angles)

  const handleMouseMove = event => {
    setBeta(event.clientX / 900 * Math.PI * 2)
    setGamma(event.clientY / 600 * Math.PI * 2)
  }

  return (
    <svg width='900' height='600' color='red' onMouseMove={handleMouseMove}>
      <g transform='translate(450, 300)'>
        <circle cx={0} cy={0} r='3' fill='red'></circle>
        <circle cx={center.x} cy={center.y} r='3'></circle>
        {surface.paths.map(path => <path d={path.data}></path>)}
      </g>
    </svg>
  );
}
