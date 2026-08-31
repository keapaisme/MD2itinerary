# 🗺️ 旅遊🧳手書 (MD2itinerary - Markdown to Travel Handbook Engine)
<!-- Version: v1.6 | Description: 修復 Modal 關閉遮罩機制，確保不拍復刻打卡照亦可 100% 順暢返回主頁。 -->

> **Agent-Native 動態旅遊手冊生成器與 Web 渲染引擎**  
> 自動將 Markdown 旅遊行程轉譯為含 AI 氣象預報、景點備案、KOL 開箱影音與地圖導航的 WOW 級行動裝置旅遊手冊。

---

## 🌟 專案核心特點

1. **📝 Markdown 即手冊**：只需撰寫標準 Markdown 格式行程，即可自動轉換生成完整 Web 行動手冊。
2. **🧠 AI Intelligence 增強**：自動注入「時段氣候預報」、「2大彈性備案景點」、「KOL實測開箱」與「官方預約連結」。
3. **⚡ 100% 零框架極速渲染**：基於 Vanilla JS + Modern CSS 打造，手機載入秒開，支援動態多國行程切換。
4. **🚦 交通與預算模組**：整合地鐵/公車轉乘攻略與多人公積金記帳功能。
5. **🛡️ 隱私防護與 GitHub Pages 發布**：內建自動化隱私檢查與 Git 過濾機制，防止個人隱私或敏感行程流出。

---

## 🚀 快速上手步驟 (Quick Start)

### 1. 本地開發與即時預覽 (Port 8765)
預防埠號衝突，本地開發預覽統一使用獨立 Port `8765`：
```bash
python3 -m http.server 8765
```
開啟瀏覽器訪問 `http://localhost:8765` 即可實時預覽手冊成果。

### 2. 新增或修改 DEMO 行程檔
將 DEMO 行程檔放入 `data/` 目錄中，並以 `DEMO_` 開頭命名（例如 `data/DEMO_My_Trip.md`）。

### 3. 編譯生成 JSON 數據與 AI 情報
執行通用解析器：
```bash
python3 scripts/build_json.py
```
> `build_json.py` 會自動讀取 `data/DEMO_*.md` 檔，並輸出標準 JSON 數據至 `data/*.json`。

### 4. 執行隱私檢查與數據健檢
驗證無個資洩漏並檢查 JSON 數據完整性：
```bash
python3 scripts/health_check.py
```

### 5. 部署至 GitHub Pages
執行一鍵部署與隱私防護流水線並推送到 GitHub：
```bash
bash deploy.sh
git push origin main
```

---

## 🌐 部署方式 (Deployment)

本專案靜態託管於 GitHub Pages：[https://github.com/keapaisme/MD2itinerary.git](https://github.com/keapaisme/MD2itinerary.git)
無需架設伺服器或負擔雲端運算費用，即可享受極速且安全的行動旅遊手冊體驗。
