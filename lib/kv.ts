import Redis from 'ioredis';

/**
 * 標準的な Redis プロトコル (redis://) を使用するために ioredis を使用します。
 * これにより Redis Labs や Upstash (Redis Protocol 対応) など、
 * ほぼすべての Redis プロバイダーと接続可能になります。
 */
const redisUrl =
    process.env.REDIS_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_URL ||
    '';

if (!redisUrl) {
    console.error('--- REDIS CONFIG ERROR ---');
    console.error('Missing REDIS_URL environment variable.');
    console.error('---------------------------');
}

// ioredis は URL を渡すだけで自動的にパスワードやホストを認識します。
// TLS (rediss://) も自動的に処理されます。
const kv = new Redis(redisUrl, {
    // サーバーレス環境でのタイムアウト対策
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,
});

kv.on('error', (err) => {
    console.error('Redis Connection Error:', err);
});

export default kv;
export { kv };
