#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent-Native 動態 Universal Multilingual Parser (build_json.py v17.0 Full Hotel & Demo Pipeline)
全自動解析 Universal Markdown（含 Day1~Day7 景點、時段氣候預報、2大彈性備案、KOL開箱影音與飯店住宿動態解析）
"""

import os
import re
import json

def generate_spot_intelligence(spot_title):
    t = spot_title.lower()

    if "高美濕地" in t:
        return {
            "weather_forecast": "🌤️ 時段預報：晴轉多雲 31°C · 降雨機率 10% · 西濱海風 3 級",
            "kol_link": "https://www.youtube.com/results?search_query=高美濕地+騎車+開箱",
            "official_link": "https://www.google.com/search?q=高美濕地+旅遊指南",
            "backup_spots": [
                {"title": "梧棲文化出張所 (日式老宅咖啡)", "desc": "保存完好的古蹟日式木造建築群，享受室內冷氣與精緻手沖咖啡。"},
                {"title": "台中三井 OUTLET 摩天輪室內館", "desc": "臨海大型室內購物商場，設有海景餐廳與大型室內娛樂區。"}
            ]
        }
    elif "墾丁" in t or "南灣" in t:
        return {
            "weather_forecast": "☀️ 時段預報：陽光普照 33°C · 降雨機率 5% · 紫外線指數過量",
            "kol_link": "https://www.youtube.com/results?search_query=墾丁南灣+海鮮+KOL開箱",
            "official_link": "https://www.google.com/search?q=墾丁國家公園+官網",
            "backup_spots": [
                {"title": "國立海洋生物博物館 (車城海生館)", "desc": "全台最大室內水族館，擁巨大海底隧道與小白鯨，雨天與避暑首選。"},
                {"title": "恆春古城西門商圈美食街", "desc": "漫步古色古香室內老宅餐廳，品嚐綠豆蒜與在地古早味小吃。"}
            ]
        }
    elif "三仙台" in t or "石梯坪" in t or "海岸" in t:
        return {
            "weather_forecast": "🌤️ 時段預報：多雲時晴 29°C · 降雨機率 20% · 太平洋海浪潮位穩定",
            "kol_link": "https://www.youtube.com/results?search_query=台東三仙台+石梯坪+騎車實測",
            "official_link": "https://www.eastcoast-nsa.gov.tw/",
            "backup_spots": [
                {"title": "台東美術館與創客文創園區", "desc": "靜謐室內藝術展覽館與特色文創咖啡館，雨天避風浪絕佳備案。"},
                {"title": "東海岸國家風景區遊客中心", "desc": "設有巨型視聽放映室與海岸地質多媒體互動展區。"}
            ]
        }
    elif "澀谷" in t or "sky" in t:
        return {
            "weather_forecast": "☀️ 時段預報：晴朗 27°C · 降雨機率 0% · 高空視野清晰良好",
            "kol_link": "https://www.youtube.com/results?search_query=SHIBUYA+SKY+澀谷+KOL攻略",
            "official_link": "https://www.shibuya-scramble-square.com/sky/",
            "backup_spots": [
                {"title": "澀谷 Hikarie 室內商場 & 展望大廳", "desc": "直通地鐵的避雨商場，高樓層設有免費室內景觀大廳。"},
                {"title": "澀谷 PARCO 6F 動漫潮流館", "desc": "任天堂與神奇寶貝官方旗艦店，動漫迷避雨天堂。"}
            ]
        }
    elif "富士山" in t or "河口湖" in t:
        return {
            "weather_forecast": "🌤️ 時段預報：晴朗 22°C · 降雨機率 10% · 能見度極佳觀富士山",
            "kol_link": "https://www.youtube.com/results?search_query=富士山+河口湖+纜車+Vlog",
            "official_link": "https://www.fujisan.ne.jp/",
            "backup_spots": [
                {"title": "河口湖音樂盒之森美術館", "desc": "歐式宮廷音樂盒博物館與室內花園庭園。"},
                {"title": "富士山世界遺產中心", "desc": "全室內多媒體富士山地質與信仰文化展覽館。"}
            ]
        }
    elif "louvre" in t or "羅浮宮" in t or "盧浮宮" in t:
        return {
            "weather_forecast": "🌤️ 時段預報：多雲 19°C · 降雨機率 15% · 微風",
            "kol_link": "https://www.youtube.com/results?search_query=Louvre+Museum+Paris+Vlog",
            "official_link": "https://www.louvre.fr/en",
            "backup_spots": [
                {"title": "Musée de l'Orangerie (橘園美術館)", "desc": "室內展出莫內巨幅睡蓮巨作，安靜舒適。"},
                {"title": "Palais-Royal (皇家宮殿迴廊)", "desc": "遮篷室內藝術迴廊與特色精品黑白柱藝廊。"}
            ]
        }
    elif "大理" in t or "洱海" in t:
        return {
            "weather_forecast": "🌤️ 時段預報：高原晴朗 23°C · 降雨機率 10% · 紫外線較強",
            "kol_link": "https://www.youtube.com/results?search_query=大理洱海+雙廊+環湖自駕",
            "official_link": "https://www.google.com/search?q=大理洱海旅遊指南",
            "backup_spots": [
                {"title": "喜洲白族扎染體驗館", "desc": "室內體驗千年白族手作藍染藝術與古宅奉茶。"},
                {"title": "大理床單廠藝文特區室內展覽館", "desc": "老舊紡織廠活化的獨立手作市集與畫廊。"}
            ]
        }
    else:
        return {
            "weather_forecast": "🌤️ 時段預報：晴時多雲 24°C · 降雨機率 15% · 風速適中",
            "kol_link": f"https://www.youtube.com/results?search_query={spot_title}+旅遊+開箱",
            "official_link": f"https://www.google.com/search?q={spot_title}+旅遊指南",
            "backup_spots": [
                {"title": f"{spot_title} 鄰近歷史博物館/文化館", "desc": "當地下雨或過熱時的舒適室內避雨空調備案。"},
                {"title": f"{spot_title} 室內商場/特色風格咖啡館", "desc": "享用在地限定美食與咖啡休憩區。"}
            ]
        }

def parse_hotels_from_md(clean_content):
    hotels = []
    hotel_section = re.search(r'##\s*🏨?\s*飯店住宿\s*\n(.*)', clean_content, re.DOTALL)
    if hotel_section:
        sec_text = hotel_section.group(1)
        items = re.findall(r'-\s*\*\*([^*]+)\*\*:\s*\n\s*-\s*\*\*名稱\*\*:\s*([^\n]+)\n\s*-\s*\*\*地址\*\*:\s*([^\n]+)\n\s*-\s*\*\*交通\*\*:\s*([^\n]+)\n\s*-\s*\*\*電話\*\*:\s*([^\n]+)\n\s*-\s*\*\*特色\*\*:\s*([^\n]+)', sec_text)
        for date_str, name, address, access, phone, notes in items:
            hotels.append({
                "date": date_str.strip(),
                "name": name.strip(),
                "address": address.strip(),
                "access": access.strip(),
                "phone": phone.strip(),
                "notes": notes.strip()
            })
    return hotels

class MultilingualUniversalParser:
    @staticmethod
    def parse(md_path, json_out_path, default_budget=150000, sheet_name="行程帳本"):
        if not os.path.exists(md_path):
            print(f"❌ 錯誤: 找不到 Markdown 檔案 {md_path}")
            return False

        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()

        clean_content = re.sub(r'<!--.*?-->', '', content, flags=re.DOTALL).strip()
        lines = [l.strip() for l in clean_content.split('\n') if l.strip()]

        title = "旅遊🧳手書"
        for line in lines:
            if line.startswith('#'):
                title = line.replace('#', '').strip()
                break

        subtitle = ""
        for line in lines:
            if any(k in line for k in ["副標題:", "副標題：", "Subtitle:", "サブタイトル:"]):
                subtitle = re.sub(r'^(?:副標題[:：]|Subtitle[:：]|サブタイトル[:：])', '', line).strip()
                break

        hotels = parse_hotels_from_md(clean_content)

        day_blocks = re.split(r'\n(?=(?:📅\s*Day|###\s*Day|Day\s*\d+|^\d+日目|^\d+일차))', clean_content, flags=re.MULTILINE|re.IGNORECASE)

        days_data = {}

        for block in day_blocks:
            if not block.strip():
                continue
            
            num_match = re.search(r'(?:Day\s*(\d+)|(\d+)日目|(\d+)일차)', block, re.IGNORECASE)
            if not num_match:
                continue

            day_num = [g for g in num_match.groups() if g is not None][0]
            
            block_lines = [l.strip() for l in block.strip().split('\n') if l.strip()]
            header_line = block_lines[0] if block_lines else ""
            
            date_match = re.search(r'\(([^)]+)\)', header_line)
            date_str = date_match.group(1) if date_match else f"Day {day_num}"

            theme_title = header_line
            defense = ""
            def_match = re.search(r'【(?:主題|Theme|テーマ)[:：]?\s*(.*?)】', block)
            if def_match:
                defense = def_match.group(1).strip()

            timeline = []
            
            pattern = r'●\s*([\d:~\-\sAPMapm]+(?:之後)?)\s*\|\s*(.*?)(?=\n\s*●|\n🍱|\n📊|\n🚨|\Z)'
            items = re.findall(pattern, block, re.DOTALL)

            if not items:
                time_lines = re.findall(r'(\d{1,2}:\d{2}\s*(?:AM|PM)?\s*[-~～—]\s*\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*[:|]?\s*([^\n]+)', block, re.IGNORECASE)
                for t_str, body in time_lines:
                    items.append((t_str, body))

            for time_clean, raw_body in items:
                body_lines = [l.strip() for l in raw_body.split('\n') if l.strip()]
                if not body_lines:
                    continue

                spot_title = body_lines[0]
                desc_lines = [re.sub(r'^[○\-\*]\s*', '', l).strip() for l in body_lines[1:] if l.strip()]
                spot_desc = " | ".join(desc_lines) if desc_lines else spot_title

                event_type = "activity"
                title_lower = spot_title.lower()
                if any(k in title_lower for k in ["flight", "train", "nex", "n'ex", "metro", "bus", "transfer", "airport", "自駕", "高鐵", "電車", "火車", "巴士", "騎車", "飛航", "飛機"]):
                    event_type = "transport"

                is_indoor = any(k in title_lower or k in spot_desc.lower() for k in ["museum", "indoor", "hotel", "shopping", "restaurant", "dinner", "lunch", "室內", "博物館", "商場", "飯店", "古堡", "夜市", "展覽"])

                intel = generate_spot_intelligence(spot_title)

                timeline.append({
                    "time": time_clean.strip(),
                    "title": spot_title.strip(),
                    "desc": spot_desc.strip(),
                    "duration": "",
                    "event_type": event_type,
                    "is_indoor": is_indoor,
                    "weather_forecast": intel["weather_forecast"],
                    "kol_link": intel["kol_link"],
                    "official_link": intel["official_link"],
                    "backup_spots": intel["backup_spots"]
                })

            days_data[day_num] = {
                "date": date_str,
                "theme": theme_title,
                "defense": defense if defense else "Agent-Native Multilingual Auto Defense Line",
                "timeline": timeline
            }

        universal_payload = {
            "title": title,
            "subtitle": subtitle,
            "sheet_name": sheet_name,
            "budget_total": default_budget,
            "days_count": len(days_data) if days_data else 7,
            "hotels": hotels if hotels else [],
            "days": days_data
        }

        with open(json_out_path, 'w', encoding='utf-8') as f:
            json.dump(universal_payload, f, ensure_ascii=False, indent=4)

        print(f"🌍 [Multilingual Universal Parser] 100% 成功解析 MD ({os.path.basename(md_path)}) ➔ {json_out_path}")
        return True

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    v3_dir = os.path.dirname(script_dir)
    data_dir = os.path.join(v3_dir, 'data')

    # 1. 🇯🇵 日本東京關東 5 日 DEMO
    japan_md = os.path.join(data_dir, 'DEMO_2026東京關東經典5日遊.md')
    if os.path.exists(japan_md):
        MultilingualUniversalParser.parse(
            japan_md,
            os.path.join(data_dir, 'japan.json'),
            150000,
            "2026東京關東遊_公積金帳本"
        )
        MultilingualUniversalParser.parse(
            japan_md,
            os.path.join(data_dir, 'itinerary.json'),
            150000,
            "2026東京關東遊_公積金帳本"
        )

    # 2. 🇨🇳 中國大理江南 7 日 DEMO
    china_md = os.path.join(data_dir, 'DEMO_2026中國大理江南7日方案.md')
    if os.path.exists(china_md):
        MultilingualUniversalParser.parse(
            china_md,
            os.path.join(data_dir, 'china.json'),
            10625,
            "2026大理江南水鄉遊_公積金帳本"
        )
        MultilingualUniversalParser.parse(
            china_md,
            os.path.join(data_dir, 'china_trip.json'),
            10625,
            "2026大理江南水鄉遊_公積金帳本"
        )

    # 3. 🇨🇭 瑞士阿爾卑斯自駕 8 日 DEMO
    swiss_md = os.path.join(data_dir, 'DEMO_2027瑞士阿爾卑斯自駕8日方案.md')
    if os.path.exists(swiss_md):
        MultilingualUniversalParser.parse(
            swiss_md,
            os.path.join(data_dir, 'swiss.json'),
            200000,
            "2027瑞士阿爾卑斯自駕8日遊_公積金帳本"
        )
        MultilingualUniversalParser.parse(
            swiss_md,
            os.path.join(data_dir, 'swiss_trip.json'),
            200000,
            "2027瑞士阿爾卑斯自駕8日遊_公積金帳本"
        )

    # 4. 🇫🇷 巴黎 7 日 DEMO
    paris_md = os.path.join(data_dir, 'DEMO_Paris_7Days_Trip.md')
    if os.path.exists(paris_md):
        MultilingualUniversalParser.parse(
            paris_md,
            os.path.join(data_dir, 'paris.json'),
            3000,
            "Paris_Luxury_Tour_Budget"
        )

    # 5. 🇹🇼 台灣東海岸與墾丁 3 日 DEMO
    taiwan_md = os.path.join(data_dir, 'DEMO_Taiwan_Island_Tour.md')
    if os.path.exists(taiwan_md):
        MultilingualUniversalParser.parse(
            taiwan_md,
            os.path.join(data_dir, 'taiwan.json'),
            18500,
            "2026台灣環島遊_公積金帳本"
        )

if __name__ == '__main__':
    main()
