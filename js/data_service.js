/**
 * 2026 日本旅遊行動手冊 - AI Agent 原生極限 DataService 模組 (v14.0 Member Anonymization)
 * 實現成員身分切換（成員1~成員4）與景點卡片互動留言討論持久化存儲
 * <!-- Version: v1.4 | Description: 將成員個人身分標記與預設留言全數匿名更名為 成員1~成員4。 -->
 */

const DEFAULT_REAL_CHINA = {
    "title": "2026 中國大理江南古鎮 7日遊",
    "subtitle": "9/15 (二) ~ 9/21 (一) · 上海・蘇州・大理洱海古典水鄉巡禮",
    "sheet_name": "2026大理江南水鄉遊_公積金帳本",
    "budget_total": 10625,
    "days_count": 7,
    "hotels": [
        {
            "date": "9/15 - 9/17 (Day 1 - Day 2)",
            "name": "上海隱秀歷史洋房飯店 (Hidden House Shanghai)",
            "address": "上海市徐匯區武康路 108 號",
            "access": "地鐵 10 / 11 號線交通大學站 7 號出口",
            "phone": "+86 21 6431 8888",
            "notes": "梧桐樹下民國歷史老洋房，獨立花園與文青美學設計。"
        },
        {
            "date": "9/17 - 9/21 (Day 3 - Day 7)",
            "name": "大理雙廊海景第一排客棧 (Dali Double Waves Resort)",
            "address": "雲南省大理白族自治州大理市雙廊鎮環海東路 68 號",
            "access": "大理鳳儀機場專車直達（車程約 40 分鐘）",
            "phone": "+86 872 268 9999",
            "notes": "正對洱海與蒼山，每房皆有陽台觀海浴缸，含白族特色下午茶。"
        }
    ],
    "days": {
        "1": { "date": "9/15 二", "theme": "📅 Day 1(9/15 二) 上海外灘夜景與武康路洋房漫步", "defense": "落地機場專車接送,避開地鐵通勤塞車", "timeline": [{ "time": "14:00 - 15:30", "title": "浦東機場 ➔ 武康路歷史文化街區", "desc": "專車直達徐匯區，入住隱秀歷史洋房飯店。", "event_type": "activity", "is_indoor": true }, { "time": "16:00 - 18:30", "title": "武康大樓與安福路文青雜貨慢逛", "desc": "漫步梧桐樹下，採購獨立設計師器皿與文創精品。", "event_type": "activity", "is_indoor": false }, { "time": "19:00 - 21:00", "title": "外灘萬國建築群與黃浦江遊船夜景", "desc": "登船飽覽陸家嘴摩天大樓與萬國建築群璀璨燈火。", "event_type": "activity", "is_indoor": true }] },
        "2": { "date": "9/16 水", "theme": "📅 Day 2(9/16 水) 蘇州園林與古鎮水鄉慢活", "defense": "高鐵特快 25 分鐘直達古城,避開公路塞車", "timeline": [{ "time": "09:00 - 09:30", "title": "上海虹橋 ➔ 蘇州站 (高鐵特快)", "desc": "搭乘極速高鐵，25 分鐘舒適抵達蘇州古城。", "event_type": "transport", "is_indoor": false }, { "time": "10:00 - 12:30", "title": "拙政園與蘇州博物館 (大師貝聿銘經典)", "desc": "參觀世界文化遺產江南古典園林代表與建築藝術。", "event_type": "activity", "is_indoor": true }, { "time": "14:00 - 17:00", "title": "平江路歷史街區與搖櫓船漫遊", "desc": "沿小橋流水人家品嚐蘇式糕點與評彈茶館體驗。", "event_type": "activity", "is_indoor": false }] },
        "3": { "date": "9/17 木", "theme": "📅 Day 3(9/17 木) 飛赴雲南大理・洱海海景飯店 Check-in", "defense": "跨省飛躍! 抵達風花雪月大理古城", "timeline": [{ "time": "10:00 - 13:30", "title": "飛機大直達(上海 ➔ 大理鳳儀機場)", "desc": "飛越雲貴高原，抵達大理洱海之畔。", "event_type": "transport", "is_indoor": false }, { "time": "14:30 - 17:30", "title": "雙廊古鎮與洱海海景咖啡慢時光", "desc": "入住雙廊海景第一排客棧，平視蔚藍洱海與蒼山山脈。", "event_type": "activity", "is_indoor": true }] },
        "4": { "date": "9/18 金", "theme": "📅 Day 4(9/18 金) 洱海環海西路敞篷車慢巡與喜洲古鎮", "defense": "白族藍染歷史與喜洲粑粑品嚐", "timeline": [{ "time": "09:30 - 12:00", "title": "喜洲古鎮與轉角樓打卡", "desc": "漫步白族民居建築群，體驗扎染工藝與喜洲粑粑。", "event_type": "activity", "is_indoor": false }, { "time": "14:00 - 17:30", "title": "廊橋與生態廊道單車騎行", "desc": "在洱海最美麗的生態廊道騎行，感受微風吹拂。", "event_type": "activity", "is_indoor": false }] },
        "5": { "date": "9/19 土", "theme": "📅 Day 5(9/19 土) 蒼山索道登頂與寂照庵素齋", "defense": "登高遠眺洱海全景與網紅多肉植物古寺", "timeline": [{ "time": "09:00 - 12:00", "title": "感通索道登蒼山與清碧溪漫步", "desc": "乘索道穿過雲霧，俯瞰大理古城與洱海全貌。", "event_type": "activity", "is_indoor": false }, { "time": "12:30 - 14:30", "title": "寂照庵享用精緻多肉素齋", "desc": "體驗全中國最美多肉植物寺廟與禪意午餐。", "event_type": "activity", "is_indoor": true }] },
        "6": { "date": "9/20 日", "theme": "📅 Day 6(9/20 日) 大理古城洋人街與人民路夜生活", "defense": "漫步千年古城牆與手作民謠酒吧", "timeline": [{ "time": "10:00 - 13:00", "title": "大理古城五華樓與床單廠文創園", "desc": "逛舊工廠活化的手作文創市集與獨立書店。", "event_type": "activity", "is_indoor": true }, { "time": "19:00 - 22:00", "title": "人民路民謠酒吧與清酒吧音樂饗宴", "desc": "聆聽在地獨立音樂人創作，享受涼爽古城夜晚。", "event_type": "activity", "is_indoor": true }] },
        "7": { "date": "9/21 一", "theme": "📅 Day 7(9/21 一) 滿載伴手禮與返程飛航", "defense": "完美返航,帶著風花雪月的美好回憶", "timeline": [{ "time": "09:00 - 11:00", "title": "採購雲南普洱茶與鮮花餅伴手禮", "desc": "採買新鮮現烤嘉華鮮花餅與老普洱茶餅。", "event_type": "activity", "is_indoor": true }, { "time": "13:00 - 16:30", "title": "大理機場返航", "desc": "搭機順利返航，圓滿結束 7 日水鄉與高原之旅。", "event_type": "transport", "is_indoor": false }] }
    }
};

