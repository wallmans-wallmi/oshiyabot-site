'use client';

import dynamic from 'next/dynamic';

// Dynamically import the App component to avoid SSR issues with localStorage
const App = dynamic(() => import('@/app/App'), {
  ssr: false,
});

export default function Home() {
  return <App />;
}
