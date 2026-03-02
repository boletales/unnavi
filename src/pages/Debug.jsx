import React, { useState } from 'react'
import MapView from '../components/MapView'
import { findDestination } from '../utils/overpass'

export default function Debug(){
  const [center, setCenter] = useState({ lat:35.681, lon:139.767 })
  const [radiusKm, setRadiusKm] = useState(1)
  const [lastRun, setLastRun] = useState(null)

  async function run(){
    const res = await findDestination(center.lat, center.lon, Number(radiusKm))
    setLastRun(res)
  }

  const markers = []
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
          <label>目的距離 (km): <input value={radiusKm} onChange={e=>setRadiusKm(e.target.value)} /></label><br />
          <div style={{ marginTop: 8 }}>
            <button onClick={run}>アルゴリズム実行</button>
          </div>
          <div style={{ marginTop: 12 }}>
            最終結果: {lastRun ? JSON.stringify(lastRun, null, 2) : '未実行'}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <MapView center={[center.lat, center.lon]} markers={markers} circle={lastRun?.centerCircle} onMapClick={([lat,lon])=>setCenter({lat,lon})} />
        </div>
      </div>
    </div>
  )
}
