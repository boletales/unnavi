type Pos = { lat: number; lon: number }

function destPoint(lat: number, lon: number, bearingDeg: number, distanceKm: number): Pos {
  const R = 6371
  const br = bearingDeg*Math.PI/180
  const lat1 = lat*Math.PI/180
  const lon1 = lon*Math.PI/180
  const d = distanceKm / R
  const lat2 = Math.asin(Math.sin(lat1)*Math.cos(d) + Math.cos(lat1)*Math.sin(d)*Math.cos(br))
  const lon2 = lon1 + Math.atan2(Math.sin(br)*Math.sin(d)*Math.cos(lat1), Math.cos(d)-Math.sin(lat1)*Math.sin(lat2))
  return { lat: lat2*180/Math.PI, lon: lon2*180/Math.PI }
}

export async function findDestination(centerLat: number, centerLon: number, distanceKm: number, setStatus: (status: string) => void): Promise<any | null> {
  const tries = 12
  const spinner = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']
  let spinnerIndex = 0
  let currentAttempt = 0
  let status = '初期化中……'
  // start a timer that updates status at a steady interval
  let intervalId: number | null = null
  try{
    intervalId = setInterval(()=>{
      try{ setStatus(`${spinner[spinnerIndex]} ${status} (#${currentAttempt})`) }catch(e){}
      spinnerIndex = (spinnerIndex + 1) % spinner.length
    }, 50) as unknown as number
  }catch(e){
    // ignore if setInterval or setStatus not available in environment
  }

  for(let i=0;i<tries;i++){
    const attempt = i+1
    currentAttempt = attempt
    const bearing = Math.random()*360
    const candidate = destPoint(centerLat, centerLon, bearing, distanceKm)
    const radius = 100
    const q = `[
out:json][timeout:25];\nway["highway"~"^(residential|living_street|pedestrian|footway|path|unclassified)$"]["access"!~"^(private|no|customers)$"]["indoor"!="yes"](around:${radius},${candidate.lat},${candidate.lon});out geom;`;
    console.log(`Overpass: attempt ${attempt}, candidate=${candidate.lat.toFixed(6)},${candidate.lon.toFixed(6)}, radius=${radius}m`)
    try{
      status = `データ取得中……`
      console.log(`Calling Overpass API (attempt ${attempt})...`)
      const resp = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(q)
      })
      const data = await resp.json()
      const ways = (data.elements||[]).filter((e: any)=>e.type==='way' && e.geometry && e.geometry.length>0)
      console.log(`Overpass: received ${ways.length} ways (attempt ${attempt})`)
      if(ways.length===0){
        status = '候補なし 再試行中……'
        console.log('Overpass: no suitable ways found, retrying...')
        continue
      }
      status = '候補選定中……'
      const way = ways[Math.floor(Math.random()*ways.length)]
      const geom = way.geometry
      const pt = geom[Math.floor(Math.random()*geom.length)]
      console.log(`Overpass: selected destination ${pt.lat.toFixed(6)},${pt.lon.toFixed(6)} (attempt ${attempt})`)
      try{ setStatus('目的地選定完了') }catch(e){}
      // clear interval and status before returning
      try{ if(intervalId!==null) clearInterval(intervalId) }catch(e){}
      try{ setStatus('') }catch(e){}
      return {
        center: { lat: centerLat, lon: centerLon },
        candidate: { lat: candidate.lat, lon: candidate.lon },
        destination: { lat: pt.lat, lon: pt.lon },
        centerCircle: { center: { lat: candidate.lat, lon: candidate.lon }, radius },
        attempts: attempt
      }
    }catch(e){
      status = '通信エラー 再試行中……'
      console.warn(`Overpass: fetch failed (attempt ${attempt})`, e)
      continue
    }
  }
  // clear interval and set final message
  try{ if(intervalId!==null) clearInterval(intervalId) }catch(e){}
  try{ setStatus('目的地選定失敗……') }catch(e){}
  console.log('Overpass: all attempts exhausted, no destination found')
  return null
}
