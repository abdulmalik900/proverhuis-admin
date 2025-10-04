'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    
    if (isLoggedIn !== 'true') {
      router.push('/');
    }
  }, [router]);

  return <>{children}</>;
}
