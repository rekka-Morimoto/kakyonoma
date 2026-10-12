import { Metadata } from 'next';
import SetlistViewClient from './SetlistViewClient';

interface Props {
    searchParams: Promise<{ s?: string; data?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const params = await searchParams;
    const s = params.s || '';
    const data = params.data || '';

    // タイトルと制作者の復元（簡易デコード）
    let title = '個人的最強セトリ';
    let creator = 'きょーめいと';

    const decodeBase64Utf8 = (str: string) => {
        let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4 !== 0) b64 += '=';
        return Buffer.from(b64, 'base64').toString('utf-8');
    };

    if (s) {
        try {
            const parsed = JSON.parse(decodeBase64Utf8(s));
            if (parsed.t) title = parsed.t;
            if (parsed.c) creator = parsed.c;
        } catch {}
    } else if (data) {
        try {
            const parsed = JSON.parse(decodeBase64Utf8(data));
            if (parsed.t) title = parsed.t;
            if (parsed.c) creator = parsed.c;
        } catch {}
    }

    const ogParam = s ? `s=${encodeURIComponent(s)}` : `data=${encodeURIComponent(data)}`;
    const ogImageUrl = `/api/og/setlist?${ogParam}`;
    const pageTitle = `${title} (Selected by ${creator}) | メゾンドきょー`;
    const description = `${creator}さんが厳選した12曲の個人的最強セットリスト！佳鏡院の歌枠・オリジナル曲・カバー曲をチェック！`;

    return {
        title: pageTitle,
        description: description,
        openGraph: {
            title: pageTitle,
            description: description,
            type: 'website',
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: title
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: pageTitle,
            description: description,
            images: [ogImageUrl]
        }
    };
}

export default function SetlistViewPage() {
    return (
        <main className="min-h-screen bg-transparent p-3 sm:p-8 md:p-12 relative overflow-hidden flex flex-col items-center">
            <SetlistViewClient />
        </main>
    );
}
