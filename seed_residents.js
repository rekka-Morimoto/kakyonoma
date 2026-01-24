async function seed() {
    for (let i = 1; i <= 20; i++) {
        try {
            const res = await fetch('http://127.0.0.1:3000/api/residents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `テスト住民${i}`,
                    xAccount: `@test_user${i}`,
                    youtubeAccount: `test_channel_${i}`,
                    baseLocation: '雑談配信',
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
                    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
                    password: 'test'
                })
            });
            console.log(`Added テスト住民${i}: ${res.status}`);
            if (!res.ok) {
                const text = await res.text();
                console.log(`Error body: ${text}`);
            }
        } catch (err) {
            console.error(`Fetch error for 住民${i}:`, err);
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

seed();
