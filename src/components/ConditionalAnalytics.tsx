"use client";

import React, { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

function ConditionalAnalytics() {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookie-consent');
    setConsent(storedConsent);
  }, []);

  // Only render Analytics if user has accepted cookies
  if (consent !== 'accepted') {
    return null;
  }

  return <Analytics />;
};

export default ConditionalAnalytics; 