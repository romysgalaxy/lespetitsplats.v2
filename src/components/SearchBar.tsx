'use client';

import { useState } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    // pour l'instant la recherche n'est pas fonctionnelle
  }

  function handleClear() {
    setQuery('');
  }

  return (
    <div className={styles.searchBar}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.input}
          placeholder="Rechercher une recette, un ingrédient, ..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {query.length > 0 && (
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
