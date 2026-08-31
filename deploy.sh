#!/usr/bin/env bash
# ==============================================================================
# AI Agent 原生 Peak 一鍵全自動構建、隱私檢查與 GitHub Pages 部署流水線 (v4.0)
# ==============================================================================

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🚀 [1/4] 正在執行強型態 Markdown 解析與 JSON 鏈條建構 (build_json.py)..."
python3 "$SCRIPT_DIR/scripts/build_json.py"

echo "🛡️ [2/4] 啟動 GitHub Pages 發布前隱私與個資自動化檢查 (privacy_check.py)..."
python3 "$SCRIPT_DIR/scripts/privacy_check.py"

echo "🔍 [3/4] 啟動 AI 自我修復與自動診斷 Agent (health_check.py)..."
python3 "$SCRIPT_DIR/scripts/health_check.py"

echo "🧹 [4/4] 執行 Git 歷史索引安全清理 (僅移出 Git 追蹤，保留本地端檔案)..."
if [ -d "$SCRIPT_DIR/.git" ]; then
    git rm -r --cached --ignore-unmatch "$SCRIPT_DIR/日誌" "$SCRIPT_DIR/bak" "$SCRIPT_DIR/.agents" >/dev/null 2>&1 || true
    echo "  ✅ 已安全確認 Git 追蹤過濾規範（日誌/、bak/、.agents/ 僅留本地端）。"
fi

echo ""
echo "🎉 GitHub Pages 預備與隱私檢查 100% 成功！"
echo "🌐 提示: 您現在可提交 Git 並推送到 GitHub 倉庫發布 GitHub Pages："
echo "   git add ."
echo "   git commit -m 'Deploy to GitHub Pages'"
echo "   git push origin main"
