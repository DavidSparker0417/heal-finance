import { useEffect, useState } from 'react'
import './switch.sass'

export default function ButtonGroup({data, style, handleChanged}) {
  const [selected, setSelected] = useState(data[0])
  useEffect(() => {
    handleChanged && handleChanged(selected)
  }, [selected])
  return(
    <div className='switch' style={{...style}}>
    {
      data.map((d, i) => {
        return(
          <div key={i} className='quality'>
            <input 
              type="radio" 
              id={d}
              value={d}
              checked={selected == d}
              onChange={e => setSelected(e.currentTarget.value)}
            />
            <label htmlFor={d}>{d}</label>
          </div>
        )
      })
    }
    </div>
  )
}