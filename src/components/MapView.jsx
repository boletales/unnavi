import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapView({ center=[35.681,139.767], markers=[], circle=null, onMapClick }){
  const ref = useRef(null)
  const mapRef = useRef(null)

  useEffect(()=>{
    if(!ref.current) return
    mapRef.current = L.map(ref.current).setView(center, 15)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapRef.current)
    return ()=>{ mapRef.current.remove() }
  }, [])

  useEffect(()=>{
    if(!mapRef.current) return
    mapRef.current.setView(center, 15)
  }, [center])

  useEffect(()=>{
    if(!mapRef.current) return
    // clear marker layer
    if(mapRef.current._customMarkerLayer) mapRef.current.removeLayer(mapRef.current._customMarkerLayer)
    const layer = L.layerGroup()
    markers.forEach(m=>{
      const mk = L.circleMarker([m.lat, m.lon], { radius:8, color: m.color || 'blue' }).bindPopup(m.text || '')
      mk.addTo(layer)
    })
    layer.addTo(mapRef.current)
    mapRef.current._customMarkerLayer = layer
  }, [markers])

  useEffect(()=>{
    if(!mapRef.current) return
    if(mapRef.current._customCircle) mapRef.current.removeLayer(mapRef.current._customCircle)
    if(circle){
      const c = L.circle([circle.center.lat, circle.center.lon], { radius: circle.radius, color: 'orange', weight:1 })
      c.addTo(mapRef.current)
      mapRef.current._customCircle = c
    }
  }, [circle])

  useEffect(()=>{
    if(!mapRef.current || !onMapClick) return
    const handler = (e)=> onMapClick([e.latlng.lat, e.latlng.lng])
    mapRef.current.on('click', handler)
    return ()=> mapRef.current.off('click', handler)
  }, [onMapClick])

  return <div ref={ref} style={{ width: '100%', height: 480 }} />
}
