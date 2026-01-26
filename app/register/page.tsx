import RegistrationForm from '../components/RegistrationForm';
import Link from 'next/link';

export default function Register() {
    return (
        <main className="min-h-screen bg-transparent pb-20">
            <div className="max-w-7xl mx-auto px-4 pt-8">
                <Link href="/" className="inline-flex items-center text-stone-500 hover:text-indigo-600 transition-colors mb-8 group">
                    <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
                    トップへ戻る
                </Link>
            </div>
            <RegistrationForm />
        </main>
    );
}
