import React, { useState } from 'react'
import MapView from '../components/MapView'
import DestinationControl from '../components/DestinationControl'

export default function Debug(): JSX.Element {
  const [center, setCenter] = useState({ lat:35.681, lon:139.767 })
  const [radiusKm, setRadiusKm] = useState<number>(1)
  const [lastRun, setLastRun] = useState<any>(null)

  const markers: Array<any> = []
  // show center point on map
  markers.push({ lat: center.lat, lon: center.lon, color: 'blue', text: '中心' })
  if(lastRun){
    if(lastRun.candidate) markers.push({ lat: lastRun.candidate.lat, lon: lastRun.candidate.lon, color: 'orange', text: '候補点' })
    if(lastRun.destination) markers.push({ lat: lastRun.destination.lat, lon: lastRun.destination.lon, color: 'red', text: '目的地' })
  }

  return (
    <div>
      <h2>デバッグ</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 320 }}>
          <label>中心緯度: <input value={center.lat} onChange={e=>setCenter(c=>({...c, lat: Number(e.target.value)}))} /></label><br />
          <label>中心経度: <input value={center.lon} onChange={e=>setCenter(c=>({...c, lon: Number(e.target.value)}))} /></label><br />
          <div style={{ marginTop: 8 }}>
            <DestinationControl center={center} initialDistanceKm={radiusKm} onResult={({ res, dist })=>{
              console.log('Debug: destination result', res)
              setLastRun(res)
              setRadiusKm(dist)
            }} />
          </div>
          <div style={{ marginTop: 12 }}>
            <div><strong>中心点:</strong> {center.lat.toFixed(6)}, {center.lon.toFixed(6)}</div>
            <div style={{ marginTop: 8 }}><strong>最終結果:</strong></div>
            <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 240, overflow: 'auto', background:'#f7f7f7', padding:8 }}>{lastRun ? JSON.stringify(lastRun, null, 2) : '未実行'}</pre>
            {lastRun?.attempts && <div>API呼び出し回数: {lastRun.attempts}</div>}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {/* pass goal distance circle (meters) and candidate circle if available */}
          <MapView
            center={[center.lat, center.lon]}
            markers={markers}
            circle={[
              { center: { lat: center.lat, lon: center.lon }, radius: radiusKm * 1000 },
              ...(lastRun?.centerCircle ? [lastRun.centerCircle] : [])
            ]}
            onMapClick={([lat,lon])=>setCenter({lat,lon})}
          />
        </div>
      </div>
    </div>
  )
}
