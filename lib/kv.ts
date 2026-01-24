import { Redis } from '@upstash/redis';

/**
 * Vercelの環境変数からRedisの接続情報を取得します。
 * 複数の可能性のあるキーをチェックし、もし REDIS_URL しかない場合は
 * そこから REST API 用の URL と Token を抽出します。
 */
let url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.KV_URL;

let token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

// もし REDIS_URL しか存在しない場合、その文字列から情報を抽出する
if (!url && process.env.REDIS_URL) {
    try {
        const redisUrl = process.env.REDIS_URL;
        // 標準的な形式: redis://:PASSWORD@HOST:PORT または redis://default:PASSWORD@HOST:PORT
        const match = redisUrl.match(/redis(?:s)?:\/\/(?:[^:]*:)?([^@]+)@([^:]+)/);

        if (match) {
            const password = match[1];
            const host = match[2].split(':')[0]; // ポート番号を除去

            // Upstashの場合、REST URL は https:// + ホスト名
            url = `https://${host}`;
            token = password;

            console.log('--- REDIS INFO ---');
            console.log('Successfully reconstructed REST config from REDIS_URL');
            console.log('------------------');
        }
    } catch (e) {
        console.error('Failed to parse REDIS_URL:', e);
    }
}

// 最終的な診断（Vercelのログに表示）
if (!url || !token) {
    console.error('--- REDIS CONFIG ERROR ---');
    console.error('Missing Redis environment variables.');
    console.error('Available keys containing REDIS/KV:', Object.keys(process.env).filter(k => k.includes('REDIS') || k.includes('KV')));
    console.error('---------------------------');
}

export const kv = new Redis({
    url: url || '',
    token: token || '',
});

export default kv;
