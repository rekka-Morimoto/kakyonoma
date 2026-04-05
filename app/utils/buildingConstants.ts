
export type BuildingType = 'あこがれびと' | 'みまもりびと' | 'となりびと' | 'あゆみびと';

export interface BuildingStyle {
    name: BuildingType;
    emoji: string;
    description: string;
    iconPath?: string;
    gradient: string;
    border: string;
    text: string;
    bg: string;
    ring: string;
    shadow: string;
}

export const BUILDING_STYLES: Record<BuildingType, BuildingStyle> = {
    'あこがれびと': {
        name: 'あこがれびと',
        emoji: '✨',
        iconPath: '/あこがれびと.webp',
        description: 'あなたにとって推しは、手の届かない場所で輝く特別な存在。言葉にしきれない表現や、その場にしか生まれない空気感に心を奪われ、ただそこに在る姿を受け取ること自体が喜びになります。すべてを理解しなくてもいい、近づかなくてもいい。遠くから見上げるその背中が、日常を少しだけ明るく照らしてくれるあなたに、「あこがれびと」の名前を授けます。',
        gradient: 'from-purple-500 to-indigo-600',
        border: 'border-purple-200',
        text: 'text-purple-700',
        bg: 'bg-purple-50',
        ring: 'ring-purple-400',
        shadow: 'shadow-purple-200'
    },
    'みまもりびと': {
        name: 'みまもりびと',
        emoji: '🕊️',
        iconPath: '/みまもりびと.webp',
        description: 'あなたのタイプは「みまもりびと」です。あなたは推しの言葉や選択の積み重ねを、静かに、丁寧に受け取っています。何を考え、なぜそうしたのかを理解しようとしながらも、自分が踏み込みすぎることは望まない。推しが選んだ道を尊重し、その歩みを少し後ろから見届けることに安心を感じるタイプです。干渉せず、期待を押しつけず、ただ変わらぬまなざしを向け続けるあなたに、「みまもりびと」の名前を授けます。',
        gradient: 'from-emerald-500 to-teal-600',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        ring: 'ring-emerald-400',
        shadow: 'shadow-emerald-200'
    },
    'となりびと': {
        name: 'となりびと',
        emoji: '🔥',
        iconPath: '/となりびと.webp',
        description: 'あなたのタイプは「となりびと」です。あなたは推しと同じ空間、同じ時間を生きている感覚を大切にしています。理屈よりも感情、説明よりも一体感。ライブの熱や配信の空気の中で、「今この瞬間を一緒に楽しんでいる」ことに何よりの価値を見出します。推しは遠い存在ではなく、同じ景色を見ている誰か。その熱量を分かち合い、共に今を刻むあなたに、「となりびと」の名前を授けます。',
        gradient: 'from-orange-500 to-red-600',
        border: 'border-orange-200',
        text: 'text-orange-700',
        bg: 'bg-orange-50',
        ring: 'ring-orange-400',
        shadow: 'shadow-orange-200'
    },
    'あゆみびと': {
        name: 'あゆみびと',
        emoji: '🤝',
        iconPath: '/あゆみびと.webp',
        description: 'あなたのタイプは「あゆみびと」です。あなたは推しを同じ世界に生きるとても近しい存在に感じています。推しは何を考えてどう選択していくのか？それを口に出して説明できるほど細やかに捉えようとするあなたを大切に、推しの存在は自分の少し前を歩く憧れの人です。同じ目線で、けれど確かな敬意を持って歩みを進めるあなたに、「あゆみびと」の名前を授けます。',
        gradient: 'from-blue-500 to-cyan-600',
        border: 'border-blue-200',
        text: 'text-blue-700',
        bg: 'bg-blue-50',
        ring: 'ring-blue-400',
        shadow: 'shadow-blue-200'
    }
};

export const getBuildingStyle = (buildingName?: string): BuildingStyle => {
    // Default fallback if building is undefined or invalid
    if (!buildingName || !BUILDING_STYLES[buildingName as BuildingType]) {
        return {
            name: 'あこがれびと', // Default fallback
            emoji: '🏠',
            gradient: 'from-stone-400 to-stone-600',
            border: 'border-stone-200',
            text: 'text-stone-700',
            bg: 'bg-stone-50',
            ring: 'ring-stone-400',
            shadow: 'shadow-stone-200'
        } as BuildingStyle;
    }
    return BUILDING_STYLES[buildingName as BuildingType];
};
