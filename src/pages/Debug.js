import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import MapView from '../components/MapView';
import { findDestination } from '../utils/overpass';
export default function Debug() {
    const [center, setCenter] = useState({ lat: 35.681, lon: 139.767 });
    const [radiusKm, setRadiusKm] = useState(1);
    const [lastRun, setLastRun] = useState(null);
    async function run() {
        console.log('Debug: starting findDestination', { center, radiusKm });
        const res = await findDestination(center.lat, center.lon, Number(radiusKm));
        console.log('Debug: findDestination result', res);
        setLastRun(res);
    }
    const markers = [];
    // show center point on map
    markers.push({ lat: center.lat, lon: center.lon, color: 'blue', text: '中心' });
    if (lastRun) {
        if (lastRun.candidate)
            markers.push({ lat: lastRun.candidate.lat, lon: lastRun.candidate.lon, color: 'orange', text: '候補点' });
        if (lastRun.destination)
            markers.push({ lat: lastRun.destination.lat, lon: lastRun.destination.lon, color: 'red', text: '目的地' });
    }
    return (_jsxs("div", { children: [_jsx("h2", { children: "\u30C7\u30D0\u30C3\u30B0" }), _jsxs("div", { style: { display: 'flex', gap: 12 }, children: [_jsxs("div", { style: { width: 320 }, children: [_jsxs("label", { children: ["\u4E2D\u5FC3\u7DEF\u5EA6: ", _jsx("input", { value: center.lat, onChange: e => setCenter(c => ({ ...c, lat: Number(e.target.value) })) })] }), _jsx("br", {}), _jsxs("label", { children: ["\u4E2D\u5FC3\u7D4C\u5EA6: ", _jsx("input", { value: center.lon, onChange: e => setCenter(c => ({ ...c, lon: Number(e.target.value) })) })] }), _jsx("br", {}), _jsxs("label", { children: ["\u76EE\u7684\u8DDD\u96E2 (km): ", _jsx("input", { value: radiusKm, onChange: e => setRadiusKm(Number(e.target.value)) })] }), _jsx("br", {}), _jsx("div", { style: { marginTop: 8 }, children: _jsx("button", { onClick: run, children: "\u30A2\u30EB\u30B4\u30EA\u30BA\u30E0\u5B9F\u884C" }) }), _jsxs("div", { style: { marginTop: 12 }, children: [_jsxs("div", { children: [_jsx("strong", { children: "\u4E2D\u5FC3\u70B9:" }), " ", center.lat.toFixed(6), ", ", center.lon.toFixed(6)] }), _jsx("div", { style: { marginTop: 8 }, children: _jsx("strong", { children: "\u6700\u7D42\u7D50\u679C:" }) }), _jsx("pre", { style: { whiteSpace: 'pre-wrap', maxHeight: 240, overflow: 'auto', background: '#f7f7f7', padding: 8 }, children: lastRun ? JSON.stringify(lastRun, null, 2) : '未実行' }), lastRun?.attempts && _jsxs("div", { children: ["API\u547C\u3073\u51FA\u3057\u56DE\u6570: ", lastRun.attempts] })] })] }), _jsx("div", { style: { flex: 1 }, children: _jsx(MapView, { center: [center.lat, center.lon], markers: markers, circle: [
                                { center: { lat: center.lat, lon: center.lon }, radius: Number(radiusKm) * 1000 },
                                ...(lastRun?.centerCircle ? [lastRun.centerCircle] : [])
                            ], onMapClick: ([lat, lon]) => setCenter({ lat, lon }) }) })] })] }));
}
