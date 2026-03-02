# unnavi

ローカルで開発するための手順:

1. 依存をインストール

```bash
npm install
```

2. 開発サーバ起動

```bash
npm run dev
```

注意: プロジェクトは TypeScript に移行済みです。依存を更新したため、すでに `npm install` を実行済みでも再実行してください。

主な実装ポイント:
- `src/utils/overpass.ts`: Overpass API を使った目的地選択アルゴリズム
- `src/components/MapView.tsx`: Leaflet ベースの地図表示
- `src/pages/Main.tsx`: 主ページ（現在地・最後の目的地表示）
- `src/pages/Debug.tsx`: デバッグ用（任意中心でアルゴリズム実行）

注意: Overpass API は外部サービスです。利用頻度やレスポンスタイムは変動します。
