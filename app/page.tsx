'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
    const router = useRouter();

    useEffect(() => {
        // Check if user has agreed to terms
        const termsAgreed = sessionStorage.getItem('termsAgreed');

        if (termsAgreed === 'true') {
            router.replace('/home');
        } else {
            router.replace('/terms');
        }
    }, [router]);

    // Show loading state while redirecting
    return (
        <div className="min-h-screen bg-[#fcf9f2] flex items-center justify-center">
            <div className="text-[#6b5d4f] text-xl font-serif">読み込み中...</div>
        </div>
    );
}
