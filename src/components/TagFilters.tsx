'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './TagFilters.module.css';
import type { Recipe } from './RecipeCard';

export type TagCategory = 'ingredients' | 'appliances' | 'ustensils';

export interface SelectedTags {
  ingredients: string[];
  appliances: string[];
  ustensils: string[];
}

interface TagFiltersProps {
  recipes: Recipe[]; // recettes actuellement disponibles (déjà filtrées)
  currentCount: number;
  searchQuery: string;
  onClearSearch: () => void;

  // le parent est notifié quand la sélection change
  onSelectedTagsChange: (tags: SelectedTags) => void;
}

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function formatTagLabel(value: string) {
  const lower = value.toLocaleLowerCase('fr-FR');
  return lower.charAt(0).toLocaleUpperCase('fr-FR') + lower.slice(1);
}

function getUniqueTags(recipes: Recipe[], getter: (recipe: Recipe) => string[]): string[] {
  const map = new Map<string, string>();

  recipes.forEach((recipe) => {
    getter(recipe).forEach((raw) => {
      const norm = normalize(raw);

      if (norm.endsWith('s')) {
        const singular = norm.slice(0, -1);
        if (map.has(singular)) return;
      } else {
        const plural = norm + 's';
        if (map.has(plural)) map.delete(plural);
      }

      if (!map.has(norm)) map.set(norm, raw);
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
  selected: string[];
  onSelect: (value: string) => void;
  onRemove: (value: string) => void;
}

function TagDropdown({ label, placeholder, items, selected, onSelect, onRemove }: TagDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const normQuery = normalize(query);

  const filteredSelected = useMemo(
    () => selected.filter((item) => normalize(item).includes(normQuery)),
    [selected, normQuery]
  );

  const filteredAvailable = useMemo(
    () =>
      items
        .filter((item) => !selected.includes(item))
        .filter((item) => normalize(item).includes(normQuery)),
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

            {filteredSelected.length === 0 && filteredAvailable.length === 0 && (
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
  currentCount,
  searchQuery,
  onClearSearch,
  onSelectedTagsChange,
}: TagFiltersProps) {
  const [selectedTags, setSelectedTags] = useState<SelectedTags>({
    ingredients: [],
    appliances: [],
    ustensils: [],
  });
  useEffect(() => {
  onSelectedTagsChange(selectedTags);
}, [selectedTags, onSelectedTagsChange]);


function addTag(type: TagCategory, value: string) {
  setSelectedTags((prev) => {
    if (prev[type].includes(value)) return prev;
    return { ...prev, [type]: [...prev[type], value] };
  });
}

function removeTag(type: TagCategory, value: string) {
  setSelectedTags((prev) => ({
    ...prev,
    [type]: prev[type].filter((t) => t !== value),
  }));
}


  const hasSelected =
    searchQuery.trim().length >= 3 ||
    selectedTags.ingredients.length > 0 ||
    selectedTags.appliances.length > 0 ||
    selectedTags.ustensils.length > 0;

  const allIngredients = useMemo(
    () => getUniqueTags(recipes, (r) => r.ingredients.map((i) => i.ingredient)),
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

  return (
    <section className={styles.wrapper}>
      <div className={styles.bar}>
        <div className={styles.filters}>
          <TagDropdown
            label="Ingrédients"
            placeholder="Rechercher un ingrédient"
            items={allIngredients}
            selected={selectedTags.ingredients}
            onSelect={(value) => addTag('ingredients', value)}
            onRemove={(value) => removeTag('ingredients', value)}
          />

          <TagDropdown
            label="Appareils"
            placeholder="Rechercher un appareil"
            items={allAppliances}
            selected={selectedTags.appliances}
            onSelect={(value) => addTag('appliances', value)}
            onRemove={(value) => removeTag('appliances', value)}
          />

          <TagDropdown
            label="Ustensiles"
            placeholder="Rechercher un ustensile"
            items={allUstensils}
            selected={selectedTags.ustensils}
            onSelect={(value) => addTag('ustensils', value)}
            onRemove={(value) => removeTag('ustensils', value)}
          />
        </div>

        <span className={styles.count}>
          {currentCount} recette{currentCount > 1 ? 's' : ''}
        </span>
      </div>

      {hasSelected && (
        <div className={styles.selectedRow}>
          {searchQuery.trim().length >= 3 && (
            <button
              type="button"
              className={`${styles.chip} ${styles.chipSearch}`}
              onClick={onClearSearch}
            >
              {formatTagLabel(searchQuery)}
              <span className={styles.chipClose}>×</span>
            </button>
          )}

          {selectedTags.ingredients.map((tag) => (
            <button
              key={`ing-${tag}`}
              type="button"
              className={styles.chip}
              onClick={() => removeTag('ingredients', tag)}
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
              onClick={() => removeTag('appliances', tag)}
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
              onClick={() => removeTag('ustensils', tag)}
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