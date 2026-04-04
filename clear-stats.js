import { kv } from './lib/kv.js';

async function clearAllStats() {
    try {
        const keys = await kv.keys('stats:*');
        console.log(`Found ${keys.length} stats keys to delete.`);
        
        if (keys.length > 0) {
            const result = await kv.del(...keys);
            console.log(`Deleted ${result} keys. Reset complete.`);
        } else {
            console.log('No stats found to delete.');
        }
    } catch (error) {
        console.error('Error clearing stats:', error);
    }
}

clearAllStats();
