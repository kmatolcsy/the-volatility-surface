import { extent, scaleSequential, interpolateViridis } from 'd3'

export const Marks = ({ surface }) => {

  const color = scaleSequential(interpolateViridis)
    .domain(extent(surface.df.values.flat()))

  return surface.paths.map((path, index) => <path
    key={index} 
    d={path.data} 
    fill={color(path.colorValue)}/>)
}
