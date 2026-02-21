import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "プレきょーの一曲 - かきょの間",
    description: "今日の気分に合わせて選曲をお届けします。",
};

export default function StandaloneSongsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
