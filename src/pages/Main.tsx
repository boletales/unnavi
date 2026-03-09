import React, { useEffect, useState } from 'react'
import DestinationControl from '../components/DestinationControl'

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
  const [pos, setPos] = useState<Pos>({lat:35.681, lon:139.767})
  useEffect(()=>{
    let watchId: number | null = null
    const geo: any = (navigator as any).geolocation
    if(geo && typeof geo.watchPosition === 'function'){
      try{
        watchId = geo.watchPosition(
          (p: GeolocationPosition) => setPos({ lat: p.coords.latitude, lon: p.coords.longitude }),
          (err: GeolocationPositionError) => console.warn('geolocation watch error', err),
          { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
        )
      }catch(e){
        console.warn('failed to start geolocation.watchPosition', e)
      }
    } else if(geo && typeof geo.getCurrentPosition === 'function'){
      geo.getCurrentPosition((p: GeolocationPosition)=>{
        setPos({lat:p.coords.latitude, lon:p.coords.longitude})
      })
    }
    return ()=>{
      try{ if(watchId !== null && geo && typeof geo.clearWatch === 'function') geo.clearWatch(watchId) }catch(e){}
    }
  },[])

  return (
    <DestinationControl center={pos} onResult={(r)=>{
      console.log('Main: destination created', r)
    }} />
  )
}
