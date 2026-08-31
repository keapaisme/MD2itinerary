/**
 * 2026 日本旅遊行動手冊 - AI Agent 原生極限 DataService 模組 (v14.0 Member Anonymization)
 * 實現成員身分切換（成員1~成員4）與景點卡片互動留言討論持久化存儲
 * <!-- Version: v1.4 | Description: 將成員個人身分標記與預設留言全數匿名更名為 成員1~成員4。 -->
 */

const DEFAULT_REAL_CHINA = {
    "title": "2026/10 杭州→福建(武夷山) 露營車自駕遊",
    "subtitle": "10/01 (四) ~ 10/07 (三) · 杭州・桐廬・千島湖・開化・江山・浦城・武夷山 7日房車慢遊",
    "sheet_name": "杭州福建露營車7日遊_公積金帳本",
    "budget_total": 10570,
    "days_count": 7,
    "days": {
        "1": {
            "date": "10/1 (十一黃金周)",
            "theme": "杭州 → 桐廬（約75km，車程約1.5小時）",
            "defense": "房車自駕離線自由停靠, 避開十一尖峰人潮車流",
            "timeline": [
                { "time": "09:00 - 11:00", "title": "🚐 房車自駕路線", "desc": "市區出發 → 錢江路 → 秋石高架 → 杭新景高速 → 桐廬出口下高速。", "duration": "約 1.5 小時", "event_type": "transport", "is_indoor": false },
                { "time": "11:00 - 13:00", "title": "📍 景點行程: 瑤琳仙境", "desc": "大型溶洞景觀，適合作為第一天輕鬆行程的收尾", "duration": "約 2 小時", "event_type": "activity", "is_indoor": true },
                { "time": "18:00 之後", "title": "⛺ 房車駐車營地與晚餐", "desc": "天目溪浪石埠／富春江沿岸露營點，晚餐採買河鮮自炊", "duration": "過夜駐車", "event_type": "activity", "is_indoor": true }
            ]
        }
    }
};

const DataService = {
    _caches: {},
    currentCountry: 'japan',
    weatherState: 'sunny',
    currentMember: '成員1', // 預設身分：成員1
    _lastSubmitTimestamp: 0,

    async getItinerary() {
        return this.getItineraryByCountry(this.currentCountry);
    },

    async getItineraryByCountry(countryKey) {
        this.currentCountry = countryKey;
        if (this._caches[countryKey]) return this._caches[countryKey];

        try {
            const res = await fetch(`data/${countryKey}.json?v=${Date.now()}`);
            if (res.ok) {
                this._caches[countryKey] = await res.json();
                return this._caches[countryKey];
            }
        } catch (e) {
            console.warn(`fetch data/${countryKey}.json 受阻:`, e);
        }

        if (countryKey === 'china') {
            this._caches['china'] = DEFAULT_REAL_CHINA;
            return DEFAULT_REAL_CHINA;
        }

        return null;
    },

    async getTransport() {
        try {
            const res = await fetch(`data/transport.json?v=${Date.now()}`);
            if (res.ok) return await res.json();
        } catch (e) {}
        return null;
    },

    setCurrentMember(member) {
        this.currentMember = member;
        localStorage.setItem('jp2026_v3_current_member', member);
    },

    getCurrentMember() {
        return localStorage.getItem('jp2026_v3_current_member') || this.currentMember;
    },

    /**
     * 景點卡片留言儲存與讀取 (Spot Comments)
     */
    getSpotComments(spotTitle) {
        const key = `jp2026_v3_comments_${this.currentCountry}_${spotTitle}`;
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);

        // 預設示範成員互動留言
        if (spotTitle.includes("橫濱紅磚倉庫") || spotTitle.includes("紅磚倉庫")) {
            return [
                { member: "成員2", role: "成員2", text: "這裡的文創雜貨店超多，我要逛 1.5 小時！", time: "7/05 14:20" },
                { member: "成員1", role: "成員1", text: "好的，吹冷氣慢慢逛，不急。", time: "7/05 14:25" }
            ];
        }
        if (spotTitle.includes("自遊小鎮房車營地") || spotTitle.includes("武夷山")) {
            return [
                { member: "成員1", role: "成員1", text: "這裡可以停露營車，晚上看印象大紅袍實景演出！", time: "9/28 10:15" }
            ];
        }

        return [];
    },

    addSpotComment(spotTitle, text) {
        const key = `jp2026_v3_comments_${this.currentCountry}_${spotTitle}`;
        const comments = this.getSpotComments(spotTitle);
        const member = this.getCurrentMember();
        
        let roleMap = { "K": "成員1", "T": "成員2", "J": "成員3", "B": "成員4", "成員1": "成員1", "成員2": "成員2", "成員3": "成員3", "成員4": "成員4" };
        
        comments.push({
            member,
            role: roleMap[member] || member,
            text,
            time: new Date().toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        });

        localStorage.setItem(key, JSON.stringify(comments));
        return comments;
    },

    setWeatherState(state) {
        this.weatherState = state;
    },

    isLoggedIn() {
        return localStorage.getItem('jp2026_v3_auth') === 'true';
    },

    setLoggedIn(status) {
        if (status) {
            localStorage.setItem('jp2026_v3_auth', 'true');
        } else {
            localStorage.removeItem('jp2026_v3_auth');
        }
    },

    getExpenses() {
        const key = `jp2026_v3_exp_${this.currentCountry}`;
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);

        if (this.currentCountry === 'taiwan') {
            return [
                { name: '機車全體95無鉛汽油加滿 (Day 1)', amount: 650, category: '機車油資', time: '8/03 08:30' },
                { name: '文章牛肉湯溫體牛餐 (Day 1)', amount: 980, category: '美食餐飲食記', time: '8/03 14:00' },
                { name: '墾丁大街夜市烤海鮮大餐 (Day 1)', amount: 1500, category: '夜市宵夜小吃', time: '8/03 19:30' },
                { name: '池上便當與三仙台門票 (Day 2)', amount: 720, category: '餐飲食記', time: '8/04 12:30' }
            ];
        } else if (this.currentCountry === 'china') {
            return [
                { name: '房車油費與過路費 (Day 1)', amount: 120, category: '交通自駕', time: '10/01 10:30' },
                { name: '瑤琳仙境門票 (Day 1)', amount: 110, category: '景點門票', time: '10/01 14:00' },
                { name: '桐廬河鮮採買與小吃', amount: 80, category: '飲食採買', time: '10/01 18:30' }
            ];
        } else if (this.currentCountry === 'swiss') {
            return [
                { name: 'Zeughauskeller 軍械庫起司火鍋', amount: 18000, category: '公積金大餐', time: '6/01 19:00' },
                { name: '格林德瓦景觀餐廳 烤起司堡', amount: 12000, category: '山頂餐飲', time: '6/02 12:30' }
            ];
        } else {
            return [
                { name: '荒井屋 和牛牛鍋(Day 1午餐)', amount: 14000, category: '公積金大餐', time: '7/10 12:30' },
                { name: '鎌倉 釜飯 蒲安(Day 2午餐)', amount: 7000, category: '平民美食', time: '7/11 14:30' }
            ];
        }
    },


    saveExpenses(items) {
        const key = `jp2026_v3_exp_${this.currentCountry}`;
        localStorage.setItem(key, JSON.stringify(items));
    },

    canSubmit() {
        const now = Date.now();
        if (now - this._lastSubmitTimestamp < 1000) return false;
        this._lastSubmitTimestamp = now;
        return true;
    }
};

window.DataService = DataService;
