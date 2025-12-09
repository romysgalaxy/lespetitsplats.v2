'use client';

import { useMemo, useState } from 'react';
import styles from './TagFilters.module.css';
import type { Recipe } from './RecipeCard';
import Image from 'next/image';   // ⬅️ ajoute ça

export type TagCategory = 'ingredients' | 'appliances' | 'ustensils';

export interface SelectedTags {
  ingredients: string[];
  appliances: string[];
  ustensils: string[];
}

interface TagFiltersProps {
  recipes: Recipe[]; // recettes actuellement disponibles (déjà filtrées)
  selectedTags: SelectedTags;
  onAddTag: (type: TagCategory, value: string) => void;
  onRemoveTag: (type: TagCategory, value: string) => void;
  currentCount: number;
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function getUniqueTags(
  recipes: Recipe[],
  getter: (recipe: Recipe) => string[]
): string[] {
  const map = new Map<string, string>();

  recipes.forEach((recipe) => {
    getter(recipe).forEach((raw) => {
      const norm = normalize(raw);

      // Gestion simple singulier/pluriel en "s"
      if (norm.endsWith('s')) {
        // ex : "bananes" -> "banane"
        const singular = norm.slice(0, -1);

        // si le singulier existe déjà, on considère que c'est un doublon
        if (map.has(singular)) {
          return;
        }
        // sinon on laissera "bananes" tel quel plus bas
      } else {
        // on est sur un singulier, on regarde si un pluriel existe déjà
        const plural = norm + 's';

        if (map.has(plural)) {
          // on préfère le singulier -> on supprime le pluriel
          map.delete(plural);
        }
      }

      if (!map.has(norm)) {
        map.set(norm, raw);
      }
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    a.localeCompare(b, 'fr', { sensitivity: 'base' })
  );
}



interface TagDropdownProps {
  label: string;
  placeholder: string;
  items: string[];
  selected: string[];                    // ⬅️ les tags déjà sélectionnés pour cette catégorie
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
}

function TagDropdown({
  label,
  placeholder,
  items,
  selected,
  onSelect,
  onRemove,
}: TagDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const normQuery = normalize(query);

  // tags sélectionnés qui matchent la recherche
  const filteredSelected = useMemo(
    () =>
      selected.filter((item) =>
        normalize(item).includes(normQuery)
      ),
    [selected, normQuery]
  );

  // tags disponibles (non sélectionnés) qui matchent la recherche
  const filteredAvailable = useMemo(
    () =>
      items
        .filter((item) => !selected.includes(item))
        .filter((item) =>
          normalize(item).includes(normQuery)
        ),
    [items, selected, normQuery]
  );

  function handleSelect(value: string) {
    onSelect(value);
    setQuery('');
  }

  function handleRemove(value: string) {
    onRemove(value);
    setQuery('');
  }

  function formatTagLabel(value: string) {
    const lower = value.toLocaleLowerCase('fr-FR');
    return lower.charAt(0).toLocaleUpperCase('fr-FR') + lower.slice(1);
  }


  return (
    <div className={styles.dropdown}>
      <button
        type="button"
        className={styles.dropdownButton}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{label}</span>
        <Image
          src={open ? '/images/arrow-up.svg' : '/images/arrow-down.svg'}
          alt={open ? 'Fermer la liste' : 'Ouvrir la liste'}
          width={12}
          height={8}
          className={styles.chevron}
        />
      </button>

      {open && (
        <div className={styles.dropdownPanel}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <ul className={styles.tagList}>
            {/* D'abord les tags sélectionnés, en jaune, avec croix */}
            {filteredSelected.map((item) => (
              <li key={`sel-${item}`}>
                <button
                  type="button"
                  className={`${styles.tagItem} ${styles.tagItemSelected}`}
                  onClick={() => handleRemove(item)}
                >
                  <span>{formatTagLabel(item)}</span>
                  <span className={styles.chipClose}>×</span>
                </button>
              </li>
            ))}

            {/* Puis les tags disponibles à sélectionner */}
            {filteredAvailable.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className={styles.tagItem}
                  onClick={() => handleSelect(item)}
                >
                  {formatTagLabel(item)}
                </button>
              </li>
            ))}

            {filteredSelected.length === 0 &&
              filteredAvailable.length === 0 && (
                <li className={styles.empty}>Aucun résultat</li>
              )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TagFilters({
  recipes,
  selectedTags,
  onAddTag,
  onRemoveTag,
  currentCount,
}: TagFiltersProps) {
  const hasSelected =
    selectedTags.ingredients.length > 0 ||
    selectedTags.appliances.length > 0 ||
    selectedTags.ustensils.length > 0;

  // tous les tags possibles à partir des recettes
  const allIngredients = useMemo(
    () =>
      getUniqueTags(recipes, (r) =>
        r.ingredients.map((i) => i.ingredient)
      ),
    [recipes]
  );

  const allAppliances = useMemo(
    () => getUniqueTags(recipes, (r) => [r.appliance]),
    [recipes]
  );

  const allUstensils = useMemo(
    () => getUniqueTags(recipes, (r) => r.ustensils),
    [recipes]
  );

  function formatTagLabel(value: string) {
    const lower = value.toLocaleLowerCase('fr-FR');
    return lower.charAt(0).toLocaleUpperCase('fr-FR') + lower.slice(1);
  }

  return (
    <section className={styles.wrapper}>
      <div className={styles.bar}>
        <div className={styles.filters}>
          <TagDropdown
            label="Ingrédients"
            placeholder="Rechercher un ingrédient"
            items={allIngredients}
            selected={selectedTags.ingredients}
            onSelect={(value) => onAddTag('ingredients', value)}
            onRemove={(value) => onRemoveTag('ingredients', value)}
          />
          <TagDropdown
            label="Appareils"
            placeholder="Rechercher un appareil"
            items={allAppliances}
            selected={selectedTags.appliances}
            onSelect={(value) => onAddTag('appliances', value)}
            onRemove={(value) => onRemoveTag('appliances', value)}
          />
          <TagDropdown
            label="Ustensiles"
            placeholder="Rechercher un ustensile"
            items={allUstensils}
            selected={selectedTags.ustensils}
            onSelect={(value) => onAddTag('ustensils', value)}
            onRemove={(value) => onRemoveTag('ustensils', value)}
          />
        </div>

        <span className={styles.count}>
          {currentCount} recette{currentCount > 1 ? 's' : ''}
        </span>
      </div>

      {/* Affichage des chips en bas, synchro avec les listes */}
      {hasSelected && (
        <div className={styles.selectedRow}>
          {selectedTags.ingredients.map((tag) => (
            <button
              key={`ing-${tag}`}
              type="button"
              className={styles.chip}
              onClick={() => onRemoveTag('ingredients', tag)}
            >
              {formatTagLabel(tag)}
              <span className={styles.chipClose}>×</span>
            </button>
          ))}

          {selectedTags.appliances.map((tag) => (
            <button
              key={`app-${tag}`}
              type="button"
              className={styles.chip}
              onClick={() => onRemoveTag('appliances', tag)}
            >
              {formatTagLabel(tag)}
              <span className={styles.chipClose}>×</span>
            </button>
          ))}

          {selectedTags.ustensils.map((tag) => (
            <button
              key={`ust-${tag}`}
              type="button"
              className={styles.chip}
              onClick={() => onRemoveTag('ustensils', tag)}
            >
              {formatTagLabel(tag)}
              <span className={styles.chipClose}>×</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
