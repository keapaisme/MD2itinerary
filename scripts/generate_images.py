#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MD2itinerary - 行程卡片打卡圖自動生成系統 (generate_images.py v2.0)
結合角色一致性與吉卜力風格，動態解析 Markdown 行程檔中的成員人數，透過 Gemini API Imagen 3 自動生成 16:9 打卡照。
"""

import os
import json
import base64
import re
import requests
import sys

# 一致的畫風 Prompt (日系吉卜力手繪動漫風)
STYLE_PROMPT = "A scenic travel illustration in Studio Ghibli warm hand-drawn anime style. Cozy hand-drawn anime aesthetic, warm sunlight, scenic lighting, bright colors."

# 景點翻譯對照表 (離線 fallback)
OFFLINE_TRANSLATIONS = {
    "台北 ➔ 清水斷崖 (蘇花改公路)": "standing on a coastal highway viewpoint looking at the breathtaking Qingshui Cliff in Taiwan. Massive steep green cliffs meet the deep blue Pacific ocean with white waves crashing.",
    "太魯閣燕子口與砂卡礑步道": "walking on a narrow stone pathway of Shakadang Trail carved into a massive marble canyon cliff in Taroko Gorge. Below them, a beautiful turquoise crystal-clear river runs through the gorge.",
    "花蓮 ➔ 三仙台跨海步橋": "walking towards the famous red eight-arch bridge extending over the blue ocean of Sanxiantai in Taitung. Round pebble beach on the shore, bright sunny day, ocean waves crashing.",
    "台東 ➔ 墾丁龍磐公園與鵝鑾鼻燈塔": "standing on a high grassy coastal cliff of Longpan Park in Kenting, looking out towards the vast Pacific Ocean under a gorgeous sunset sky, with a white lighthouse in the far background.",
    "墾丁白沙灣與後壁湖海鮮大餐": "walking on the white sandy beach of Baishawan in Kenting, sunny blue sky, tropical coconut trees, sparkling crystal sea.",
    "墾丁 ➔ 高鐵左營站 (專車接駁)": "riding a comfortable shuttle vehicle with windows overlooking the beautiful southern Taiwan countryside under clear skies."
}

def find_md_file(data_dir, country_key):
    """
    模糊匹配，尋找與行程 JSON 對應的 Markdown 檔案
    """
    if not os.path.exists(data_dir):
        return None
    
    # 移除底線與特殊字符以便匹配，如 "china_trip" -> "china"
    clean_key = country_key.lower().replace('_trip', '').replace('_', '')
    
    for f in os.listdir(data_dir):
        if f.lower().endswith('.md'):
            clean_f = f.lower().replace('_', '').replace('-', '')
            if clean_key in clean_f:
                return os.path.join(data_dir, f)
                
    # 預設路徑
    default_path = os.path.join(data_dir, f"{country_key}.md")
    if os.path.exists(default_path):
        return default_path
    return None

def detect_member_count(md_path):
    """
    動態解析 Markdown 內容中的人數或成員資訊
    """
    if not md_path or not os.path.exists(md_path):
        print("ℹ️ 找不到對應的 Markdown 檔案，預設成員人數為 4 人。")
        return 4

    try:
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 1. 搜尋是否有明確寫著 "人數: X"、"人數資訊: X" 的欄位
        num_match = re.search(r'(?:人數|人數資訊|成員人數)\s*[:：]\s*(\d+)', content)
        if num_match:
            count = int(num_match.group(1))
            print(f"🎯 從 Markdown 欄位中偵測到成員人數: {count} 人")
            return count
        
        # 2. 搜尋前五行是否含有 "X人" 關鍵字 (例如 3人自駕、4人遊)
        lines = content.split('\n')[:5]
        for line in lines:
            people_match = re.search(r'(\d+)\s*人', line)
            if people_match:
                count = int(people_match.group(1))
                print(f"🎯 從標題/副標題中偵測到成員人數: {count} 人")
                return count
                
        # 3. 搜尋文本中出現的最大成員數字 (如 "成員4" -> 4人)
        member_nums = re.findall(r'成員\s*(\d+)', content)
        if member_nums:
            count = max(int(n) for n in member_nums)
            print(f"🎯 從成員標籤 (成員1~{count}) 中偵測到成員人數: {count} 人")
            return count
            
    except Exception as e:
        print(f"⚠️ 解析 Markdown 人數時出錯: {e}")

    print("ℹ️ 無法自 Markdown 解析出人數資訊，預設成員人數為 4 人。")
    return 4

def get_character_prompt(count):
    """
    根據偵測到的人數，動態組裝一致角色描述 Prompt
    """
    if count == 1:
        return "One traveler, a young man with black hair wearing a beige utility vest, in anime style."
    elif count == 2:
        return "Two travelers, a young man with black hair wearing a beige utility vest, and a young woman with a short ponytail wearing a light yellow summer dress, in anime style."
    elif count == 3:
        return "Three travelers, a family group of three including a young man in a beige vest, a young woman with a short ponytail in a yellow dress, and an elderly parent, in anime style."
    elif count == 4:
        return "Four travelers, a family group of four including a young man in a beige vest, a young woman with a short ponytail in a yellow dress, an elderly parent, and a younger teenager, in anime style."
    else:
        return f"A group of {count} travelers, including young men and women in casual summer clothes, in anime style."

def translate_spot_via_gemini(api_key, title, desc):
    """
    透過 Gemini API 將中文景點與描述，重構並翻譯為適合 Imagen 3 的英文 Prompt
    """
    if not api_key:
        # Fallback to offline translation dictionary
        for key, val in OFFLINE_TRANSLATIONS.items():
            if title in key or key in title:
                return val
        return f"at {title}, {desc}."

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    prompt = (
        f"You are a prompt engineer. Translate and rewrite this Chinese travel spot and description into a single descriptive English scene description "
        f"suitable for generating a scenic illustration. Keep it concise, scenic, and focus on the environment. "
        f"Spot: '{title}', Description: '{desc}'. "
        f"Do not include character descriptions. Respond ONLY with the translated English description, no introduction, no markdown."
    )
    
    try:
        res = requests.post(url, json={
            "contents": [{"parts": [{"text": prompt}]}]
        }, timeout=10)
        if res.status_code == 200:
            data = res.json()
            return data['candidates'][0]['content']['parts'][0]['text'].strip()
    except Exception as e:
        print(f"⚠️ Gemini Prompt 翻譯呼叫失敗: {e}，改用離線對照表。")
    
    # Offline fallback
    for key, val in OFFLINE_TRANSLATIONS.items():
        if title in key or key in title:
            return val
    return f"at {title}, {desc}."

def generate_image_via_imagen(api_key, full_prompt, save_path):
    """
    透過 Gemini Imagen 3 模型生成 16:9 的圖片並儲存
    """
    if not api_key:
        return False

    url = f"https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key={api_key}"
    payload = {
        "prompt": full_prompt,
        "numberOfImages": 1,
        "outputMimeType": "image/jpeg",
        "aspectRatio": "16:9",
        "personGeneration": "ALLOW_ADULT"
    }

    try:
        print(f"🚀 呼叫 Imagen 3 生成圖片: Prompt 為 \"{full_prompt[:80]}...\"")
        res = requests.post(url, json=payload, timeout=45)
        if res.status_code == 200:
            data = res.json()
            img_b64 = data['generatedImages'][0]['image']['imageBytes']
            
            # 建立目錄並寫入檔案
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            with open(save_path, "wb") as fh:
                fh.write(base64.b64decode(img_b64))
            print(f"✅ 成功生成並儲存圖片: {save_path}")
            return True
        else:
            print(f"❌ Imagen 3 生成失敗: HTTP {res.status_code} - {res.text}")
    except Exception as e:
        print(f"❌ 呼叫 Imagen 3 出現異常: {e}")
    
    return False

def process_itinerary_json(json_path, data_dir, api_key):
    """
    載入行程 JSON 檔，為活動景點生成打卡照，並更新 JSON
    """
    if not os.path.exists(json_path):
        print(f"⚠️ 找不到 JSON 檔案: {json_path}")
        return

    print(f"📂 正在處理行程檔案: {json_path}")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    country_key = os.path.basename(json_path).replace('.json', '')
    
    # 1. 尋找對應的 Markdown 行程檔並偵測人數資訊
    md_file = find_md_file(data_dir, country_key)
    member_count = detect_member_count(md_file)
    character_prompt = get_character_prompt(member_count)
    
    days = data.get('days', {})
    updated = False

    for day_num, day_data in days.items():
        timeline = day_data.get('timeline', [])
        for idx, item in enumerate(timeline):
            # 交通行程一般不生成打卡照，只生成一般活動
            if item.get('event_type') == 'transport':
                continue
            
            # 設定圖片檔名與相對路徑
            img_filename = f"{country_key}_day{day_num}_{idx+1}.jpg"
            img_rel_path = f"images/{img_filename}"
            img_abs_path = os.path.join(os.path.dirname(os.path.dirname(json_path)), img_rel_path)
            
            # 無論是否生成實體圖片，都將 image 欄位寫入 JSON，供前端讀取
            item['image'] = img_rel_path
            updated = True
            
            # 如果圖片已存在，則跳過，避免重複生成消耗 quota
            if os.path.exists(img_abs_path):
                continue
            
            # 執行翻譯與優化
            spot_desc_eng = translate_spot_via_gemini(api_key, item['title'], item['desc'])
            
            # 組合完整 Prompt (畫風風格 + 動態人數角色描述 + 景點場景描述)
            full_prompt = f"{STYLE_PROMPT} {character_prompt} is {spot_desc_eng}"
            
            # 生成圖片
            success = generate_image_via_imagen(api_key, full_prompt, img_abs_path)
            if not success:
                print(f"⚠️ 無法生成 {img_rel_path} 的實體圖片，但已保留 JSON 對應欄位。")

    if updated:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"💾 行程 JSON 已更新並儲存: {json_path}\n")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    data_dir = os.path.join(project_root, 'data')

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("⚠️ 注意: 偵測到環境變數中缺乏 GEMINI_API_KEY。")
        print("系統仍會自動為行程 JSON 注入預期圖片路徑，若本地已有快取/預置圖片即可正常展示。")

    # 取得要處理的 JSON 檔案清單
    target_files = ['japan.json', 'china.json', 'swiss.json', 'paris.json', 'taiwan.json', 'itinerary.json', 'china_trip.json', 'swiss_trip.json']
    for filename in target_files:
        json_path = os.path.join(data_dir, filename)
        process_itinerary_json(json_path, data_dir, api_key)

if __name__ == '__main__':
    main()
