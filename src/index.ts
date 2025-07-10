import axios, { AxiosInstance, AxiosResponse } from 'axios';
import FormData from 'form-data'; // Import FormData for Node.js multipart/form-data
import EventEmitter from 'events';

// --- Core API Interfaces ---

interface BotResponse<T> {
    ok: boolean;
    result: T;
    description?: string;
    error_code?: number;
    parameters?: object; // ResponseParameters
}

// --- انواع اصلی (Entities) ---

interface User {
    id: number;
    is_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
}

interface Chat {
    id: number;
    type: 'private' | 'group' | 'channel';
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    photo?: ChatPhoto;
}

interface Message {
    message_id: number;
    from?: User;
    date: number;
    chat: Chat;
    forward_from?: User;
    forward_from_chat?: Chat;
    forward_from_message_id?: number;
    forward_date?: number;
    reply_to_message?: Message;
    edit_date?: number;
    text?: string;
    animation?: Animation;
    audio?: Audio;
    document?: Document;
    photo?: PhotoSize[];
    sticker?: Sticker;
    video?: Video;
    voice?: Voice;
    caption?: string;
    contact?: Contact;
    location?: Location;
    new_chat_members?: User[];
    left_chat_member?: User;
    invoice?: Invoice;
    successful_payment?: SuccessfulPayment;
    web_app_data?: WebAppData;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup;
}

interface MessageId {
    message_id: number;
}

interface PhotoSize {
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    file_size?: number;
}

interface Animation {
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    duration: number;
    thumbnail?: PhotoSize;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
}

interface Audio {
    file_id: string;
    file_unique_id: string;
    duration: number;
    title?: string;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
}

interface Document {
    file_id: string;
    file_unique_id: string;
    thumbnail?: PhotoSize;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
}

interface Video {
    file_id: string;
    file_unique_id: string;
    width: number;
    height: number;
    duration: number;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
}

interface Voice {
    file_id: string;
    file_unique_id: string;
    duration?: number;
}

interface Contact {
    phone_number: string;
    first_name: string;
    last_name?: string;
    user_id?: number;
}

interface Location {
    longitude: number;
    latitude: number;
}

interface File {
    file_id: string;
    file_unique_id: string;
    file_size?: number;
    file_path?: string;
}

interface ReplyKeyboardMarkup {
    keyboard: KeyboardButton[][];
}

interface KeyboardButton {
    text: string;
    request_contact?: boolean;
    request_location?: boolean;
    web_app?: WebAppInfo;
}

// --- انواع پیچیده‌تر (Complex Types) ---

interface InlineKeyboardMarkup {
    inline_keyboard: InlineKeyboardButton[][];
}

interface InlineKeyboardButton {
    text: string;
    url?: string;
    callback_data?: string; // 1-64 bytes
    web_app?: WebAppInfo;
    copy_text?: CopyTextButton;
}

interface ReplyKeyboardRemove {
    remove_keyboard: true;
}

interface CallbackQuery {
    id: string;
    from: User;
    message?: Message;
    data?: string;
}

interface WebAppData {
    data: string;
}

interface WebAppInfo {
    url: string; // HTTPS URL
}

interface CopyTextButton {
    text: string; // 1-256 characters
}

interface ChatPhoto {
    small_file_id: string;
    small_file_unique_id: string;
    big_file_id: string;
    big_file_unique_id: string;
}

type InputFile = Buffer | NodeJS.ReadableStream | string; // Represents file content for multipart/form-data or file_id/URL

interface InputMediaBase {
    type: string; // "photo", "video", etc.
    media: string; // file_id, HTTP URL, or "attach://file_attach_name"
    caption?: string; // 0-1024 characters
}

interface InputMediaPhoto extends InputMediaBase {
    type: 'photo';
}

interface InputMediaVideo extends InputMediaBase {
    type: 'video';
    thumbnail?: string; // file_id, HTTP URL, or "attach://file_attach_name"
    width?: number;
    height?: number;
    duration?: number;
}

interface InputMediaAnimation extends InputMediaBase {
    type: 'animation';
    thumbnail?: string; // file_id, HTTP URL, or "attach://file_attach_name"
    width?: number;
    height?: number;
    duration?: number;
}

