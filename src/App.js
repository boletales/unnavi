import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import Main from './pages/Main';
import Debug from './pages/Debug';
export default function App() {
    const [route, setRoute] = useState(window.location.hash || '#/');
    useEffect(() => {
        const onHash = () => setRoute(window.location.hash || '#/');
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);
    return (_jsxs("div", { children: [_jsxs("header", { style: { padding: 8, borderBottom: '1px solid #ddd' }, children: [_jsx("a", { href: "#/", children: "\u4E3B\u30DA\u30FC\u30B8" }), " | ", _jsx("a", { href: "#/debug", children: "\u30C7\u30D0\u30C3\u30B0" })] }), _jsxs("main", { style: { padding: 8 }, children: [route === '#/' && _jsx(Main, {}), route === '#/debug' && _jsx(Debug, {})] })] }));
}
