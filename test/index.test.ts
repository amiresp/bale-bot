import { BaleBotClient } from '../src/index';

// توکن ربات بله رو از متغیرهای محیطی بخون
const BOT_TOKEN = 'YOUTR_BOT_TOKEN';
// شناسه چتی که می‌خوای پیام بهش بفرستی رو از متغیرهای محیطی بخون
const CHAT_ID = 'ADD_YOUR_CHAT_ID_HERE';

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
        const messageText = `تست پیام از پکیج Bale Bot SDK در تاریخ: ${new Date().toLocaleString('fa-IR')} چت ای دی شما : ${CHAT_ID}`;
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


    try {
        client.on('message', (message) => {
            console.log(message);
            const sendMessageResponse = client.sendMessage({
                chat_id: CHAT_ID,
                text: `سلام ${message.from.first_name} عزیز! پیام شما دریافت شد: ${message.text} ${message.from.id}`
            });
        })

        client.startPolling(3000); // هر ۳ ثانیه
    } catch (error) {
        console.log('Err', error);
    }

    setInterval(() => { }, 5000);

    console.log('\n--- پایان تست اتصال و ارسال پیام ---');
}

// تابع تست رو اجرا کن
runTest();