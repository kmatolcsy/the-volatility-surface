import { useState, useEffect } from 'react';
import { csv } from 'd3';

import { Surface } from './Surface'
import { readData } from './utils'


const url = 'https://raw.githubusercontent.com/kmatolcsy/options/master/2021-04-16/implied_vols_parametric_dfw.csv'

export const App = () => {
  let [dataFrame, setDataFrame] = useState(null)

  // before rendering
  useEffect(() => csv(url).then(readData).then(setDataFrame), [])

  if (!dataFrame)
    return 'Loading...'

  return (
    <div>
      <Surface df={dataFrame} width={900} height={600} />
    </div>
  );
}
