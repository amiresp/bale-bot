# Bale Bot

Bale Bot is a simple SDK for interacting with the Bale messaging platform. This package allows you to easily create a bot, retrieve bot information, and send messages.

## نحوه استفاده از پکیج

برای استفاده از این پکیج، ابتدا آن را نصب کنید:

```bash
npm i bale-bot-ts
```

سپس می‌توانید از آن در پروژه خود استفاده کنید:

```typescript
import { BaleBotClient } from 'bale-bot-ts';

// توکن ربات بله را از متغیرهای محیطی بخوانید
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const client = new BaleBotClient(BOT_TOKEN);
```

### گرفتن مشخصات ربات
برای دریافت مشخصات ربات، می‌توانید از متد getMe استفاده کنید:

```typescript
const meResponse = await client.getMe();

if (meResponse.ok) {
    console.log('اطلاعات ربات:', meResponse.result);
} else {
    console.error('خطا در دریافت اطلاعات ربات:', meResponse.description);
}
```

### ارسال پیام متنی
برای ارسال یک پیام متنی به یک چت خاص، از متد sendMessage استفاده کنید:

```typescript
const CHAT_ID = 'YOUR_CHAT_ID_HERE';
const messageText = 'متن پیام شما';

await client.sendMessage({
    chat_id: CHAT_ID,
    text: messageText
});
```

در صورت بروز مشکل یا پیشنهاد
در صورت بروز مشکل یا داشتن پیشنهاد، لطفاً از طریق گیت‌هاب اقدام بفرمایید.