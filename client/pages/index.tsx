import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

function Index() {
  const router = useRouter();

  useEffect(() => {
    router.push('/list');
  }, [router]);

  return (
    <div></div>
  );
}

export default Index;
