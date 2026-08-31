# 🗺️ 旅遊🧳手書 (MD2itinerary - Markdown to Travel Handbook Engine)
<!-- Version: v2.3 | Description: 支援 100% 零遮蓋 Header 動態藝術封面、RWD 雙欄佈局與自適應 Markdown 成員人數之 Imagen 3 打卡圖自動生成系統。 -->

> **Agent-Native 動態旅遊手冊生成器與 Web 渲染引擎**  
> 自動將 Markdown 旅遊行程轉譯為含 AI 氣象預報、景點備案、KOL 開箱影音、地圖導航與吉卜力畫風打卡照的 WOW 級行動裝置旅遊手冊。

---

## 🌟 專案核心特點

1. **📝 Markdown 即手冊**：只需撰寫標準 Markdown 格式行程，即可自動轉換生成完整 Web 行動手冊。
2. **🧠 AI Intelligence 增強**：自動注入「時段氣候預報」、「2大彈性備案景點」、「KOL實測開箱」與「官方預約連結」。
3. **📸 打卡圖自動生成**：編譯時自動觸發 `generate_images.py`。調用 Imagen 3 以 `16:9` 比例與**吉卜力手繪動漫風**自動生成「動態人數自適應、風格一致、尺寸一致」的卡片打卡圖。
4. **⚡ 100% 零框架極速渲染**：基於 Vanilla JS + Modern CSS 打造，手機載入秒開，支援動態多國行程切換。
5. **🚦 交通與預算模組**：整合地鐵/公車轉乘攻略與多人公積金記帳功能。
6. **🛡️ 隱私防護與 GitHub Pages 發布**：內建自動化隱私檢查與 Git 過濾機制，防止個人隱私或敏感行程流出。

---

## 📸 卡片打卡圖自動生成系統 (Image Auto-Generator)
本系統能自動讀取行程點，並利用最新 Gemini Imagen 3 模型為每個活動景點生成精美的打卡圖，並填入卡片最上方。
* **動態人數自適應**：系統會自動探測對應 Markdown 行程檔內的人數資訊（例如標題的「3人遊」、副標題的人數標記、專屬「人數：X」欄位，或文本中的最高成員編號「成員4」），並自動為 Imagen 3 組裝符合該人數（1人、2人、3人、4人，或 $N$ 人組）的 `CHARACTER_PROMPT`。
* **人物特徵與畫風一致性**：主角角色群穿著一致的日系夏日服裝，以日系溫馨手繪吉卜力賽璐璐動漫風呈現。
* **運行方式**：在環境變數中設定 `GEMINI_API_KEY` 即可啟用實體生成；若無 API 金鑰，系統將以 Fallback 模式在 JSON 寫入圖片路徑，若本地已有快取/預置圖片（如 Taiwan 3 日遊之 Demo 圖片）即可直接顯示。

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

### 3. 編譯生成 JSON 數據、AI 情報與打卡照
在終端機中，設定 API Key 並執行通用解析器：
```bash
export GEMINI_API_KEY="your_api_key_here"
python3 scripts/build_json.py
```
> `build_json.py` 會自動讀取 `data/DEMO_*.md` 檔，輸出 JSON，並自動觸發 `generate_images.py` 在 `images/` 下生成並下載打卡圖。

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
