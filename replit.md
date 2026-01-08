# Laurine WaBot (WhatsApp Selfbot)

## Overview
This is a WhatsApp selfbot built with the Baileys library (modified version by @shennmine). It runs as a console application that connects to WhatsApp via phone number pairing.

## Project Structure
- `index.js` - Main entry point, handles WhatsApp connection and client setup
- `message.js` - Message handler with commands (menu, tagall, get, eval, exec, etc.)
- `settings/config.js` - Bot configuration (owner, session name, status settings)
- `command/` - Plugin commands directory
- `w-shennmine/lib/` - Library functions (connection, media conversion, exif, etc.)

## Running the Bot
The bot runs via: `node index.js`

On first run, it will prompt for a WhatsApp phone number (starting with country code, e.g., 62 for Indonesia) and display a pairing code.

## Key Features
- WhatsApp message handling
- Interactive messages and buttons support
- Sticker creation (image/video to sticker)
- Status reactions (auto-react to status updates)
- Plugin system for extensible commands
- Album message support

## Configuration
Edit `settings/config.js` to customize:
- `owner` - Owner phone number
- `session` - Session folder name
- `status.public` - Public/private mode
- `status.terminal` - Enable pairing via terminal
- `status.reactsw` - Auto-react to status

## Dependencies
Built with Node.js 20, using:
- @shennmine/baileys - WhatsApp Web API
- jimp - Image processing
- fluent-ffmpeg - Media conversion
- qrcode-terminal - QR code display
