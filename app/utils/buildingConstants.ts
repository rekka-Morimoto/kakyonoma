
export type BuildingType = 'あこがれびと' | 'みまもりびと' | 'となりびと' | 'あゆみびと';

export interface BuildingStyle {
    name: BuildingType;
    emoji: string;
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
