'use client';

import { useEffect, useState } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');

  // Debounce : onSearch est appelé 300ms après la dernière frappe
  useEffect(() => {
    const handle = setTimeout(() => {
      onSearch(value);
    }, 300);

    return () => clearTimeout(handle);
  }, [value, onSearch]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(value); // déclenche immédiat au submit
  }

  function handleClear() {
    setValue('');
    onSearch('');
  }

  return (
    <div className={styles.searchBar}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder="Rechercher une recette, un ingrédient, ..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />

        {value.length > 0 && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={handleClear}
            aria-label="Effacer la recherche"
          >
            <svg
              viewBox="0 0 24 24"
              className={styles.clearIcon}
              aria-hidden="true"
            >
              <line
                x1="5"
                y1="5"
                x2="19"
                y2="19"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="19"
                y1="5"
                x2="5"
                y2="19"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        <button
          type="submit"
          className={styles.button}
          aria-label="Rechercher"
        >
          <svg
            viewBox="0 0 24 24"
            className={styles.icon}
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="6" strokeWidth="2" />
            <line
              x1="16"
              y1="16"
              x2="21"
              y2="21"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
