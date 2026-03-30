'use client';

import { useState, useEffect, useRef } from 'react';
import { Email } from '@/types/email';
import styles from './EmailDetail.module.css';

interface EmailDetailProps {
  email: Email | null;
  namespace?: string;
  tag?: string;
}

type TabType = 'html' | 'text' | 'raw';

export default function EmailDetail({ email, namespace, tag }: EmailDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (email?.html && iframeRef.current && activeTab === 'html') {
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    table {
      border-collapse: collapse;
      width: 100%;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  ${email.html}
</body>
</html>`;

      iframeRef.current.srcdoc = fullHtml;

      const handleLoad = () => {
        try {
          const iframe = iframeRef.current;
          if (!iframe) return;

          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) return;

          const body = iframeDoc.body;
          const html = iframeDoc.documentElement;

          if (body && html) {
            const height = Math.max(
              body.scrollHeight,
              body.offsetHeight,
              html.clientHeight,
              html.scrollHeight,
              html.offsetHeight
            );
            iframe.style.height = (height + 40) + 'px';
          }
        } catch (e) {
          console.log('Could not resize iframe:', e);
        }
      };

      iframeRef.current.onload = handleLoad;
      setTimeout(handleLoad, 500);
    }
  }, [email?.html, activeTab]);

  const getFromDisplay = (email: Email) => {
    if (email.from_parsed && email.from_parsed[0]) {
      const parsed = email.from_parsed[0];
      return parsed.name ? `${parsed.name} <${parsed.address}>` : parsed.address;
    }
    return email.from;
  };

  if (!email) {
    const testmailAddress = namespace && tag ? `${namespace}.${tag}@inbox.testmail.app` : null;
    
    return (
      <div className={styles.emailDetail}>
        <div className={styles.noSelection}>
          <h2>👈 Select an email to view</h2>
          <p>Click on an email from the list to see its contents</p>
          {testmailAddress && (
            <div className={styles.emailAddress}>
              <p className={styles.emailAddressLabel}>📧 Send test emails to:</p>
              <code className={styles.emailAddressValue}>{testmailAddress}</code>
              <button 
                className={styles.copyBtn}
                onClick={() => {
                  navigator.clipboard.writeText(testmailAddress);
                }}
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.emailDetail}>
      <div className={styles.emailHeader}>
        <h2>{email.subject || '(No Subject)'}</h2>
        <div className={styles.emailMeta}>
          <div className={styles.metaRow}>
            <strong>From:</strong>
            <span>{getFromDisplay(email)}</span>
          </div>
          <div className={styles.metaRow}>
            <strong>To:</strong>
            <span>{email.to}</span>
          </div>
          <div className={styles.metaRow}>
            <strong>Date:</strong>
            <span>{new Date(email.date).toLocaleString()}</span>
          </div>
          {email.cc && (
            <div className={styles.metaRow}>
              <strong>CC:</strong>
              <span>{email.cc}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.emailTabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'html' ? styles.active : ''}`}
          onClick={() => setActiveTab('html')}
        >
          HTML View
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'text' ? styles.active : ''}`}
          onClick={() => setActiveTab('text')}
        >
          Text View
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'raw' ? styles.active : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          Raw JSON
        </button>
      </div>

      <div className={styles.emailBody}>
        {activeTab === 'html' && (
          <div className={styles.tabContent}>
            <div className={styles.emailFrameContainer}>
              <iframe
                ref={iframeRef}
                className={styles.emailFrame}
                sandbox="allow-same-origin"
                title="Email content"
              />
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className={styles.tabContent}>
            <pre>{email.text || 'No text content'}</pre>
          </div>
        )}

        {activeTab === 'raw' && (
          <div className={styles.tabContent}>
            <pre>{JSON.stringify(email, null, 2)}</pre>
          </div>
        )}
      </div>

      {email.attachments && email.attachments.length > 0 && (
        <div className={styles.attachments}>
          <h3>📎 Attachments ({email.attachments.length})</h3>
          <ul>
            {email.attachments.map((att, index) => (
              <li key={index}>
                {att.filename || 'Unnamed attachment'} ({att.size || 'unknown size'})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
