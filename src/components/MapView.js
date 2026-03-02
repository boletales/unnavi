import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
export default function MapView({ center = [35.681, 139.767], markers = [], circle = null, onMapClick }) {
    const ref = useRef(null);
    const mapRef = useRef(null);
    useEffect(() => {
        if (!ref.current)
            return;
        mapRef.current = L.map(ref.current).setView(center, 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapRef.current);
        return () => { mapRef.current?.remove(); mapRef.current = null; };
    }, []);
    useEffect(() => {
        if (!mapRef.current)
            return;
        mapRef.current.setView(center, 15);
    }, [center]);
    useEffect(() => {
        if (!mapRef.current)
            return;
        if (mapRef.current._customMarkerLayer)
            mapRef.current.removeLayer(mapRef.current._customMarkerLayer);
        const layer = L.layerGroup();
        markers.forEach(m => {
            const mk = L.circleMarker([m.lat, m.lon], { radius: 8, color: m.color || 'blue' }).bindPopup(m.text || '');
            mk.addTo(layer);
        });
        layer.addTo(mapRef.current);
        mapRef.current._customMarkerLayer = layer;
    }, [markers]);
    useEffect(() => {
        if (!mapRef.current)
            return;
        // remove previous circles if present
        if (mapRef.current._customCircles) {
            mapRef.current._customCircles.forEach((c) => mapRef.current?.removeLayer(c));
            mapRef.current._customCircles = null;
        }
        if (!circle)
            return;
        const circles = Array.isArray(circle) ? circle : [circle];
        const added = [];
        circles.forEach(ci => {
            const c = L.circle([ci.center.lat, ci.center.lon], { radius: ci.radius, color: 'orange', weight: 1, fill: false });
            c.addTo(mapRef.current);
            added.push(c);
        });
        mapRef.current._customCircles = added;
    }, [circle]);
    useEffect(() => {
        if (!mapRef.current || !onMapClick)
            return;
        const handler = (e) => onMapClick([e.latlng.lat, e.latlng.lng]);
        mapRef.current.on('click', handler);
        return () => { mapRef.current?.off('click', handler); };
    }, [onMapClick]);
    return _jsx("div", { ref: ref, style: { width: '100%', height: 480 } });
}
