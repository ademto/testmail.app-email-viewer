'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Email } from '@/types/email';
import TagSelector from '@/components/TagSelector';
import EmailList from '@/components/EmailList';
import EmailDetail from '@/components/EmailDetail';

function EmailViewer() {
  const searchParams = useSearchParams();
  const tag = searchParams.get('tag') || 'test';
  
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmails();
  }, [tag]);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/emails?tag=${encodeURIComponent(tag)}`);
      const data = await response.json();

      if (data.success) {
        setEmails(data.emails);
      } else {
        setError(data.error || 'Failed to fetch emails');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch emails');
    } finally {
      setLoading(false);
    }
  };

  const selectedEmail = emails.find(email => email.id === selectedEmailId) || null;

  return (
    <div className="container">
      <header>
        <div>
          <h1>📧 Email Viewer</h1>
          <p className="subtitle">Testmail.app Inbox Viewer</p>
        </div>
        <TagSelector />
      </header>

      {error && (
        <div className="error-banner">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading emails...</p>
        </div>
      ) : (
        <div className="layout">
          <EmailList
            emails={emails}
            selectedEmailId={selectedEmailId}
            onSelectEmail={setSelectedEmailId}
          />
          <EmailDetail 
            email={selectedEmail} 
            namespace={process.env.NEXT_PUBLIC_TESTMAIL_NAMESPACE}
            tag={tag}
          />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>}>
      <EmailViewer />
    </Suspense>
  );
}
