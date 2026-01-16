'use client';

import { useEffect, useState } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (value: string) => void; // fonction appelée quand la recherche change
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  // Texte saisi dans l’input
  const [value, setValue] = useState('');

  /**
   * Effet de debounce :
   * - attend 300 ms après la dernière frappe
   * - puis appelle onSearch
   * - nettoie le timeout si value change avant la fin
   */
  useEffect(() => {
    const handle = setTimeout(() => {
      onSearch(value);
    }, 300);

    // Annule le timeout précédent
    return () => clearTimeout(handle);
  }, [value, onSearch]);

  // Gère la soumission du formulaire (clic sur la loupe / Entrée)
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // empêche le rechargement de la page
    onSearch(value); // recherche immédiate
  }

  // Vide le champ de recherche
  function handleClear() {
    setValue('');    // réinitialise l’input
    onSearch('');    // réinitialise la recherche
  }

  return (
    <div className={styles.searchBar}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Champ de saisie */}
        <input
          type="text"
          className={styles.input}
          placeholder="Rechercher une recette, un ingrédient, ..."
          value={value}
          onChange={(event) => setValue(event.target.value)} // met à jour value
        />

        {/* Bouton pour effacer la recherche */}
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

        {/* Bouton de soumission */}
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