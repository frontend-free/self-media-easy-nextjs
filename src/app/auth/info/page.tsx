'use client';

import { auth } from '@/auth';

function InfoPage() {
  const session = auth();

  return <div>{JSON.stringify(session, null, 2)}</div>;
}

export default InfoPage;