interface InputMediaAudio extends InputMediaBase {
    type: 'audio';
    thumbnail?: string; // file_id, HTTP URL, or "attach://file_attach_name"
    duration?: number;
    title?: string;
}

interface InputMediaDocument extends InputMediaBase {
    type: 'document';
    thumbnail?: string; // file_id, HTTP URL, or "attach://file_attach_name"
}

type InputMedia = InputMediaAnimation | InputMediaDocument | InputMediaAudio | InputMediaPhoto | InputMediaVideo;


interface Sticker {
    file_id: string;
    file_unique_id: string;
    type: 'regular' | 'mask';
    width: number;
    height: number;
    file_size?: number;
}

interface StickerSet {
    name: string;
    title: string;
    stickers: Sticker[];
    thumbnail?: PhotoSize;
}

interface InputSticker {
    sticker: string; // file_id or "attach://file_attach_name"
}

// --- انواع مربوط به پرداخت (Payment Types) ---

interface LabeledPrice {
    label: string;
    amount: number; // In Rial (Integer)
}

// Corrected: Define Invoice interface
interface Invoice {
    title: string;
    description: string;
    payload: string;
    currency: string; // Added based on common API patterns, not explicitly in the snippet you shared for Invoice, but present in PreCheckoutQuery/SuccessfulPayment
    total_amount: number; // Added based on common API patterns, present in PreCheckoutQuery/SuccessfulPayment
}


interface PreCheckoutQuery {
    id: string;
    from: User;
    currency: string; // "IRR"
    total_amount: number;
    invoice_payload: string;
    shipping_option_id?: string;
    order_info?: OrderInfo;
}

interface OrderInfo {
    name?: string;
    phone_number?: string;
    email?: string;
    shipping_address?: ShippingAddress;
}

interface ShippingAddress {
    country_code: string;
    state: string;
    city: string;
    street_line1: string;
    street_line2: string;
    post_code: string;
}

interface SuccessfulPayment {
    currency: string; // "IRR"
    total_amount: number;
    invoice_payload: string;
    telegram_payment_charge_id: string;
    provider_payment_charge_id?: string;
}

interface Transaction {
    id: string;
    status: 'pending' | 'succeed' | 'failed' | 'rejected' | 'timeout';
    userID: number;
    amount: number;
    createdAt: number; // Unix timestamp
}

// --- Method-Specific Options Interfaces (Now correctly defined) ---

interface SendMessageOptions {
    chat_id: number | string;
    text: string;
    parse_mode?: 'html' | 'markdown';
    disable_web_page_preview?: boolean;
    disable_notification?: boolean;
    reply_to_message_id?: number;
    reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove;
}

interface GetUpdatesOptions {
    offset?: number;
    limit?: number; // 1-100, default 100
    timeout?: number; // In seconds for long polling
}

interface SetWebhookOptions {
    url: string; // HTTPS URL
}

interface WebhookInfo {
    url: string;
    has_custom_certificate: boolean;
    pending_update_count: number;
    ip_address?: string;
    last_error_date?: number;
    last_error_message?: string;
    last_synchronization_error_date?: number;
    max_connections?: number;
    allowed_updates?: string[];
}

// --- Update Interface (for getUpdates) ---
interface Update {
    update_id: number;
    message?: Message;
    edited_message?: Message;
    channel_post?: Message;
    edited_channel_post?: Message;
    callback_query?: CallbackQuery;
    pre_checkout_query?: PreCheckoutQuery;
    // Add more fields as needed based on Bale API
}


// --- Main BaleBotClient Class ---

export class BaleBotClient extends EventEmitter {
    private api: AxiosInstance;
    private readonly baseURL: string = 'https://tapi.bale.ai/'; // Base URL for Bale Bot API
    private pollingInterval: ReturnType<typeof setInterval> | null = null;
    private lastUpdateId: number = 0;

    /**
     * Creates a new BaleBotClient instance.
     * @param token - The unique authentication token for your bot.
    */

    constructor(private token: string) {
        super();
        if (!token) {
            throw new Error('Bale Bot Token is required.');
        }
        this.api = axios.create({
            baseURL: `${this.baseURL}bot${this.token}/`,
            headers: {
                'Content-Type': 'application/json', // Default content type
            },
        });
    }

