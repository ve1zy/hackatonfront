# Next.js Notion Board with Telegram Integration

A Notion-like kanban board with Telegram bot integration for remote management.

## Features

- **Kanban Board**: Three columns (todo, in-progress, done)
- **Drag & Drop**: Move cards between columns
- **Telegram Integration**: Control the board via Telegram commands
- **Responsive UI**: Built with Tailwind CSS

## Setup Telegram Bot

1. Create a bot via [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Create `.env.local` with:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

## Webhook Configuration

Set webhook URL in BotFather:
```
/setwebhook url=https://your-domain.com/api/telegram
```

For local development, use ngrok:
```
/setwebhook url=https://your-ngrok-url.ngrok.io/api/telegram
```

## Telegram Commands

- `/help` - Show available commands
- `/new [title] [column]` - Create new card
- `/columns` - Show available columns
- `/list` - List recent commands
- `/move [id] [column]` - Move card to column
- `/delete [id]` - Delete card
- `/clear` - Clear all cards

## Development

```bash
npm run dev
```

Open http://localhost:3000