import React, { useEffect, useState } from 'react'
import { findDestination } from '../utils/overpass'

type Pos = { lat: number; lon: number }

interface Props {
  center: Pos
  initialDistanceKm?: number
  // onResult receives object { res, dist } where dist is in km
  onResult?: (payload: { res: any; dist: number }) => void
}

export default function DestinationControl({ center, initialDistanceKm=1, onResult }: Props){
  // store input as meters string to allow typing decimals like "500."
  const [distanceMeters, setDistanceMeters] = useState<string>(String(Math.round(initialDistanceKm*1000)))
  const [dest, setDest] = useState<any>(()=>{
    try { return JSON.parse(localStorage.getItem('unnavi_destination') || 'null') } catch(e){ return null }
  })
  const [displayMeters, setDisplayMeters] = useState<number | null>(null)
  const [status, setStatus] = useState<string>('')

  useEffect(()=>{
    // when dest stored in localStorage, reflect it
    try{
      const stored = JSON.parse(localStorage.getItem('unnavi_destination') || 'null')
      if(stored) setDest(stored)
    }catch(e){}
  }, [])

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

  async function handleCreate(){
    const meters = parseFloat(distanceMeters)
    if(Number.isNaN(meters) || meters <= 0){ alert('有効な距離を入力してください'); return }
    const distKm = meters / 1000
    console.log('DestinationControl: starting findDestination', { center, distKm })
    const res = await findDestination(center.lat, center.lon, distKm, setStatus)
    console.log('DestinationControl: result', res)
    if(res?.destination){
      const record = { createdAt: Date.now(), center: res.center, dest: res.destination }
      localStorage.setItem('unnavi_destination', JSON.stringify(record))
      setDest(record)
      const actualMeters = Math.round(distanceKm(center, { lat: res.destination.lat, lon: res.destination.lon }) * 1000)
      setDisplayMeters(actualMeters)
      onResult && onResult({ res, dist: distKm })
    } else {
      alert('目的地が見つかりませんでした。')
    }
  }

  const shownMeters = dest ? Math.round(distanceKm(center, { lat: dest.dest.lat, lon: dest.dest.lon }) * 1000) : (displayMeters ?? null)
  const isClose = shownMeters !== null && shownMeters <= 10

  return (
    <div className='container'>
      <div className={`distance-display ${isClose ? 'correct' : ''}`}>
        <span className="distance">{ shownMeters !== null ? String(shownMeters) : '--' }</span>
        <span className="unit">m</span>
      </div>
      <div></div>
      <div>
        <div className="input-box">
          <label><input type="number" placeholder="距離" size={5} value={distanceMeters} onChange={e=>setDistanceMeters(e.target.value)} /> m</label>
          <button onClick={handleCreate} style={{ marginLeft: 12 }}>生成！</button>
        </div>
        <p className="status">{status || ' '}</p>
      </div>
      <footer>
        <p>Map Data from <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a><br/>POI via <a href="https://overpass-api.de/">Overpass API</a></p>
      </footer>
    </div>
  )
}

