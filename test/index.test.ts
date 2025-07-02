import { BaleBotClient } from '../src/index';

// توکن ربات بله رو از متغیرهای محیطی بخون
const BOT_TOKEN = 'BOT_TOKEN';
// شناسه چتی که می‌خوای پیام بهش بفرستی رو از متغیرهای محیطی بخون
const CHAT_ID = 'YOUT_CHATID';

async function runTest() {
    console.log('--- شروع تست اتصال و ارسال پیام ---');

    // یک نمونه از کلاینت رو با توکن ربات ایجاد کن
    const client = new BaleBotClient(BOT_TOKEN);

    // --- تست متد getMe ---
    try {
        console.log('\nدر حال اجرای متد getMe...');
        const meResponse = await client.getMe();

        if (meResponse.ok) {
            console.log('✅ getMe با موفقیت انجام شد!');
            console.log('اطلاعات ربات:', meResponse.result);
            console.log(`نام کاربری ربات: @${meResponse.result.username}`);
        } else {
            console.error('❌ getMe با خطا مواجه شد:', meResponse.description);
        }
    } catch (error: any) {
        console.error('❌ خطایی در فراخوانی getMe رخ داد:', error.message);
    }

    // --- تست متد sendMessage ---

    try {
        console.log('\nدر حال اجرای متد sendMessage...');
        const messageText = `تست پیام از پکیج Bale Bot SDK در تاریخ: ${new Date().toLocaleString('fa-IR')}`;
        const sendMessageResponse = await client.sendMessage({
            chat_id: CHAT_ID,
            text: messageText
        });

        if (sendMessageResponse.ok) {
            console.log('✅ sendMessage با موفقیت انجام شد!');
            console.log('شناسه پیام ارسال شده:', sendMessageResponse.result.message_id);
        } else {
            console.error('❌ sendMessage با خطا مواجه شد:', sendMessageResponse.description);
        }
    } catch (error: any) {
        console.error('❌ خطایی در فراخوانی sendMessage رخ داد:', error.message);
    }

    console.log('\n--- پایان تست اتصال و ارسال پیام ---');
}

// تابع تست رو اجرا کن
runTest();