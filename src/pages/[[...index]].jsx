'use client';

import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import dynamic from 'next/dynamic';

const App = dynamic(() => import('../../App.jsx'), { ssr: false });

export default function Page() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
