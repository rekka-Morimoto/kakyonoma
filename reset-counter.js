import { kv } from './lib/kv.js';

async function resetResidentCounter() {
    try {
        console.log('Resetting resident_counter to 0...');
        await kv.set('resident_counter', 0);
        
        console.log('Resetting building counts...');
        const buildings = ['あこがれびと', 'みまもりびと', 'となりびと', 'あゆみびと'];
        for (const building of buildings) {
            await kv.set(`building_count:${building}`, 0);
        }
        
        console.log('Reset complete. Next resident will be ID 1.');
    } catch (error) {
        console.error('Error resetting counter:', error);
    }
}

resetResidentCounter();