    private async sendRequest<T>(method: string, data?: Record<string, any>, isFileRequest: boolean = false): Promise<BotResponse<T>> {
        try {
            let response: AxiosResponse<BotResponse<T>>;
            if (isFileRequest && data) {
                const formData = new FormData();
                for (const key in data) {
                    if (Object.prototype.hasOwnProperty.call(data, key)) {
                        // If the value is a file (Buffer or ReadableStream)
                        if (data[key] instanceof Buffer || (data[key] && typeof data[key].pipe === 'function')) {
                            // Append file with a generic filename using the third argument as options for form-data
                            formData.append(key, data[key], { filename: key });
                        } else if (typeof data[key] === 'object' && data[key] !== null) {
                            // For objects or arrays, stringify them
                            formData.append(key, JSON.stringify(data[key]));
                        } else {
                            // For primitive types
                            formData.append(key, data[key]);
                        }
                    }
                }
                response = await this.api.post(method, formData, {
                    headers: {
                        // Ensure form-data generates the correct boundary
                        ...formData.getHeaders()
                    }
                });
            } else {
                // For non-file requests, default to JSON POST
                response = await this.api.post(method, data);
            }

            if (!response.data.ok) {
                throw new Error(`Bale API Error: ${response.data.description || 'Unknown error'} (Code: ${response.data.error_code})`);
            }
            return response.data;
        } catch (error: any) {
            console.error(`Error in ${method}:`, error.response?.data || error.message);
            throw new Error(`Failed to call ${method}: ${error.response?.data?.description || error.message}`);
        }
    }

    public startPolling(interval: number = 3000) {
        if (this.pollingInterval) return; // جلوگیری از شروع مجدد
        this.pollingInterval = setInterval(async () => {
            try {
                const response = await this.api.get<BotResponse<Update[]>>(`getUpdates`, {
                    params: {
                        offset: this.lastUpdateId + 1,
                        timeout: 0,
                    },
                });

                if (response.data.ok && Array.isArray(response.data.result)) {
                    for (const update of response.data.result) {
                        this.lastUpdateId = update.update_id;
                        if (update.message) {
                            this.emit('message', update.message);
                        }
                    }
                }
            } catch (error: any) {
                console.error('[Polling error]', error.message);
            }
        }, interval);
    }

