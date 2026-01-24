import { Redis } from '@upstash/redis';

/**
 * @vercel/kv の不具合（環境変数の名前不一致）を回避するため、
 * 直接 @upstash/redis を使用します。
 * Redis.fromEnv() は自動的に以下の環境変数を探します：
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */
const kv = Redis.fromEnv();

export default kv;
export { kv };
