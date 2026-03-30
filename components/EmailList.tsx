'use client';

import { Email } from '@/types/email';
import styles from './EmailList.module.css';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (emailId: string) => void;
}

export default function EmailList({ emails, selectedEmailId, onSelectEmail }: EmailListProps) {
  const getFromDisplay = (email: Email) => {
    if (email.from_parsed && email.from_parsed[0]) {
      return email.from_parsed[0].name || email.from_parsed[0].address;
    }
    return email.from;
  };

  return (
    <div className={styles.emailList}>
      <h2>Inbox ({emails.length})</h2>
      
      {emails.length === 0 ? (
        <div className={styles.noEmails}>
          <p>📭 No emails found</p>
          <small>Emails will appear here when sent to your Testmail.app inbox</small>
        </div>
      ) : (
        <>
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email.id)}
              className={`${styles.emailItem} ${selectedEmailId === email.id ? styles.active : ''}`}
            >
              <div className={styles.emailFrom}>{getFromDisplay(email)}</div>
              <div className={styles.emailSubject}>{email.subject || '(No Subject)'}</div>
              <div className={styles.emailDate}>{new Date(email.date).toLocaleString()}</div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
