import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function SplashScreen() {
    return (
        <div className="min-h-screen bg-[#FDFEFE] flex flex-col font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-50/60 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-orange-50/50 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex-1 flex flex-col w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Header Navbar */}
                <header className="pt-8 pb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Logo */}
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-blue-500">
                            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
                                <path d="M14 6C14 4.89543 13.1046 4 12 4H8C6.89543 4 6 4.89543 6 6V18C6 19.1046 6.89543 20 8 20H10V14H13C14.1046 14 15 13.1046 15 12V10M14 6H16C17.1046 6 18 6.89543 18 8V10M14 6V10M14 10H10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <Link href="/" className="text-xl font-bold tracking-tighter text-slate-800 lowercase">fixpair</Link>
                    </div>
                </header>

                <main className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20 py-12 lg:py-0">
                    {/* Left content */}
                    <div className="flex-1 max-w-2xl flex flex-col items-start gap-8">
                        {/* Pill badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 border border-blue-100 text-blue-600 text-[13px] font-semibold tracking-wide">
                            <Sparkles className="w-4 h-4 text-blue-500 fill-blue-500" />
                            The #1 Consultation Platform in Germany
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl lg:text-[4.75rem] leading-[1.05] font-black text-slate-900 tracking-tight">
                            Monetize your <br /> <span className="text-blue-600 tracking-tight">expertise</span> on <br /> your own terms.
                        </h1>

                        <p className="text-lg lg:text-[1.1rem] text-slate-500 leading-relaxed max-w-xl font-medium">
                            Join thousands of doctors, lawyers, and advisors using Consultly to manage bookings, host secure video sessions, and get paid instantly.
                        </p>

                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border-[2px] border-blue-500 text-slate-800 font-bold text-base hover:bg-blue-50/50 transition-colors bg-white mt-2 shadow-sm"
                        >
                            Sign In to Dashboard
                        </Link>

                        {/* Social proof */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-6">
                            <div className="flex -space-x-3">
                                <Image src="/avatar_1.png" alt="Professional avatar 1" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white object-cover object-center shadow-sm" />
                                <Image src="/avatar_2.png" alt="Professional avatar 2" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white object-cover object-center shadow-sm" />
                                <Image src="/avatar_3.png" alt="Professional avatar 3" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white object-cover object-center shadow-sm" />
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[11px] font-bold text-slate-600 z-10 relative shadow-sm">
                                    10k+
                                </div>
                            </div>
                            <div className="text-[13px] leading-snug text-slate-500 font-medium">
                                Trusted by 10,000+ professionals <br /> across Germany.
                            </div>
                        </div>
                    </div>

                    {/* Right content / Hero Image */}
                    <div className="flex-1 w-full max-w-xl lg:max-w-none relative animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {/* Outer frame styling */}
                        <div className="relative rounded-[2.5rem] p-3 sm:p-4 bg-white/40 shadow-2xl backdrop-blur-sm border border-white lg:mr-4">
                            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/4.5] sm:aspect-[4/5] bg-gray-100 shadow-inner">
                                <Image
                                    src="/hero_building.png"
                                    alt="Hero Building Architecture"
                                    fill
                                    className="object-cover"
                                    priority
                                />

                                {/* Glassmorphism floating card / Bottom Overlay */}
                                <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 px-5 py-4 rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10 shadow-xl flex items-center gap-4">
                                    <div className="w-11 h-11 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold shrink-0 shadow-sm">
                                        S
                                    </div>
                                    <div className="flex flex-col text-white max-w-full overflow-hidden">
                                        <span className="font-bold text-[15px] truncate drop-shadow-sm">Sarah J.</span>
                                        <span className="text-white/90 text-[13px] font-medium truncate drop-shadow-sm">Earned €4,250 this month</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}