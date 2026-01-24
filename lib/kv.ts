import { createClient } from '@vercel/kv';

/**
 * Vercelの最近のアップデートにより、環境変数の名前が 
 * KV_REST_API_URL ではなく UPSTASH_REDIS_REST_URL になっている場合があります。
 * どちらの名前でも動作するように、共通のクライアントを作成します。
 */
export const kv = createClient({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

export default kv;
