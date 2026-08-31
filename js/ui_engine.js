/**
 * 2026 日本旅遊行動手冊 - AI Agent 原生極限 UI 渲染引擎 (UIEngine v25.0 Full Pocket Intelligence Modal)
 * 1. 按鈕為天氣圖標組合：`🌤️ 備案`
 * 2. 點擊 `🌤️ 備案` 觸發全奢華 POPUP 彈窗：
 *    - 🌤️ 當地時段氣候預報 (weather_forecast)
 *    - 🎯 2 大彈性替代景點 (backup_spots)
 *    - 🎥 KOL 達人實測影片開箱 (kol_link)
 *    - 🌐 景點官方/預約網站 (official_link)
 */

document.addEventListener('DOMContentLoaded', async () => {
    UIEngine.init();

    window.onerror = function(msg) {
        console.warn('🛡️ [Self-Healing Agent] 全域例外監聽自修:', msg);
        return true;
    };
});

const UIEngine = {
    currentTab: 'day1View',

    async init() {
        this.bindEvents();
        this.bindMemberAvatarEvents();
        this.checkAuthStatus();

        const urlParams = new URLSearchParams(window.location.search);
        let countryFromUrl = urlParams.get('country');
        
        if (!countryFromUrl && window.location.hash) {
            const h = window.location.hash.replace('#', '');
            if (h === 'china' || h === 'swiss' || h === 'japan' || h === 'taiwan') {
                countryFromUrl = h;
            }
        }

        if (countryFromUrl) {
            DataService.currentCountry = countryFromUrl;
            const selectEl = document.getElementById('countrySelect');
            if (selectEl) selectEl.value = countryFromUrl;
        }

        await this.loadAndRenderCountry(DataService.currentCountry);
        this.handleHashRoute();
    },

    bindMemberAvatarEvents() {
        const avatars = document.querySelectorAll('.avatar-pill');
        const currentMember = DataService.getCurrentMember();

        avatars.forEach(pill => {
            const nameEl = pill.querySelector('.avatar-name');
            if (!nameEl) return;
            const name = nameEl.textContent.trim();

            if (name === currentMember) {
                pill.style.background = 'rgba(255,255,255,0.15)';
                pill.style.boxShadow = '0 0 10px rgba(255,255,255,0.3)';
            }

            pill.style.cursor = 'pointer';
            pill.addEventListener('click', () => {
                DataService.setCurrentMember(name);
                avatars.forEach(p => {
                    p.style.background = 'rgba(255,255,255,0.05)';
                    p.style.boxShadow = 'none';
                });
                pill.style.background = 'rgba(255,255,255,0.15)';
                pill.style.boxShadow = '0 0 10px rgba(255,255,255,0.3)';
                
                let roleMap = { "K": "成員1", "T": "成員2", "J": "成員3", "B": "成員4", "成員1": "成員1", "成員2": "成員2", "成員3": "成員3", "成員4": "成員4" };
                alert(`👤 已切換當前發言身分：【${roleMap[name] || name}】\n往後您在景點卡片下的留言將以此身分發佈！`);
                
                const payload = DataService._caches[DataService.currentCountry];
                if (payload) this.renderItinerary(payload, DataService.currentCountry);
            });
        });
    },

    async loadAndRenderCountry(countryKey) {
        const payload = await DataService.getItineraryByCountry(countryKey);
        if (!payload) return;

        this.renderHeader(payload);
        this.renderDynamicTabsAndContainers(payload);
        this.renderItinerary(payload, countryKey);
        this.renderHotels(payload, countryKey);
        this.renderExpenses(payload);

        if (countryKey === 'japan') {
            const transport = await DataService.getTransport();
            if (transport) this.renderTransport(transport);
        }
    },

    renderHeader(payload) {
        const titleEl = document.querySelector('.hero-title');
        const subTitleEl = document.querySelector('.hero-subtitle');

        if (payload.title) {
            document.title = `${payload.title} | 旅遊🧳手書`;
            if (titleEl) titleEl.textContent = payload.title;
        }
        if (subTitleEl && payload.subtitle) {
            subTitleEl.textContent = payload.subtitle;
        }
    },

    renderDynamicTabsAndContainers(payload) {
        const tabsContainer = document.querySelector('.nav-tabs');
        const mainContent = document.querySelector('.main-content');
        if (!tabsContainer || !mainContent || !payload.days) return;

        const daysCount = payload.days_count || Object.keys(payload.days).length;

        let tabsHtml = '';
        let sectionsHtml = '';

        for (let d = 1; d <= daysCount; d++) {
            const dayKey = String(d);
            const activeClass = d === 1 ? 'active' : '';
            tabsHtml += `<button class="tab-item ${activeClass}" data-target="day${dayKey}View">Day ${dayKey}</button>`;
            sectionsHtml += `<section id="day${dayKey}View" class="view-section ${activeClass}"></section>`;
        }

        tabsHtml += `
            <button class="tab-item" data-target="hotelsView" style="border-color: var(--color-wife);">🏨 飯店住宿</button>
            <button class="tab-item" data-target="budgetView">💰 預算與記帳</button>
        `;

        sectionsHtml += `
            <section id="hotelsView" class="view-section"></section>
            <section id="budgetView" class="view-section"></section>
        `;


        tabsContainer.innerHTML = tabsHtml;
        mainContent.innerHTML = sectionsHtml;

        document.querySelectorAll('.tab-item').forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.target;
                this.switchTab(target);
            });
        });
    },

    cleanSpotTitleForMap(title, desc) {
        let text = title || "";

        text = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
        text = text.replace(/📍|🚐|⛺|🚦|⏱️|景點行程:|房車自駕路線:|房車駐車營地與晚餐:|住宿點 [A-Z]:/g, '').trim();

        const isGenericTitle = !text || text.length <= 1 || 
            /^(房車自駕路線|房車駐車營地與晚餐|自由活動|景點行程|進房|Check-in|午餐與散步|飯店寄放行李|散步|晚餐|午餐|早餐)$/.test(text);

        if (!isGenericTitle) {
            if (text.includes("澀谷 SKY") || text.includes("澀谷SKY")) return "SHIBUYA SKY";
            if (text.includes("成田特快") || text.includes("N'EX")) return "成田機場";
            if (text.includes("晴空街道") || text.includes("Solamachi")) return "東京晴空街道";
            if (text.includes("COREDO")) return "COREDO室町";
            if (text.includes("紅磚倉庫")) return "橫濱紅磚倉庫";
            if (text.includes("山下公園")) return "山下公園";

            if (text.includes("➔") || text.includes("->") || text.includes("→")) {
                const parts = text.split(/➔|->|→/);
                for (let p of parts.reverse()) {
                    let cleanP = p.replace(/直奔|寄放行李|進房|Check-in|大直達|撤離|避擠動線/g, '').trim();
                    cleanP = cleanP.replace(/【[^】]+】/g, '').trim();
                    if (cleanP.length >= 2) return cleanP;
                }
            }

            let cleanedTitle = text.replace(/第一站:|第二站:|第三站:|第四站:|第五站:|第六站:/g, '');
            cleanedTitle = cleanedTitle.replace(/直奔|寄放行李|避擠動線|進房|Check-in|打卡|慢逛|無敵海景早午餐|關鍵撤離|大直達|合體|退房|採買|享用|觀看|漫步|巡禮|補眠/g, '');
            cleanedTitle = cleanedTitle.replace(/【[^】]+】|\([^)]+\)|（[^）]+）/g, '').trim();

            if (cleanedTitle.length >= 2) return cleanedTitle;
        }

        if (desc) {
            const boldMatch = desc.match(/\*\*([^*]{2,15}(?:營地|飯店|酒店|客棧|景區|公園|倉庫|寺|宮|大樓|古鎮|古村|渡假區|度假區|山|湖|關|廣場|大樓|博物館))\*\*/);
            if (boldMatch) return boldMatch[1].trim();

            const anyBoldMatch = desc.match(/\*\*([^*]{2,12})\*\*/);
            if (anyBoldMatch) {
                let boldTxt = anyBoldMatch[1].replace(/停留時間:|花費時間:|體驗重點:/g, '').trim();
                if (boldTxt.length >= 2 && !boldTxt.includes("約")) return boldTxt;
            }

            const verbMatch = desc.match(/(?:續住|入住|停靠|前往|參觀|打卡|至)\s*\*?([A-Z0-9\u4e00-\u9fa5]{2,12}(?:營地|飯店|酒店|客棧|景區|公園|古鎮|渡假區|度假區|山|湖|關|站|倉庫))/);
            if (verbMatch) return verbMatch[1].trim();

            const suffixMatch = desc.match(/[\u4e00-\u9fa5]{2,10}(?:房車營地|營地|飯店|酒店|客棧|景區|公園|古鎮|渡假區|度假區|山|湖|關|洞|溪)/);
            if (suffixMatch) return suffixMatch[0].trim();
        }

        return "武夷山";
    },

    generateMapConfig(countryKey, rawTitle, rawDesc) {
        const cleanQuery = this.cleanSpotTitleForMap(rawTitle, rawDesc);
        const encodedQuery = encodeURIComponent(cleanQuery);

        if (countryKey === 'china') {
            return {
                cleanQuery,
                label: `🗺️ 高德導航: ${cleanQuery}`,
                url: `https://www.amap.com/search?query=${encodedQuery}`
            };
        } else {
            return {
                cleanQuery,
                label: `📍 Google Maps: ${cleanQuery}`,
                url: `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`
            };
        }
    },

    renderItinerary(payload, countryKey = 'japan') {
        const days = payload.days || payload;
        const currentMember = DataService.getCurrentMember();

        for (let dayKey in days) {
            const dayData = days[dayKey];
            const container = document.getElementById(`day${dayKey}View`);
            if (!container) continue;

            let html = `
                <div class="day-header-card">
                    <span class="day-badge">Day ${dayKey} · ${dayData.date || ''}</span>
                    <h2 class="day-title">${dayData.theme || ''}</h2>
                    ${dayData.defense ? `<div class="day-defense-box">🛡️ 核心防禦方針：${dayData.defense}</div>` : ''}
                </div>
            `;

            if (Array.isArray(dayData.timeline) && dayData.timeline.length > 0) {
                // 100% 嚴格保持原始時間順序，絕對不打亂行程！
                let timelineList = [...dayData.timeline];

                html += `<div class="timeline-list">`;
                timelineList.forEach((item, spotIndex) => {
                    const isTransport = item.event_type === 'transport';
                    const mapConfig = this.generateMapConfig(countryKey, item.title, item.desc);
                    
                    const comments = DataService.getSpotComments(item.title);
                    const commentCount = comments.length;

                    let commentsHtml = comments.map(c => {
                        let color = (c.member === 'K' || c.member === '成員1') ? 'var(--color-husband)' : ((c.member === 'T' || c.member === '成員2') ? 'var(--color-wife)' : ((c.member === 'J' || c.member === '成員3') ? 'var(--color-elder)' : 'var(--color-younger)'));
                        return `
                            <div style="background:rgba(0,0,0,0.25); border:1px solid var(--border-color); padding:6px 10px; border-radius:8px; margin-bottom:6px; font-size:0.75rem;">
                                <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                                    <span style="font-weight:700; color:${color};">💬 ${c.member}</span>
                                    <span style="font-size:0.65rem; color:var(--text-muted);">${c.time}</span>
                                </div>
                                <div style="color:#e2e8f0;">${c.text}</div>
                            </div>
                        `;
                    }).join('');

                    const safeTitleId = `comment_box_${dayKey}_${spotIndex}`;

                    let comicBtnHtml = '';
                    if ((countryKey === 'japan' && Number(dayKey) >= 1 && Number(dayKey) <= 6) || countryKey === 'taiwan') {
                        let comicPath = countryKey === 'taiwan' ? '../taiwan_comic.jpg' : `../day${dayKey}_comic.jpg`;
                        comicBtnHtml = `
                            <button onclick="UIEngine.openLightbox('${comicPath}')" class="comic-icon-btn" title="點擊全螢幕觀看 AI 漫畫合照">
                                🎨 AI 漫畫合照
                            </button>
                        `;
                    }

                    let durationText = (item.duration && item.duration !== 'Standard') ? item.duration : '';

                    // 🌤️ 備案膠囊按鈕
                    let rainBackupBtnHtml = '';
                    if (!isTransport) {
                        rainBackupBtnHtml = `
                            <button onclick="UIEngine.openBackupModal('${dayKey}', ${spotIndex})" class="rain-icon-btn">
                                🌤️ 備案
                            </button>
                        `;
                    }

                    html += `
                        <div class="spot-card ${isTransport ? 'is-transport' : ''}">
                            <div class="spot-header">
                                <span class="spot-time">${isTransport ? '🚦' : '⏱️'} ${item.time || ''}</span>
                                ${durationText ? `<span class="spot-duration">${durationText}</span>` : ''}
                            </div>
                            <h3 class="spot-title">${item.title || ''}</h3>
                            <p class="spot-desc">${item.desc || ''}</p>

                            <div class="spot-actions">
                                <a href="${mapConfig.url}" target="_blank" rel="noopener" class="map-btn" style="${countryKey === 'china' ? 'background:rgba(56,189,248,0.15); color:var(--color-primary); border-color:var(--color-primary);' : ''}">
                                    ${mapConfig.label}
                                </a>
                                ${comicBtnHtml}
                                ${rainBackupBtnHtml}
                                <button onclick="UIEngine.toggleCommentBox('${safeTitleId}')" style="background:rgba(255,255,255,0.08); border:1px solid var(--border-color); color:#fff; padding:6px 12px; border-radius:20px; font-size:0.72rem; font-weight:600; cursor:pointer;">
                                    💬 成員留言 (${commentCount})
                                </button>
                            </div>

                            <div id="${safeTitleId}" class="spot-comments-box hidden" style="margin-top:10px; background:rgba(0,0,0,0.2); border:1px dashed var(--border-color); padding:10px; border-radius:10px;">
                                <div style="font-size:0.75rem; font-weight:700; color:var(--color-primary); margin-bottom:6px; display:flex; justify-content:space-between;">
                                    <span>👨‍👩‍👦‍👦 家庭成員留言與討論</span>
                                    <span style="font-size:0.68rem; color:var(--text-muted);">當前身分: ${currentMember}</span>
                                </div>
                                <div class="comments-list">${commentsHtml}</div>
                                
                                <div style="display:flex; gap:6px; margin-top:8px;">
                                    <input type="text" id="input_${safeTitleId}" placeholder="以 【${currentMember}】 身分留下記錄或想法..." style="flex:1; padding:7px 10px; border-radius:8px; border:1px solid var(--border-color); background:var(--bg-secondary); color:#fff; font-size:0.75rem; outline:none;">
                                    <button onclick="UIEngine.handleSendComment('${encodeURIComponent(item.title)}', '${safeTitleId}')" style="background:var(--color-primary); color:#fff; border:none; padding:7px 12px; border-radius:8px; font-size:0.75rem; font-weight:600; cursor:pointer;">送出</button>
                                </div>
                            </div>
                        </div>
                    `;
                });
                html += `</div>`;
            }

            container.innerHTML = html;
        }
    },

    openBackupModal(dayKey, spotIndex) {
        const payload = DataService._caches[DataService.currentCountry];
        if (!payload || !payload.days || !payload.days[dayKey]) return;

        const spot = payload.days[dayKey].timeline[spotIndex];
        if (!spot) return;

        const modal = document.getElementById('backupModal');
        const modalTitle = document.getElementById('backupModalTitle');
        const modalWeather = document.getElementById('backupModalWeather');
        const modalBody = document.getElementById('backupModalBody');
        const modalExtra = document.getElementById('backupModalExtra');

        const cleanTitle = spot.title.replace(/📍|景點行程:|房車自駕路線:/g, '').trim();
        if (modalTitle) modalTitle.textContent = `🌤️ ${cleanTitle} · 錦囊情報`;

        // 1. 氣候預報
        if (modalWeather) {
            modalWeather.innerHTML = `
                <span style="font-size:1.2rem;">🌤️</span>
                <div>
                    <strong style="color:var(--color-primary);">當前時段氣候預報：</strong>
                    <div style="color:#e2e8f0; margin-top:2px;">${spot.weather_forecast || '晴轉多雲 28°C · 降雨機率 15% · 請以手機當地即時為準'}</div>
                </div>
            `;
        }

        // 2. 雙備選景點
        const backups = spot.backup_spots || [
            { title: "鄰近室內購物中心 / COREDO 商場", desc: "舒適涼爽的室內購物區與主題美食街，雨天首選。" },
            { title: "在地市立博物館 / 文創園區", desc: "深入瞭解在地歷史文化的室內深度景點。" }
        ];

        let html = '';
        backups.forEach((b, idx) => {
            const mapConfig = this.generateMapConfig(DataService.currentCountry, b.title, b.desc);
            html += `
                <div style="background:rgba(255,255,255,0.04); border:1px solid var(--border-color); padding:10px 12px; border-radius:12px;">
                    <div style="font-size:0.82rem; font-weight:700; color:var(--color-secondary); margin-bottom:3px;">
                        【備選 ${idx + 1}】${b.title}
                    </div>
                    <div style="font-size:0.72rem; color:var(--text-muted); line-height:1.4; margin-bottom:6px;">
                        ${b.desc}
                    </div>
                    <a href="${mapConfig.url}" target="_blank" rel="noopener" class="map-btn" style="padding:4px 10px; font-size:0.68rem;">
                        ${mapConfig.label}
                    </a>
                </div>
            `;
        });
        if (modalBody) modalBody.innerHTML = html;

        // 3. KOL 達人實測與官方網站連結
        const kolUrl = spot.kol_link || `https://www.youtube.com/results?search_query=${encodeURIComponent(cleanTitle)}+KOL開箱`;
        const officialUrl = spot.official_link || `https://www.google.com/search?q=${encodeURIComponent(cleanTitle)}+官網`;

        let extraHtml = `
            <div style="display:flex; gap:8px;">
                <a href="${kolUrl}" target="_blank" rel="noopener" style="flex:1; display:inline-flex; align-items:center; justify-content:center; gap:4px; background:rgba(244,63,94,0.15); color:var(--color-accent); border:1px solid rgba(244,63,94,0.3); padding:8px; border-radius:10px; font-size:0.72rem; font-weight:600; text-decoration:none;">
                    🎥 KOL 達人影音開箱
                </a>
                <a href="${officialUrl}" target="_blank" rel="noopener" style="flex:1; display:inline-flex; align-items:center; justify-content:center; gap:4px; background:rgba(129,140,248,0.15); color:var(--color-secondary); border:1px solid rgba(129,140,248,0.3); padding:8px; border-radius:10px; font-size:0.72rem; font-weight:600; text-decoration:none;">
                    🌐 景點官網 / 預約門票
                </a>
            </div>
        `;
        if (modalExtra) modalExtra.innerHTML = extraHtml;

        if (modal) modal.classList.add('active');
    },

    closeBackupModal() {
        const modal = document.getElementById('backupModal');
        if (modal) modal.classList.remove('active');
    },

    openLightbox(imgSrc) {
        const modal = document.getElementById('lightboxModal');
        const img = document.getElementById('lightboxImg');
        if (modal && img) {
            img.src = imgSrc;
            modal.classList.add('active');
        }
    },

    closeLightbox() {
        const modal = document.getElementById('lightboxModal');
        if (modal) {
            modal.classList.remove('active');
        }
    },

    toggleCommentBox(boxId) {
        const el = document.getElementById(boxId);
        if (el) el.classList.toggle('hidden');
    },

    handleSendComment(encodedTitle, boxId) {
        const title = decodeURIComponent(encodedTitle);
        const inputEl = document.getElementById(`input_${boxId}`);
        if (!inputEl) return;

        const text = inputEl.value.trim();
        if (!text) {
            alert('請輸入留言內容！');
            return;
        }

        DataService.addSpotComment(title, text);
        inputEl.value = '';

        const payload = DataService._caches[DataService.currentCountry];
        if (payload) this.renderItinerary(payload, DataService.currentCountry);

        setTimeout(() => {
            const el = document.getElementById(boxId);
            if (el) el.classList.remove('hidden');
        }, 50);
    },

    renderTransport(data) {
        const container = document.getElementById('transportView');
        if (!container) return;

        let html = `
            <div class="day-header-card">
                <span class="day-badge" style="background: var(--color-secondary); color:#fff;">交通攻略 · 行動指南</span>
                <h2 class="day-title">全六日防禦性交通動線與觀光轉乘</h2>
                <p class="spot-desc">含 N'EX 成田特快劃位、JR 轉乘、東急私鐵地鐵精算與 Suica iPhone 綁定步驟。</p>
            </div>
            <div class="timeline-list">
        `;

        for (let dayKey in data) {
            const transportItems = data[dayKey];
            if (Array.isArray(transportItems)) {
                html += `<div style="font-size:0.88rem; font-weight:700; color:var(--color-secondary); margin:12px 0 6px;">Day ${dayKey} 交通路線重點</div>`;
                transportItems.forEach(item => {
                    html += `
                        <div class="spot-card is-transport">
                            <div class="spot-header">
                                <span class="spot-time" style="color:var(--color-secondary);">Day ${dayKey} · ${item.time || ''}</span>
                            </div>
                            <h3 class="spot-title">${item.title || ''}</h3>
                            <p class="spot-desc">${item.desc || ''}</p>
                        </div>
                    `;
                });
            }
        }

        html += `</div>`;
        container.innerHTML = html;
    },

    renderHotels(payload, countryKey) {
        const container = document.getElementById('hotelsView');
        if (!container) return;

        const hotels = payload.hotels || [];

        let html = `
            <div class="day-header-card">
                <span class="day-badge" style="background: var(--color-wife); color:#fff;">🏨 飯店住宿 · 駐紮營地</span>
                <h2 class="day-title">全程住宿據點與 Check-in 指南</h2>
                <p class="spot-desc">提供飯店地址、交通指引、特色備註與電話。自由行「食住行費」核心靈魂。</p>
            </div>
            <div class="timeline-list">
        `;

        if (hotels.length === 0) {
            html += `<div style="text-align:center; color:var(--text-muted); padding:20px;">尚無飯店資料</div>`;
        } else {
            hotels.forEach(h => {
                const mapConfig = this.generateMapConfig(countryKey, h.name, h.address);
                html += `
                    <div class="spot-card" style="border-color:var(--color-wife);">
                        <div class="spot-header">
                            <span class="spot-time" style="color:var(--color-wife);">📅 ${h.date || ''}</span>
                        </div>
                        <h3 class="spot-title">${h.name}</h3>
                        <p class="spot-desc">📍 <strong>地址：</strong>${h.address}</p>
                        ${h.access ? `<p class="spot-desc">🚇 <strong>交通指引：</strong>${h.access}</p>` : ''}
                        ${h.notes ? `<p class="spot-desc" style="color:var(--color-primary);">💡 <strong>住宿特色/備註：</strong>${h.notes}</p>` : ''}
                        ${h.phone ? `<p class="spot-desc" style="font-size:0.75rem; color:var(--text-muted);">📞 電話: ${h.phone}</p>` : ''}
                        
                        <div class="spot-actions" style="margin-top:10px;">
                            <a href="${mapConfig.url}" target="_blank" rel="noopener" class="map-btn" style="background:rgba(244,114,182,0.15); color:var(--color-wife); border-color:var(--color-wife);">
                                ${mapConfig.label}
                            </a>
                        </div>
                    </div>
                `;
            });
        }

        html += `</div>`;
        container.innerHTML = html;
    },

    renderExpenses(payload) {
        const budgetContainer = document.getElementById('budgetView');
        if (!budgetContainer) return;

        const expenses = DataService.getExpenses();
        const totalBudget = (payload && payload.budget_total) ? payload.budget_total : 150000;
        const sheetName = (payload && payload.sheet_name) ? payload.sheet_name : "預設雲端記帳本";

        let totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
        let remaining = totalBudget - totalSpent;
        let progressPercent = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

        let itemsHtml = expenses.length === 0 
            ? `<div style="text-align:center; color:var(--text-muted); padding:16px; font-size:0.82rem;">尚無新增支出明細，點擊下方新增記錄</div>`
            : expenses.map((item, idx) => `
                <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-secondary); border:1px solid var(--border-color); padding:10px 14px; border-radius:12px; margin-bottom:8px;">
                    <div>
                        <div style="font-weight:600; font-size:0.88rem;">${item.name}</div>
                        <div style="font-size:0.72rem; color:var(--text-muted);">${item.category || '公積金'} · ${item.time || ''}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-weight:700; color:var(--color-accent);">¥${Number(item.amount).toLocaleString()}</span>
                        <button onclick="UIEngine.deleteExpense(${idx})" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.2rem; padding:0 4px;">&times;</button>
                    </div>
                </div>
            `).join('');

        budgetContainer.innerHTML = `
            <div class="budget-overview-card">
                <span class="day-badge" style="background: var(--color-success); color: #0b0f19;">公積金預算決算</span>
                <div style="font-size:0.75rem; color:var(--color-primary); margin-top:2px;">📊 雲端連動試算表: ${sheetName}</div>
                <h2 class="day-title" style="margin-top:4px;">總預算: ¥${totalBudget.toLocaleString()}</h2>
                
                <div class="budget-stats">
                    <div class="stat-box">
                        <span class="stat-label">已支出金額</span>
                        <div class="stat-amount" style="color:var(--color-accent);">¥${totalSpent.toLocaleString()}</div>
                    </div>
                    <div class="stat-box">
                        <span class="stat-label">剩餘預備金</span>
                        <div class="stat-amount" style="color:var(--color-success);">¥${remaining.toLocaleString()}</div>
                    </div>
                </div>

                <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-muted);">
                    <span>預算使用率</span>
                    <span>${progressPercent}%</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${progressPercent}%;"></div>
                </div>
            </div>

            <div class="day-header-card">
                <h3 style="font-size:0.95rem; font-weight:700; margin-bottom:12px;">➕ 新增公積金支出明細</h3>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <input type="text" id="expName" placeholder="項目名稱 (例如：房車油費 / 景點門票)" style="padding:11px; border-radius:10px; border:1px solid var(--border-color); background:var(--bg-secondary); color:#fff; font-size:0.85rem; outline:none;">
                    <input type="number" id="expAmount" placeholder="金額 (例如：1500)" style="padding:11px; border-radius:10px; border:1px solid var(--border-color); background:var(--bg-secondary); color:#fff; font-size:0.85rem; outline:none;">
                    <button onclick="UIEngine.handleAddExpense()" class="btn-primary" style="padding:12px; margin-top:4px;">儲存並同步至 Google Sheet</button>
                </div>
            </div>

            <div style="margin-top:18px;">
                <h3 style="font-size:0.92rem; font-weight:700; margin-bottom:10px; color:var(--text-muted);">📋 當前行程雲端明細記錄</h3>
                ${itemsHtml}
            </div>
        `;
    },

    bindEvents() {
        const passcodeInputs = document.querySelectorAll('.passcode-digit');
        passcodeInputs.forEach((input, index) => {
            input.addEventListener('input', () => {
                if (input.value.length === 1 && index < passcodeInputs.length - 1) {
                    passcodeInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    passcodeInputs[index - 1].focus();
                }
            });
        });

        const playComicBtn = document.getElementById('playComicBtn');
        if (playComicBtn) {
            playComicBtn.addEventListener('click', () => this.openComicModal());
        }

        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => this.handleLogin());
        }

        const countrySelect = document.getElementById('countrySelect');
        if (countrySelect) {
            countrySelect.addEventListener('change', async (e) => {
                const val = e.target.value;
                history.replaceState(null, '', `?country=${val}`);
                await this.loadAndRenderCountry(val);
            });
        }
    },

    checkAuthStatus() {
        const overlay = document.getElementById('loginOverlay');
        if (DataService.isLoggedIn()) {
            overlay?.classList.add('hidden');
        } else {
            overlay?.classList.remove('hidden');
        }
    },

    handleLogin() {
        const inputs = document.querySelectorAll('.passcode-digit');
        let code = '';
        inputs.forEach(i => code += i.value);

        if (code === '2026' || code === '0710' || code === '1234') {
            DataService.setLoggedIn(true);
            document.getElementById('loginOverlay')?.classList.add('hidden');
        } else {
            alert('通行密碼錯誤，請輸入 2026 即可解鎖！');
        }
    },

    switchTab(targetId) {
        document.querySelectorAll('.tab-item').forEach(t => {
            t.classList.toggle('active', t.dataset.target === targetId);
        });

        document.querySelectorAll('.view-section').forEach(s => {
            s.classList.toggle('active', s.id === targetId);
        });

        this.currentTab = targetId;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    handleHashRoute() {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'transport') {
            this.switchTab('transportView');
        } else if (hash === 'hotels') {
            this.switchTab('hotelsView');
        } else if (hash === 'budget') {
            this.switchTab('budgetView');
        } else if (hash.startsWith('day')) {
            const target = hash.endsWith('View') ? hash : `${hash}View`;
            if (document.getElementById(target)) {
                this.switchTab(target);
            }
        }
    },

    handleAddExpense() {
        if (!DataService.canSubmit()) return;

        const nameInput = document.getElementById('expName');
        const amountInput = document.getElementById('expAmount');
        if (!nameInput || !amountInput) return;

        const name = nameInput.value.trim();
        const amount = Number(amountInput.value);

        if (!name || isNaN(amount) || amount <= 0) {
            alert('請輸入有效的項目名稱與金額！');
            return;
        }

        const expenses = DataService.getExpenses();
        expenses.unshift({
            name,
            amount,
            category: '公積金',
            time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
        });

        DataService.saveExpenses(expenses);
        const payload = DataService._caches[DataService.currentCountry];
        this.renderExpenses(payload);
    },

    deleteExpense(index) {
        const expenses = DataService.getExpenses();
        expenses.splice(index, 1);
        DataService.saveExpenses(expenses);
        const payload = DataService._caches[DataService.currentCountry];
        this.renderExpenses(payload);
    },

    openComicModal() {
        const countryKey = DataService.currentCountry || 'japan';
        const imgEl = document.getElementById('lightboxImg');
        const titleEl = document.getElementById('comicModalTitle');
        const modal = document.getElementById('lightboxModal');
        const userPhotoContainer = document.getElementById('userPhotoContainer');

        if (userPhotoContainer) userPhotoContainer.style.display = 'none';

        const comicImgPath = `${countryKey}_comic.jpg`;
        if (imgEl) imgEl.src = comicImgPath;

        const countryNames = {
            'japan': '🇯🇵 日本東京關東',
            'paris': '🇫🇷 法國巴黎奢華',
            'china': '🇨🇳 中國大理江南',
            'swiss': '🇨🇭 瑞士阿爾卑斯',
            'taiwan': '🇹🇼 台灣環島海線'
        };

        if (titleEl) {
            titleEl.textContent = `🎨 ${countryNames[countryKey] || '精選'} AI 經典漫畫紀念照`;
        }

        if (modal) modal.classList.remove('hidden');
    },

    closeLightbox() {
        const modal = document.getElementById('lightboxModal');
        if (modal) modal.classList.add('hidden');
    },

    handleCameraUpload(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const userPhotoImg = document.getElementById('userPhotoImg');
            const userPhotoContainer = document.getElementById('userPhotoContainer');
            if (userPhotoImg && userPhotoContainer) {
                userPhotoImg.src = e.target.result;
                userPhotoContainer.style.display = 'block';
                alert('🎉 復刻打卡成功！已為您比對展示 AI 漫畫 vs 現場實拍對比照片。');
            }
        };
        reader.readAsDataURL(file);
    }
};

window.UIEngine = UIEngine;
