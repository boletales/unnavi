import React, { useEffect, useState, useRef } from 'react'
import MapView from '../components/MapView'
import { findDestination } from '../utils/overpass'

function distanceKm(a, b){
  const toRad = v => v*Math.PI/180
  const R = 6371
  const dLat = toRad(b.lat-a.lat)
  const dLon = toRad(b.lon-a.lon)
  const la = toRad(a.lat)
  const lb = toRad(b.lat)
  const x = Math.sin(dLat/2)**2 + Math.cos(la)*Math.cos(lb)*Math.sin(dLon/2)**2
  return R*2*Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
}

export default function Main(){
  const [pos, setPos] = useState({lat:35.681, lon:139.767})
  const [distance, setDistance] = useState(1)
  const [dest, setDest] = useState(() => {
    try { return JSON.parse(localStorage.getItem('unnavi_destination')) } catch(e){ return null }
  })
  useEffect(()=>{
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(p=>{
        setPos({lat:p.coords.latitude, lon:p.coords.longitude})
      })
    }
  },[])

  async function handleCreate(){
    const res = await findDestination(pos.lat, pos.lon, Number(distance))
    if(res?.destination){
      const record = { createdAt: Date.now(), center: res.center, dest: res.destination }
      localStorage.setItem('unnavi_destination', JSON.stringify(record))
      setDest(record)
    } else {
      alert('目的地が見つかりませんでした。')
    }
  }

  const markers = []
  if(dest){
    markers.push({ lat: dest.dest.lat, lon: dest.dest.lon, color: 'red', text: '目的地' })
  }

  return (
    <div>
      <h2>主ページ</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label>距離 (km): <input type="number" value={distance} min="0.1" step="0.1" onChange={e=>setDistance(e.target.value)} /></label>
          <div style={{ marginTop: 8 }}>
            <button onClick={handleCreate}>目的地を指定する</button>
          </div>
          <div style={{ marginTop: 12 }}>
            <strong>現在地:</strong> {pos.lat.toFixed(6)}, {pos.lon.toFixed(6)}
          </div>
          {dest && (
            <div style={{ marginTop: 8 }}>
              <strong>最後の目的地:</strong> {dest.dest.lat.toFixed(6)}, {dest.dest.lon.toFixed(6)}<br />
              距離: {distanceKm(pos, {lat: dest.dest.lat, lon: dest.dest.lon}).toFixed(2)} km
            </div>
          )}
        </div>
        <div style={{ flex: 2 }}>
          <MapView center={[pos.lat, pos.lon]} markers={markers} />
        </div>
      </div>
    </div>
  )
}
