'use client';
import dynamic from 'next/dynamic';

const Overview = dynamic(() => import('./Overview'), {
  ssr: false,
});

export default function OverviewClient() {
  return <Overview />;
}

