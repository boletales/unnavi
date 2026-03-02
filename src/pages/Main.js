import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import MapView from '../components/MapView';
import { findDestination } from '../utils/overpass';
function distanceKm(a, b) {
    const toRad = (v) => v * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const la = toRad(a.lat);
    const lb = toRad(b.lat);
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(la) * Math.cos(lb) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
export default function Main() {
    const [pos, setPos] = useState({ lat: 35.681, lon: 139.767 });
    const [distance, setDistance] = useState(1);
    const [dest, setDest] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('unnavi_destination') || 'null');
        }
        catch (e) {
            return null;
        }
    });
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(p => {
                setPos({ lat: p.coords.latitude, lon: p.coords.longitude });
            });
        }
    }, []);
    async function handleCreate() {
        const res = await findDestination(pos.lat, pos.lon, Number(distance));
        if (res?.destination) {
            const record = { createdAt: Date.now(), center: res.center, dest: res.destination };
            localStorage.setItem('unnavi_destination', JSON.stringify(record));
            setDest(record);
        }
        else {
            alert('目的地が見つかりませんでした。');
        }
    }
    const markers = [];
    if (dest) {
        markers.push({ lat: dest.dest.lat, lon: dest.dest.lon, color: 'red', text: '目的地' });
    }
    return (_jsxs("div", { children: [_jsx("h2", { children: "\u4E3B\u30DA\u30FC\u30B8" }), _jsxs("div", { style: { display: 'flex', gap: 12 }, children: [_jsxs("div", { style: { flex: 1 }, children: [_jsxs("label", { children: ["\u8DDD\u96E2 (km): ", _jsx("input", { type: "number", value: distance, min: 0.1, step: 0.1, onChange: e => setDistance(Number(e.target.value)) })] }), _jsx("div", { style: { marginTop: 8 }, children: _jsx("button", { onClick: handleCreate, children: "\u76EE\u7684\u5730\u3092\u6307\u5B9A\u3059\u308B" }) }), _jsxs("div", { style: { marginTop: 12 }, children: [_jsx("strong", { children: "\u73FE\u5728\u5730:" }), " ", pos.lat.toFixed(6), ", ", pos.lon.toFixed(6)] }), dest && (_jsxs("div", { style: { marginTop: 8 }, children: [_jsx("strong", { children: "\u6700\u5F8C\u306E\u76EE\u7684\u5730:" }), " ", dest.dest.lat.toFixed(6), ", ", dest.dest.lon.toFixed(6), _jsx("br", {}), "\u8DDD\u96E2: ", distanceKm(pos, { lat: dest.dest.lat, lon: dest.dest.lon }).toFixed(2), " km"] }))] }), _jsx("div", { style: { flex: 2 }, children: _jsx(MapView, { center: [pos.lat, pos.lon], markers: markers }) })] })] }));
}
