'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './TagSelector.module.css';

const QUICK_TAGS = ['test', 'account1', 'account2', 'account3', 'person1'];

export default function TagSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag') || 'test';
  const [tagInput, setTagInput] = useState(currentTag);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTag = (tag: string) => {
    router.push(`/?tag=${encodeURIComponent(tag)}`);
  };

  const handleLoadClick = () => {
    if (tagInput.trim()) {
      loadTag(tagInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoadClick();
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className={styles.headerControls}>
      <div className={styles.tagSelector}>
        <label htmlFor="tag-input">Tag:</label>
        <input
          type="text"
          id="tag-input"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter tag (e.g., person1, account1)"
        />
        <button onClick={handleLoadClick} className={styles.loadTagBtn}>
          Load
        </button>
      </div>
      <div className={styles.quickTags}>
        <span className={styles.quickTagsLabel}>Quick:</span>
        {QUICK_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => loadTag(tag)}
            className={styles.quickTagBtn}
          >
            {tag}
          </button>
        ))}
      </div>
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className={styles.refreshBtn}
      >
        {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
      </button>
    </div>
  );
}
