import { Redis } from '@upstash/redis';

// Vercel上の環境変数の名前が環境によって異なる場合があるため、
// 可能性のある名前をすべてチェックします。
const url =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.KV_URL;

const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

// 診断用ログ（Vercelのログ画面に表示されます）
if (!url || !token) {
    console.error('--- REDIS CONFIG ERROR ---');
    console.error('Missing Redis environment variables.');
    console.error('Available env keys:', Object.keys(process.env).filter(k => k.includes('REDIS') || k.includes('KV')));
    console.error('---------------------------');
}

/**
 * 直接 URL と Token を渡して初期化することで、
 * fromEnv() の自動検知に頼らず確実に接続します。
 */
export const kv = new Redis({
    url: url || '',
    token: token || '',
});

export default kv;