    public stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
    }

    // --- متدهای موجود (Available Methods) ---

    /**
     * A simple method for testing your bot's authentication token.
     * @returns Basic information about the bot in the form of a User object.
     */
    public async getMe(): Promise<BotResponse<User>> {
        return this.sendRequest<User>('getMe');
    }

    /**
     * Use this method to log out from the cloud Bot API server before launching the bot in a test environment.
     * @returns True on success.
     */
    public async logout(): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('logout');
    }

    /**
     * Use this method to close the bot instance before moving it from a local server or test environment to the production server.
     * @returns True on success.
     */
    public async close(): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('close');
    }

    /**
     * Use this method to send text messages.
     * @param options - Options for sending the message.
     * @returns The sent Message object on success.
     */
    public async sendMessage(options: SendMessageOptions): Promise<BotResponse<Message>> {
        return this.sendRequest<Message>('sendMessage', options);
    }

    /**
     * Use this method to forward messages of any kind.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param from_chat_id - Unique identifier for the chat where the original message was sent.
     * @param message_id - Unique message identifier in the original chat.
     * @returns The forwarded Message on success.
     */
    public async forwardMessage(
        chat_id: string | number,
        from_chat_id: string | number,
        message_id: number
    ): Promise<BotResponse<Message>> {
        return this.sendRequest<Message>('forwardMessage', { chat_id, from_chat_id, message_id });
    }

    /**
     * Use this method to copy messages of any kind. Service messages and invoice messages can't be copied.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param from_chat_id - Unique identifier for the chat where the original message was sent.
     * @param message_id - Unique message identifier in the original chat.
     * @returns The MessageId of the sent message on success.
     */
    public async copyMessage(
        chat_id: string | number,
        from_chat_id: string | number,
        message_id: number
    ): Promise<BotResponse<MessageId>> {
        return this.sendRequest<MessageId>('copyMessage', { chat_id, from_chat_id, message_id });
    }

    /**
     * Use this method to send photos.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param photo - Photo to send. Pass a file_id, HTTP URL, or upload a new photo using multipart/form-data.
     * @param caption - Photo caption (0-1024 characters).
     * @param reply_to_message_id - If the message is a reply, ID of the original message.
     * @param reply_markup - Additional interface options.
     * @returns The sent Message on success.
     */
    public async sendPhoto(
        chat_id: string | number,
        photo: string | InputFile,
        caption?: string,
        reply_to_message_id?: number,
        reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove
    ): Promise<BotResponse<Message>> {
        const data: Record<string, any> = { chat_id, photo };
        if (caption) data.caption = caption;
        if (reply_to_message_id) data.reply_to_message_id = reply_to_message_id;
        if (reply_markup) data.reply_markup = reply_markup;
        return this.sendRequest<Message>('sendPhoto', data, typeof photo !== 'string');
    }

    /**
     * Use this method to send audio files, if you want Bale clients to display them in the music player.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param audio - Audio file to send. Pass a file_id, HTTP URL, or upload a new audio file using multipart/form-data.
     * @param caption - Audio caption (0-1024 characters).
     * @param reply_to_message_id - If the message is a reply, ID of the original message.
     * @param reply_markup - Additional interface options.
     * @returns The sent Message on success.
     */
    public async sendAudio(
        chat_id: string | number,
        audio: string | InputFile,
        caption?: string,
        reply_to_message_id?: number,
        reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove
    ): Promise<BotResponse<Message>> {
        const data: Record<string, any> = { chat_id, audio };
        if (caption) data.caption = caption;
        if (reply_to_message_id) data.reply_to_message_id = reply_to_message_id;
        if (reply_markup) data.reply_markup = reply_markup;
        return this.sendRequest<Message>('sendAudio', data, typeof audio !== 'string');
    }

    /**
     * Use this method to send general files.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param document - File to send. Pass a file_id, HTTP URL, or upload a new file using multipart/form-data.
     * @param caption - Document caption (0-1024 characters).
     * @param reply_to_message_id - If the message is a reply, ID of the original message.
     * @param reply_markup - Additional interface options.
     * @returns The sent Message on success.
     */
    public async sendDocument(
        chat_id: string | number,
        document: string | InputFile,
        caption?: string,
        reply_to_message_id?: number,
        reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove
    ): Promise<BotResponse<Message>> {
        const data: Record<string, any> = { chat_id, document };
        if (caption) data.caption = caption;
        if (reply_to_message_id) data.reply_to_message_id = reply_to_message_id;
        if (reply_markup) data.reply_markup = reply_markup;
        return this.sendRequest<Message>('sendDocument', data, typeof document !== 'string');
    }

    /**
     * Use this method to send video files.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param video - Video to send. Pass a file_id, HTTP URL, or upload a new video file using multipart/form-data.
     * @param caption - Video caption (0-1024 characters).
     * @param reply_to_message_id - If the message is a reply, ID of the original message.
     * @param reply_markup - Additional interface options.
     * @returns The sent Message on success.
     */
    public async sendVideo(
        chat_id: string | number,
        video: string | InputFile,
        caption?: string,
        reply_to_message_id?: number,
        reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove
    ): Promise<BotResponse<Message>> {
        const data: Record<string, any> = { chat_id, video };
        if (caption) data.caption = caption;
        if (reply_to_message_id) data.reply_to_message_id = reply_to_message_id;
        if (reply_markup) data.reply_markup = reply_markup;
        return this.sendRequest<Message>('sendVideo', data, typeof video !== 'string');
    }

    /**
     * Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound).
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param animation - Animation to send. Pass a file_id, HTTP URL, or upload a new animation file using multipart/form-data.
     * @param reply_to_message_id - If the message is a reply, ID of the original message.
     * @param reply_markup - Additional interface options.
     * @returns The sent Message on success.
     */
    public async sendAnimation(
        chat_id: string | number,
        animation: string | InputFile,
        reply_to_message_id?: number,
        reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove
    ): Promise<BotResponse<Message>> {
        const data: Record<string, any> = { chat_id, animation };
        if (reply_to_message_id) data.reply_to_message_id = reply_to_message_id;
        if (reply_markup) data.reply_markup = reply_markup;
        return this.sendRequest<Message>('sendAnimation', data, typeof animation !== 'string');
    }

    /**
     * Use this method to send audio files, if you want Bale clients to display the file as a playable voice message.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param voice - Audio file to send. Pass a file_id, HTTP URL, or upload a new voice file using multipart/form-data.
     * @param caption - Voice message caption (0-1024 characters).
     * @param reply_to_message_id - If the message is a reply, ID of the original message.
     * @param reply_markup - Additional interface options.
     * @returns The sent Message on success.
     */
    public async sendVoice(
        chat_id: string | number,
        voice: string | InputFile,
        caption?: string,
        reply_to_message_id?: number,
        reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove
    ): Promise<BotResponse<Message>> {
        const data: Record<string, any> = { chat_id, voice };
        if (caption) data.caption = caption;
        if (reply_to_message_id) data.reply_to_message_id = reply_to_message_id;
        if (reply_markup) data.reply_markup = reply_markup;
        return this.sendRequest<Message>('sendVoice', data, typeof voice !== 'string');
    }

    /**
     * Use this method to send a group of photos, videos, documents or audios as an album.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param media - A JSON-serialized array describing messages to be sent.
     * @param reply_to_message_id - If the message is a reply, ID of the original message.
     * @returns An array of sent Messages on success.
     */
    public async sendMediaGroup(
        chat_id: string | number,
        media: InputMedia[],
        reply_to_message_id?: number
    ): Promise<BotResponse<Message[]>> {
        const data: Record<string, any> = { chat_id, media: JSON.stringify(media) };
        if (reply_to_message_id) data.reply_to_message_id = reply_to_message_id;

        // Check if any media item requires multipart/form-data
        const requiresMultipart = media.some(item => item.media.startsWith('attach://'));

        return this.sendRequest<Message[]>('sendMediaGroup', data, requiresMultipart);
    }

    /**
     * Use this method to send point on the map.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param latitude - Latitude of the location.
     * @param longitude - Longitude of the location.
     * @param horizontal_accuracy - The radius of uncertainty for the location, measured in meters. 0-1500.
     * @param reply_to_message_id - If the message is a reply, ID of the original message.
     * @param reply_markup - Additional interface options.
     * @returns The sent Message on success.
     */
    public async sendLocation(
        chat_id: string | number,
        latitude: number,
        longitude: number,
        horizontal_accuracy?: number,
        reply_to_message_id?: number,
        reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove
    ): Promise<BotResponse<Message>> {
        const data: Record<string, any> = { chat_id, latitude, longitude };
        if (horizontal_accuracy) data.horizontal_accuracy = horizontal_accuracy;
        if (reply_to_message_id) data.reply_to_message_id = reply_to_message_id;
        if (reply_markup) data.reply_markup = reply_markup;
        return this.sendRequest<Message>('sendLocation', data);
    }

    /**
     * Use this method to send phone contacts.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param phone_number - Contact's phone number.
     * @param first_name - Contact's first name.
     * @param last_name - Contact's last name.
     * @param reply_to_message_id - If the message is a reply, ID of the original message.
     * @param reply_markup - Additional interface options.
     * @returns The sent Message on success.
     */
    public async sendContact(
        chat_id: string | number,
        phone_number: string,
        first_name: string,
        last_name?: string,
        reply_to_message_id?: number,
        reply_markup?: InlineKeyboardMarkup | ReplyKeyboardMarkup | ReplyKeyboardRemove
    ): Promise<BotResponse<Message>> {
        const data: Record<string, any> = { chat_id, phone_number, first_name };
        if (last_name) data.last_name = last_name;
        if (reply_to_message_id) data.reply_to_message_id = reply_to_message_id;
        if (reply_markup) data.reply_markup = reply_markup;
        return this.sendRequest<Message>('sendContact', data);
    }

    /**
     * Use this method to get basic info about a file and prepare it for downloading.
     * @param file_id - File identifier to get info about.
     * @returns A File object on success.
     */
    public async getFile(file_id: string): Promise<BotResponse<File>> {
        return this.sendRequest<File>('getFile', { file_id });
    }

    /**
     * Use this method to receive incoming updates using long polling.
     * @param options - Options for getting updates.
     * @returns An Array of Update objects on success.
     */
    public async getUpdates(options?: GetUpdatesOptions): Promise<BotResponse<Update[]>> {
        return this.sendRequest<Update[]>('getUpdates', options);
    }

    /**
     * Use this method to specify a URL and receive incoming updates via an outgoing webhook.
     * @param options - Options for setting the webhook.
     * @returns True on success.
     */
    public async setWebhook(options: SetWebhookOptions): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('setWebhook', options);
    }

    /**
     * Use this method to get current webhook status.
     * @returns A WebhookInfo object on success.
     */
    public async getWebhookInfo(): Promise<BotResponse<WebhookInfo>> {
        return this.sendRequest<WebhookInfo>('getWebhookInfo');
    }

    /**
     * Use this method to get up-to-date information about the chat.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @returns A Chat object on success.
     */
    public async getChat(chat_id: string | number): Promise<BotResponse<Chat>> {
        return this.sendRequest<Chat>('getChat', { chat_id });
    }

    /**
     * Use this method to get the number of members in a chat.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @returns An Integer representing the number of chat members.
     */
    public async getChatMembersCount(chat_id: string | number): Promise<BotResponse<number>> {
        return this.sendRequest<number>('getChatMembersCount', { chat_id });
    }

    /**
     * Use this method to pin a message in a group or a channel.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param message_id - Identifier of the message to pin.
     * @returns True on success.
     */
    public async pinChatMessage(chat_id: string | number, message_id: number): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('pinChatMessage', { chat_id, message_id });
    }

    /**
     * Use this method to unpin a message in a group or a channel.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param message_id - Identifier of the message to unpin.
     * @returns True on success.
     */
    public async unpinChatMessage(chat_id: string | number, message_id: number): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('unpinChatMessage', { chat_id, message_id });
    }

    /**
     * Use this method to unpin all pinned messages in a chat.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @returns True on success.
     */
    public async unpinAllChatMessages(chat_id: string | number): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('unpinAllChatMessages', { chat_id });
    }

    /**
     * Use this method to change the title of a chat.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param title - New chat title.
     * @returns True on success.
     */
    public async setChatTitle(chat_id: string | number, title: string): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('setChatTitle', { chat_id, title });
    }

    /**
     * Use this method to change the description of a group or a channel.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param description - New chat description.
     * @returns True on success.
     */
    public async setChatDescription(chat_id: string | number, description: string): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('setChatDescription', { chat_id, description });
    }

    /**
     * Use this method to delete a chat photo.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @returns True on success.
     */
    public async deleteChatPhoto(chat_id: string | number): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('deleteChatPhoto', { chat_id });
    }

    /**
     * Use this method to create a new invite link for a chat.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @returns The new invite link on success.
     */
    public async createChatInviteLink(chat_id: string | number): Promise<BotResponse<string>> {
        return this.sendRequest<string>('createChatInviteLink', { chat_id });
    }

    /**
     * Use this method to revoke an invite link for a group. After revocation, a new link is generated and returned.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param invite_link - The invite link to revoke.
     * @returns The new invite link on success.
     */
    public async revokeChatInviteLink(chat_id: string | number, invite_link: string): Promise<BotResponse<string>> {
        return this.sendRequest<string>('revokeChatInviteLink', { chat_id, invite_link });
    }

    /**
     * Use this method for the bot to create a new invite link for a chat. If already created, it will be revoked and a new one will be created.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @returns The new invite link on success.
     */
    public async exportChatInviteLink(chat_id: string | number): Promise<BotResponse<string>> {
        return this.sendRequest<string>('exportChatInviteLink', { chat_id });
    }

    /**
     * Use this method to edit text messages.
     * @param text - New text of the message (1-4096 characters).
     * @param chat_id - Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel.
     * @param message_id - Required if inline_message_id is not specified. Identifier of the message to edit.
     * @param reply_markup - A JSON-serialized object for an inline keyboard.
     * @returns The edited Message object on success.
     */
    public async editMessageText(
        text: string,
        chat_id?: string | number,
        message_id?: number,
        reply_markup?: InlineKeyboardMarkup
    ): Promise<BotResponse<Message>> {
        const data: Record<string, any> = { text };
        if (chat_id) data.chat_id = chat_id;
        if (message_id) data.message_id = message_id;
        if (reply_markup) data.reply_markup = reply_markup;
        return this.sendRequest<Message>('editMessageText', data);
    }

    /**
     * Use this method to delete a message, including service messages.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param message_id - Identifier of the message to delete.
     * @returns True on success.
     */
    public async deleteMessage(chat_id: string | number, message_id: number): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('deleteMessage', { chat_id, message_id });
    }

    /**
     * Use this method to upload a file for future use in newStickerSet and addStickerToSet methods.
     * @param user_id - User identifier of sticker file owner.
     * @param sticker - A file of .WEBP, .PNG, .TGS, or .WEBM format.
     * @returns The uploaded File object on success.
     */
    public async uploadStickerFile(user_id: number, sticker: InputFile): Promise<BotResponse<File>> {
        return this.sendRequest<File>('uploadStickerFile', { user_id, sticker }, true);
    }

    /**
     * Use this method to create a new sticker set owned by a user.
     * @param user_id - User identifier of created sticker set owner.
     * @param name - Short name of the sticker set.
     * @param title - Sticker set title.
     * @param stickers - A JSON-serialized list of 1-50 initial stickers to be added to the sticker set.
     * @returns True on success.
     */
    public async createNewStickerSet(
        user_id: number,
        name: string,
        title: string,
        stickers: InputSticker[]
    ): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('createNewStickerSet', { user_id, name, title, stickers: JSON.stringify(stickers) });
    }

    /**
     * Use this method to add a new sticker to a set created by the bot.
     * @param user_id - User identifier of sticker set owner.
     * @param name - Sticker set name.
     * @param sticker - A JSON-serialized object with information about the added sticker.
     * @returns True on success.
     */
    public async addStickerToSet(
        user_id: number,
        name: string,
        sticker: InputSticker
    ): Promise<BotResponse<boolean>> {
        return this.sendRequest<boolean>('addStickerToSet', { user_id, name, sticker: JSON.stringify(sticker) });
    }

    /**
     * Use this method to send invoices.
     * @param chat_id - Unique identifier for the target chat or username of the target channel.
     * @param title - Product name (1-32 characters).
     * @param description - Product description (1-255 characters).
     * @param payload - Bot-defined invoice payload (1-128 bytes).
     * @param provider_token - Payment provider token (card number or wallet token).
     * @param prices - A JSON-serialized list of items and their prices.
     * @param photo_url - URL of the product photo.
     * @param reply_to_message_id - If the message is a reply, ID of the original message.
     * @returns The sent Message on success.
     */
    public async sendInvoice(
        chat_id: string | number,
        title: string,
        description: string,
        payload: string,
        provider_token: string,
        prices: LabeledPrice[],
        photo_url?: string,
        reply_to_message_id?: number
    ): Promise<BotResponse<Message>> {
        const data: Record<string, any> = {
            chat_id, title, description, payload, provider_token, prices: JSON.stringify(prices)
        };
        if (photo_url) data.photo_url = photo_url;
        if (reply_to_message_id) data.reply_to_message_id = reply_to_message_id;
        return this.sendRequest<Message>('sendInvoice', data);
    }

    /**
     * Use this method to respond to a pre-checkout query.
     * @param pre_checkout_query_id - Unique identifier for the pre-checkout query to be answered.
     * @param ok - True if everything is alright, False otherwise.
     * @param error_message - Required if ok is False. Error message to be displayed to the user.
     * @returns True on success.
     */
    public async answerPreCheckoutQuery(
        pre_checkout_query_id: string,
        ok: boolean,
        error_message?: string
    ): Promise<BotResponse<boolean>> {
        const data: Record<string, any> = { pre_checkout_query_id, ok };
        if (error_message) data.error_message = error_message;
        return this.sendRequest<boolean>('answerPreCheckoutQuery', data);
    }

    /**
     * Use this method to inquire about the status of a specific transaction by sending its unique ID.
     * Note: This method is NOT present in standard Telegram bot libraries and requires direct HTTP request.
     * @param transaction_id - Unique ID of the transaction to inquire.
     * @returns A Transaction object on success.
     */
    public async inquireTransaction(transaction_id: string): Promise<BotResponse<Transaction>> {
        return this.sendRequest<Transaction>('inquireTransaction', { transaction_id });
    }
}