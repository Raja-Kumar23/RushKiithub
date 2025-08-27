'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserRole } from '@/lib/auth';
import './globals.css';

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const role = await getUserRole(user.email);
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <html lang="en">
        <head>
          <title>SupportHub - KIIT</title>
          <meta name="description" content="KIIT Student Support System" />
        </head>
        <body>
          <div className="loading-container">
            <div className="loading"></div>
            <p>Loading SupportHub...</p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <title>SupportHub - KIIT</title>
        <meta name="description" content="KIIT Student Support System" />
      </head>
      <body>
        <div id="user-context" data-user={JSON.stringify(user)} data-role={userRole}>
          {children}
        </div>
      </body>
    </html>
  );
}