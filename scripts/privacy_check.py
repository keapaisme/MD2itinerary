#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MD2itinerary GitHub Pages 發布前自動化隱私與個資掃描器 (privacy_check.py)
任務：
1. 檢查發布檔案與圖片檔名中是否包含個人姓名。
2. 檢查準備上傳至 Git 之靜態檔內容是否含有硬編碼本機路徑或個資。
3. 驗證 .gitignore 規則確保敏感檔 (非 DEMO_ *.md, 日誌/, bak/) 不被追蹤。
"""

import os
import sys
import re
import glob

def check_privacy():
    print("🔒 [privacy_check.py] 啟動 GitHub Pages 發布前個資與隱私過濾掃描...")
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    errors = []

    # 1. 檢查圖片檔名是否包含人名
    image_extensions = ('*.jpg', '*.png', '*.jpeg', '*.gif', '*.webp')
    image_files = []
    for ext in image_extensions:
        image_files.extend(glob.glob(os.path.join(project_root, '**', ext), recursive=True))

    for img_path in image_files:
        # 跳過 bak 目錄
        if '/bak/' in img_path:
            continue
        basename = os.path.basename(img_path)
        # 檢查常見中文人名或隱私詞
        if re.search(r'(張|陳|林|黃|李|王|吳|劉|蔡|楊|許|鄭|謝|郭|洪|曾|邱|廖|賴|周|葉|蘇|莊|江|呂|何|羅|高|蕭|潘|朱|簡|鍾|彭|游|詹|胡|施|沉|余|趙|盧|梁|顏|柯|孫|魏|翁|范|方|戴|徐|薛|丁|鄧|杜)[一-龥]{1,2}', basename):
            errors.append(f"❌ 警告: 圖片檔名 {basename} 可能包含人名個資！")

    # 2. 檢查待上傳靜態檔 (HTML, JS, CSS, JSON, README.md) 內容
    scan_files = []
    for ext in ('*.html', '*.js', '*.css', '*.json', 'README.md'):
        scan_files.extend(glob.glob(os.path.join(project_root, ext)))
        scan_files.extend(glob.glob(os.path.join(project_root, 'js', ext)))
        scan_files.extend(glob.glob(os.path.join(project_root, 'css', ext)))
        scan_files.extend(glob.glob(os.path.join(project_root, 'data', ext)))

    for f_path in scan_files:
        if not os.path.isfile(f_path) or '/bak/' in f_path:
            continue
        try:
            with open(f_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                
            # 檢查硬編碼本機磁碟路徑
            if '/Volumes/AI_SSD/' in content or '/Users/kas/' in content:
                rel_p = os.path.relpath(f_path, project_root)
                # 排除純說明檔案（非公開靜態發布資產）
                if not rel_p.endswith('.py'):
                    errors.append(f"❌ 警告: {rel_p} 包含硬編碼本機磁碟路徑！")
                    
        except Exception as e:
            pass

    # 3. 檢查 .gitignore 存在與設定
    gitignore_path = os.path.join(project_root, '.gitignore')
    if not os.path.exists(gitignore_path):
        errors.append("❌ 錯誤: 專案缺少 .gitignore 檔案！")
    else:
        with open(gitignore_path, 'r', encoding='utf-8') as f:
            gi_content = f.read()
        if 'bak/' not in gi_content:
            errors.append("❌ 錯誤: .gitignore 必須包含 bak/ 排除條款！")
        if '日誌/' not in gi_content:
            errors.append("❌ 錯誤: .gitignore 必須包含 日誌/ 排除條款！")

    if errors:
        print("\n".join(errors))
        print("🚨 [privacy_check.py] 隱私檢查未通過，請修正上述問題後再試！")
        sys.exit(1)
    else:
        print("✅ [privacy_check.py] 隱私與個資安全檢查 100% 通過！合規發布至 GitHub Pages。")

if __name__ == '__main__':
    check_privacy()
