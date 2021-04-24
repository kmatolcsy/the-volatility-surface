import { useState, useEffect, useReducer } from 'react';
import { csv, scaleLinear, extent } from 'd3';

import { Point3D } from './Point3D'
import { Surface3D } from './Surface3D'
import { readData } from './utils'

const url = 'https://raw.githubusercontent.com/kmatolcsy/options/master/2021-04-16/implied_vols_parametric_dfw.csv'

const initialState = {
  alpha: 0,
  beta: 0,
  gamma: 0,
  startX: 0,
  startY: 0,
  condition: false
}

const ACTION = {
  MOUSEDOWN: 0,
  MOUSEMOVE: 1,
  MOUSEUP: 2
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.MOUSEDOWN:
      return {
        alpha: state.alpha,
        beta: state.beta,
        gamma: state.gamma,
        startX: action.payload.clientX,
        startY: action.payload.clientY,
        condition: true
      }
    case ACTION.MOUSEUP:
      return {
        alpha: state.alpha,
        beta: state.beta,
        gamma: state.gamma,
        startX: state.startX,
        startY: state.startY,
        condition: false
      }
    case ACTION.MOUSEMOVE:
      return {
        alpha: state.condition ? 0 : state.alpha,
        beta: state.condition ? state.beta + (action.payload.clientX - state.startX) * Math.PI / 10000 : state.beta,
        gamma: state.condition ? (action.payload.clientY - state.startY + state.gamma) * Math.PI / 230 * -1: state.gamma,
        startX: state.startX,
        startY: state.startY,
        condition: state.condition
      }
  }
}

export const App = () => {
  let [data, setData] = useState(null)
  let [state, dispatch] = useReducer(reducer, initialState)

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
      .range([scaler, 0]),

    z: scaleLinear()
      .domain(extent(df.values.flat()))
      .range([0, scaler])
  }

  const angles = {
    alpha: state.alpha,
    beta: state.beta,
    gamma: state.gamma
  }

  let center = new Point3D([1, 1, 0.1392]).scale(scales);
  let surface = new Surface3D(df).scale(scales).rotate(center, angles)

  const handleMouseDown = event => dispatch({
    type: ACTION.MOUSEDOWN,
    payload: {
      clientX: event.clientX,
      clientY: event.clientY
    }
  })

  const handleMouseMove = event => dispatch({
    type: ACTION.MOUSEMOVE,
    payload: {
      clientX: event.clientX,
      clientY: event.clientY
    }
  })

  const handleMouseUp = () => dispatch({ type: ACTION.MOUSEUP })

  return (
    <svg width='900' height='600' color='red' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <g transform='translate(450, 300)'>
        <circle cx={0} cy={0} r='3' fill='red'></circle>
        <circle cx={center.x} cy={center.y} r='3'></circle>
        {surface.paths.map(path => <path d={path.data}></path>)}
      </g>
    </svg>
  );
}
