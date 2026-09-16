'use client';

import RegistrationForm from '../components/RegistrationForm';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18nContext';

export default function Register() {
    const { t } = useLanguage();
    return (
        <main className="min-h-screen bg-transparent pb-20">
            <div className="max-w-7xl mx-auto px-4 pt-8">
                <Link href="/" className="inline-flex items-center text-[#c9a64e] hover:text-white transition-colors mb-8 group font-bold tracking-widest text-lg">
                    <span className="mr-3 transform group-hover:-translate-x-2 transition-transform text-2xl">←</span>
                    {t('common.back')}
                </Link>
            </div>
            <RegistrationForm />
        </main>
    );
}
