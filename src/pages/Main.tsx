import React, { useEffect, useState } from 'react'
import DestinationControl from '../components/DestinationControl'
import MapView from '../components/MapView'

type Pos = { lat: number; lon: number }

function distanceKm(a: Pos, b: Pos){
  const toRad = (v: number) => v*Math.PI/180
  const R = 6371
  const dLat = toRad(b.lat-a.lat)
  const dLon = toRad(b.lon-a.lon)
  const la = toRad(a.lat)
  const lb = toRad(b.lat)
  const x = Math.sin(dLat/2)**2 + Math.cos(la)*Math.cos(lb)*Math.sin(dLon/2)**2
  return R*2*Math.atan2(Math.sqrt(x), Math.sqrt(1-x))
}

export default function Main(): JSX.Element {
  const [useGNSS, setUseGNSS] = useState<boolean>(true)
  const [pos, setPos] = useState<Pos>({lat:35.681, lon:139.767})
  const [center, setCenter] = useState<Pos>(pos)
  useEffect(()=>{
    let watchId: number | null = null
    const geo: any = (navigator as any).geolocation
    if(geo && typeof geo.watchPosition === 'function'){
      try{
        watchId = geo.watchPosition(
          (p: GeolocationPosition) => updatePos({ lat: p.coords.latitude, lon: p.coords.longitude }, useGNSS),
          (err: GeolocationPositionError) => console.warn('geolocation watch error', err),
          { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
        )
      }catch(e){
        console.warn('failed to start geolocation.watchPosition', e)
      }
    } else if(geo && typeof geo.getCurrentPosition === 'function'){
      geo.getCurrentPosition((p: GeolocationPosition)=>{
        updatePos({lat:p.coords.latitude, lon:p.coords.longitude}, useGNSS)
      })
    }
    return ()=>{
      try{ if(watchId !== null && geo && typeof geo.clearWatch === 'function') geo.clearWatch(watchId) }catch(e){}
    }
  },[useGNSS])

  function updatePos(pos: Pos, useGNSS: boolean){
    setPos(pos)
    if(useGNSS) setCenter(pos)
  }

  function updateUseGNSS(enabled: boolean){
    setUseGNSS(enabled)
    if(enabled) setCenter(pos)
  }

  return (
    <div className="container">
    <DestinationControl pos={pos}center={center} onResult={(r)=>{
      console.log('Main: destination created', r)
    }} />
    <details>
      <summary>目的地の中心点</summary>
      <label><input type="checkbox" checked={useGNSS} onChange={e=>updateUseGNSS(e.currentTarget.checked)} /> 現在地を中心にする</label>
      <MapView center={center} markers={[{ lat: center.lat, lon: center.lon, color: 'red', text: '中心'}, { lat: pos.lat, lon: pos.lon, color: 'blue', text: '現在地' }]}
        onMapClick={([lat,lon])=>{
          setCenter({lat, lon})
          setUseGNSS(false)
      }} />
    </details>
    <footer>
      <p>Map Data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a><br/>POI via <a href="https://overpass-api.de/">Overpass API</a></p>
    </footer>
    </div>
  )
}
