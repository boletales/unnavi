import React, { useEffect, useRef } from 'react'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Marker = { lat: number; lon: number; color?: string; text?: string }
type Circle = { center: { lat: number; lon: number }; radius: number }

interface MapViewProps {
  center?: [number, number]
  markers?: Marker[]
  circle?: Circle | Circle[] | null
  onMapClick?: (coords: [number, number]) => void
}

export default function MapView({ center=[35.681,139.767], markers=[], circle=null, onMapClick }: MapViewProps){
  const ref = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(()=>{
    if(!ref.current) return
    mapRef.current = L.map(ref.current).setView(center, 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current)
    return ()=>{ mapRef.current?.remove(); mapRef.current = null }
  }, [])

  useEffect(()=>{
    if(!mapRef.current) return
    mapRef.current.setView(center, 15)
  }, [center])

  useEffect(()=>{
    if(!mapRef.current) return
    if((mapRef.current as any)._customMarkerLayer) mapRef.current.removeLayer((mapRef.current as any)._customMarkerLayer)
    const layer = L.layerGroup()
    markers.forEach(m=>{
      const mk = L.circleMarker([m.lat, m.lon], { radius:8, color: m.color || 'blue' }).bindPopup(m.text || '')
      mk.addTo(layer)
    })
    layer.addTo(mapRef.current)
    ;(mapRef.current as any)._customMarkerLayer = layer
  }, [markers])

  useEffect(()=>{
    if(!mapRef.current) return
    // remove previous circles if present
    if((mapRef.current as any)._customCircles){
      (mapRef.current as any)._customCircles.forEach((c: L.Layer) => mapRef.current?.removeLayer(c))
      ;(mapRef.current as any)._customCircles = null
    }
    if(!circle) return
    const circles = Array.isArray(circle) ? circle : [circle]
    const added: L.Layer[] = []
    circles.forEach(ci=>{
      const c = L.circle([ci.center.lat, ci.center.lon], { radius: ci.radius, color: 'orange', weight:1, fill:false })
      c.addTo(mapRef.current!)
      added.push(c)
    })
    ;(mapRef.current as any)._customCircles = added
  }, [circle])

  useEffect(()=>{
    if(!mapRef.current || !onMapClick) return
    const handler = (e: L.LeafletMouseEvent)=> onMapClick([e.latlng.lat, e.latlng.lng])
    mapRef.current.on('click', handler)
    return ()=> { mapRef.current?.off('click', handler) }
  }, [onMapClick])

  return <div ref={ref} style={{ width: '100%', height: 480 }} />
}