const DEFAULT_JAPAN = {
    "title": "2026 東京關東經典 5日遊",
    "subtitle": "10/10 (六) ~ 10/14 (三) · 淺草晴空塔・富士山河口湖・鎌倉大佛・澀谷Sky奢華體驗",
    "sheet_name": "2026東京關東遊_公積金帳本",
    "budget_total": 150000,
    "days_count": 5,
    "hotels": [
        {
            "date": "10/10 - 10/12 (Day 1 - Day 2)",
            "name": "東京站丸之內飯店 (Marunouchi Hotel Tokyo)",
            "address": "東京都千代田區丸之內 1-6-3",
            "access": "JR 東京站丸之內北口直結步行 1 分鐘",
            "phone": "+81 3-3217-1111",
            "notes": "直通東京車站地鐵線，前往淺草、新宿極度便利，附贈精緻日式庭園早餐。"
        },
        {
            "date": "10/12 - 10/14 (Day 3 - Day 4)",
            "name": "澀谷 Stream 威斯汀酒店 (Shibuya Stream Hotel)",
            "address": "東京都澀谷區澀谷 3-21-3",
            "access": "澀谷站 C2 出口直結",
            "phone": "+81 3-5778-9000",
            "notes": "下樓即為澀谷 Stream 潮流美景區，步行 3 分鐘即可到達 Shibuya Sky 與澀谷十字路口。"
        }
    ],
    "days": {
        "1": {
            "date": "10/10 六",
            "theme": "📅 Day 1(10/10 六) 抵達東京成田與淺草下町夜漫步",
            "defense": "成田 Express 直達市區, 體驗東京經典下町風情",
            "timeline": [
                { "time": "12:30 - 14:00", "title": "成田國際機場 ➔ 東京站 / 淺草", "desc": "搭乘 N'EX 成田特快直達東京站，入住飯店辦理 Check-in。", "event_type": "activity", "is_indoor": true },
                { "time": "15:00 - 17:30", "title": "淺草寺與雷門老街漫步", "desc": "參觀東京最古老寺廟淺草寺，走訪仲見世通商店街品嚐人形燒。", "event_type": "activity", "is_indoor": false },
                { "time": "18:30 - 21:00", "title": "東京晴空塔 (Tokyo Skytree) 展望台夜景", "desc": "登頂 350M 展望台俯瞰東京夜景，夜間照明美不勝收。", "event_type": "activity", "is_indoor": true }
            ]
        },
        "2": {
            "date": "10/11 日",
            "theme": "📅 Day 2(10/11 日) 富士山河口湖全景絕景一日漫遊",
            "defense": "富士回遊特快直達, 欣賞富士山倒影與楓葉大道",
            "timeline": [
                { "time": "08:30 - 10:30", "title": "新宿 ➔ 河口湖 (富士回遊特快)", "desc": "搭乘直達特快列車直達河口湖站。", "event_type": "transport", "is_indoor": false },
                { "time": "11:00 - 13:30", "title": "新倉山淺間公園與忠靈塔遠眺富士山", "desc": "爬上 398 階梯拍攝富士山與五重塔經典打卡風景。", "event_type": "activity", "is_indoor": false },
                { "time": "14:30 - 17:00", "title": "河口湖大石公園與全景纜車", "desc": "漫步湖畔花園，乘坐纜車至天上山公園俯瞰河口湖全貌。", "event_type": "activity", "is_indoor": false }
            ]
        },
        "3": {
            "date": "10/12 一",
            "theme": "📅 Day 3(10/12 一) 鎌倉古都古神社與江之島海岸線慢活",
            "defense": "江之電海岸鐵道體驗, 古都神社與灌籃高手平交道打卡",
            "timeline": [
                { "time": "09:00 - 10:00", "title": "東京 ➔ 鎌倉 (JR 湘南新宿線)", "desc": "搭乘直達列車抵達古都鎌倉。", "event_type": "transport", "is_indoor": false },
                { "time": "10:30 - 12:30", "title": "高德院鎌倉大佛與鶴岡八幡宮", "desc": "參觀國寶青銅大佛與鎌倉幕府時期古老神社。", "event_type": "activity", "is_indoor": false },
                { "time": "14:00 - 17:00", "title": "江之電高校前平交道與江之島夕陽漫步", "desc": "搭乘江之電打卡灌籃高手經典名場面，前往江之島遠眺相模灣夕陽。", "event_type": "activity", "is_indoor": false }
            ]
        },
        "4": {
            "date": "10/13 二",
            "theme": "📅 Day 4(10/13 二) 澀谷潮流心臟與 Shibuya Sky 天空展望台", "defense": "澀谷購物潮流中心, 360 度無死角展望露台俯瞰東京",
            "timeline": [
                { "time": "10:00 - 13:00", "title": "澀谷十字路口與潮流商場逛街 (Shibuya Parco / Scramble Square)", "desc": "體驗全球最繁忙十字路口，漫步 Nintendo TOKYO 與寶可夢中心。", "event_type": "activity", "is_indoor": true },
                { "time": "14:30 - 17:00", "title": "明治神宮與表參道精品街漫步", "desc": "參觀森林包圍的明治神宮，隨後漫步表參道建築群與特色咖啡館。", "event_type": "activity", "is_indoor": false },
                { "time": "17:30 - 19:30", "title": "Shibuya Sky 45F 露天展望台夕陽與夜景", "desc": "登頂 229 公尺高空，享受 360 度開放式露天夕陽美景。", "event_type": "activity", "is_indoor": true }
            ]
        },
        "5": {
            "date": "10/14 三",
            "theme": "📅 Day 5(10/14 三) 銀座奢華漫步與免稅伴手禮採買返航", "defense": "銀座免稅品採購, N'EX 快適回程",
            "timeline": [
                { "time": "10:00 - 12:30", "title": "銀座 Six 與伊東屋文具精品採買", "desc": "漫步銀座中央通，採購精緻伴手禮與文房具。", "event_type": "activity", "is_indoor": true },
                { "time": "13:30 - 15:30", "title": "東京站 / 淺草 ➔ 成田國際機場 (N'EX 特快)", "desc": "搭乘成田特快返航，圓滿結束 5 日東京關東奢華漫遊。", "event_type": "transport", "is_indoor": false }
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

        // 極速降級備用資料 (確保 100% 不白屏卡死)
        this._caches['japan'] = DEFAULT_JAPAN;
        return DEFAULT_JAPAN;
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
                { name: '機車全體95無鉛汽油加滿 (Day 1)', amount: 650, category: '機車油資', time: '11/06 08:30' },
                { name: '文章牛肉湯溫體牛餐 (Day 1)', amount: 980, category: '美食餐飲食記', time: '11/06 14:00' },
                { name: '太魯閣晶英峽谷下午茶 (Day 1)', amount: 1800, category: '飯店餐飲', time: '11/06 16:30' },
                { name: '墾丁大街夜市現切海鮮 (Day 2)', amount: 1500, category: '夜市小吃', time: '11/07 19:30' }
            ];
        } else if (this.currentCountry === 'china') {
            return [
                { name: '上海老飯店 本幫菜大餐 (Day 1)', amount: 8500, category: '公積金餐飲', time: '9/15 19:00' },
                { name: '蘇州高鐵特快與松鶴樓鬆鼠桂魚 (Day 2)', amount: 7200, category: '高鐵美食', time: '9/16 12:30' },
                { name: '大理酸辣魚與野生菌火鍋 (Day 3)', amount: 6000, category: '雲南特色餐', time: '9/17 18:00' }
            ];
        } else if (this.currentCountry === 'swiss') {
            return [
                { name: 'Zeughauskeller 軍械庫起司火鍋 (Day 1)', amount: 180, category: '公積金大餐', time: '6/12 19:00' },
                { name: '格林德瓦景觀餐廳 烤起司堡 (Day 2)', amount: 120, category: '山頂餐飲', time: '6/13 12:30' },
                { name: '少女峰艾格快線纜車票 (Day 3)', amount: 450, category: '交通纜車', time: '6/14 08:30' }
            ];
        } else if (this.currentCountry === 'paris') {
            return [
                { name: 'Bateaux Parisiens 塞納河晚餐遊船 (Day 1)', amount: 350, category: '法式晚餐', time: '10/12 19:00' },
                { name: 'Eiffel Tower 天望登頂優先電梯 (Day 2)', amount: 120, category: '景點門票', time: '10/13 10:00' },
                { name: '凡爾賽宮鏡廳與皇家花園門票 (Day 3)', amount: 90, category: '宮殿門票', time: '10/14 09:30' }
            ];
        } else {
            return [
                { name: '淺草下町壽司與和牛燒肉 (Day 1午餐)', amount: 8500, category: '公積金餐飲', time: '10/10 12:30' },
                { name: '晴空塔天望甲板門票與夜景餐 (Day 1晚餐)', amount: 12000, category: '高空大餐', time: '10/10 19:00' },
                { name: '富士山河口湖全景纜車票 (Day 2)', amount: 4500, category: '景點纜車', time: '10/11 14:00' },
                { name: '鎌倉小町通手作小吃與名物 (Day 3)', amount: 3200, category: '古都小吃', time: '10/12 12:00' }
            ];
        }
    },


    isLoggedIn() {
        return localStorage.getItem('jp2026_v3_is_logged_in') === 'true';
    },

    setLoggedIn(status) {
        if (status) {
            localStorage.setItem('jp2026_v3_is_logged_in', 'true');
        } else {
            localStorage.removeItem('jp2026_v3_is_logged_in');
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
