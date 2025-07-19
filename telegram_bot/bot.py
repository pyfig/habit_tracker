import os
import logging
import requests
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

TOKEN = os.environ.get("TELEGRAM_TOKEN")
CHAT_ID = os.environ.get("ALLOWED_CHAT_ID")
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
REPO = os.environ.get("GITHUB_REPO")
WORKFLOW = os.environ.get("WORKFLOW_ID", "ci.yml")

async def run_ci(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if CHAT_ID and str(update.effective_chat.id) != CHAT_ID:
        return
    resp = requests.post(
        f"https://api.github.com/repos/{REPO}/actions/workflows/{WORKFLOW}/dispatches",
        headers={
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json",
        },
        json={"ref": "main"},
    )
    if resp.status_code == 204:
        await update.message.reply_text("CI triggered successfully")
    else:
        await update.message.reply_text(f"Failed to trigger CI: {resp.text}")


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("run_ci", run_ci))
    app.run_polling()

if __name__ == "__main__":
    main()
