import { useState, useEffect } from 'react';
import { csv } from 'd3';

import { Point3D } from './Point3D'
import { Polygon3D } from './Polygon3D'

const url = 'https://raw.githubusercontent.com/kmatolcsy/options/master/2021-04-16/implied_vols_parametric_dfw.csv'

export const App = () => {
  let [alpha, setAlpha] = useState(0)
  let [data, setData] = useState([])

  useEffect(() => {
    csv(url).then(setData)
  }, [])

  // const angles = {alpha: Math.PI, beta: Math.PI / 2, gamma: -Math.PI / 2}
  const angles = {
    alpha: alpha,
    beta: Math.PI * 2,
    gamma: Math.PI * 2
  }

  let center = new Point3D(0, 0, 0);
  let triangle = new Polygon3D([
    new Point3D(1, 1, 0),
    new Point3D(2, 1, 0),
    new Point3D(1, 2, 0),
  ]).scale(50).rotate(center, angles)
  
  return (
    <svg width='900' height='600' onMouseMove={e => setAlpha(e.clientX / 900 * Math.PI * 2)}>
      <g transform='translate(450, 300)'>
        <circle cx={center.x} cy={center.y} r='3'></circle>
        <path d={triangle.data()} fill='blue'></path>
      </g>
    </svg>
  );
}
