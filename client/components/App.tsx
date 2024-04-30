import { useState } from 'react'
import Layer from './Layer.tsx'
import { generateSchedule } from '../functions/generateSchedule.ts'
import Schedule from './Schedule.tsx'
import example from '../data/example.json'

function App() {
  // Layers as a state
  const [state, setState] = useState({
    layers: [[]],
    mpSpacing: 'normal',
    data: { tv: {}, movie: {} },
    schedule: null,
  })

  const { layers, mpSpacing, data, schedule } = state

  function addData(entry, layerId: number, entryId: number) {
    data[entry.type][entry.id] = entry
    layers[layerId][entryId] = entry
    setState({ ...state, layers, data })
  }

  function updateSchedule() {
    const newSchedule = generateSchedule(layers, mpSpacing)
    setState({ ...state, schedule: newSchedule })
  }

  // setCookie('layers', layers)
  // const [data, setData] = useState(getCookie('data', {}))

  // getCookie('entries', []).forEach(entry => {
  //   // Do some stuff
  // })

  function setLayers(newLayers) {
    // setCookie('layers', newLayers)
    setState({ ...state, layers: newLayers })
  }

  function setMpSpacing(mpSpacing) {
    setState({ ...state, mpSpacing })
  }

  // function getCookie(cname, initial = null) {
  //   return initial

  //   const name = cname + '='
  //   const decodedCookie = decodeURIComponent(document.cookie)
  //   const ca = decodedCookie.split(';')
  //   for (let i = 0; i < ca.length; i++) {
  //     let c = ca[i]
  //     while (c.charAt(0) == ' ') {
  //       c = c.substring(1)
  //     }
  //     if (c.indexOf(name) == 0) {
  //       return JSON.parse(c.substring(name.length, c.length))
  //     }
  //   }
  //   return initial
  // }

  // function setCookie(cname, value, exyears = 10) {
  //   return

  //   const d = new Date()
  //   d.setTime(d.getTime() + exyears * 365 * 24 * 60 * 60 * 1000)
  //   const expires = 'expires=' + d.toUTCString()
  //   console.log(JSON.stringify(value))
  //   document.cookie =
  //     cname + '=' + JSON.stringify(value) + ';' + expires + ';path=/'
  // }

  return (
    <>
      {' '}
      <button
        onClick={() => {
          // Fetch from example.json
          setState(example)
        }}
      >
        Load Example
      </button>
      <input
        type="file"
        accept=".txt"
        onChange={(e) => {
          try {
            // Load as JSON into state
            const file = e.target.files[0]
            const reader = new FileReader()
            reader.readAsText(file, 'UTF-8')
            reader.onload = (e) => {
              const text = e.target.result
              setState(JSON.parse(text))
            }
          } catch (e) {
            console.error(e)
          }
        }}
      />
      <div id="layerContainer">
        {layers.map((entries, index) => (
          <Layer
            key={index}
            id={index}
            entries={entries}
            layers={layers}
            setLayers={setLayers}
            data={data}
            addData={addData}
          />
        ))}
        <button onClick={() => setLayers([...layers, []])}>Add Layer</button>
      </div>
      <fieldset id="mp" onChange={(e) => setMpSpacing(e.target.value)}>
        <legend>Space Multi-Parters...</legend>
        {['Normally', 'Closer', 'Consecutively'].map((option, i) => (
          <div key={i}>
            <input
              type="radio"
              name={`mp-opt-${i}`}
              value={option.toLowerCase().slice(0, 6)}
              checked={mpSpacing === option.toLowerCase().slice(0, 6)}
            />
            <label htmlFor={`mp-opt-${i}`}>{option}</label>
          </div>
        ))}
      </fieldset>
      <button onClick={updateSchedule}>Generate Schedule</button>
      {schedule && <Schedule {...schedule} />}
      <button
        onClick={() => {
          // Save as JSON
          const text = JSON.stringify(state)
          const blob = new Blob([text], { type: 'text/plain' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'schedule.txt'
          a.click()
        }}
      >
        Export Schedule
      </button>
    </>
  )
}

export default App