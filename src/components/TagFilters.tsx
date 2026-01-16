'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './TagFilters.module.css';
import type { Recipe } from './RecipeCard';

// Catégories de tags possibles
export type TagCategory = 'ingredients' | 'appliances' | 'ustensils';

// Structure des tags sélectionnés
export interface SelectedTags {
  ingredients: string[];
  appliances: string[];
  ustensils: string[];
}

interface TagFiltersProps {
  recipes: Recipe[]; // recettes filtrées
  currentCount: number;
  searchQuery: string;
  onClearSearch: () => void;
  onSelectedTagsChange: (tags: SelectedTags) => void;
}

// Normalise un texte simple
function normalize(value: string) {
  return value.toLowerCase().trim();
}

// Met en forme un tag pour l'affichage
function formatTagLabel(value: string) {
  const lower = value.toLocaleLowerCase('fr-FR');
  return lower.charAt(0).toLocaleUpperCase('fr-FR') + lower.slice(1);
}

// Récupère une liste de tags uniques à partir des recettes
function getUniqueTags(
  recipes: Recipe[],
  getter: (recipe: Recipe) => string[]
): string[] {
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

// Dropdown pour une catégorie de tags
function TagDropdown({
  label,
  placeholder,
  items,
  selected,
  onSelect,
  onRemove,
}: TagDropdownProps) {
  const [open, setOpen] = useState(false); // ouverture du menu
  const [query, setQuery] = useState(''); // recherche interne

  const normQuery = normalize(query);

  // Tags sélectionnés filtrés
  const filteredSelected = useMemo(
    () => selected.filter((item) => normalize(item).includes(normQuery)),
    [selected, normQuery]
  );

  // Tags disponibles filtrés
  const filteredAvailable = useMemo(
    () =>
      items
        .filter((item) => !selected.includes(item))
        .filter((item) => normalize(item).includes(normQuery)),
    [items, selected, normQuery]
  );

  // Ajoute un tag
  function handleSelect(value: string) {
    onSelect(value);
    setQuery('');
  }

  // Supprime un tag
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
          alt=""
          width={12}
          height={8}
        />
      </button>

      {open && (
        <div className={styles.dropdownPanel}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <ul className={styles.tagList}>
            {filteredSelected.map((item) => (
              <li key={`sel-${item}`}>
                {/* <button onClick={() => handleRemove(item)}>
                  {formatTagLabel(item)} ×
                </button> */}
                <button
                  type="button"
                  className={`${styles.tagItem} ${styles.tagItemSelected}`}
                  onClick={() => handleRemove(item)}
                >
                  {formatTagLabel(item)}
                  <span className={styles.chipClose}>×</span>
                </button>
              </li>
            ))}

            {filteredAvailable.map((item) => (
              <li key={item}>
                {/* <button onClick={() => handleSelect(item)}>
                  {formatTagLabel(item)}
                </button> */}
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
              filteredAvailable.length === 0 && <li>Aucun résultat</li>}
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
  // Tags sélectionnés
  const [selectedTags, setSelectedTags] = useState<SelectedTags>({
    ingredients: [],
    appliances: [],
    ustensils: [],
  });

  // Informe le parent à chaque changement
  useEffect(() => {
    onSelectedTagsChange(selectedTags);
  }, [selectedTags, onSelectedTagsChange]);

  // Ajoute un tag
  function addTag(type: TagCategory, value: string) {
    setSelectedTags((prev) =>
      prev[type].includes(value)
        ? prev
        : { ...prev, [type]: [...prev[type], value] }
    );
  }

  // Supprime un tag
  function removeTag(type: TagCategory, value: string) {
    setSelectedTags((prev) => ({
      ...prev,
      [type]: prev[type].filter((t) => t !== value),
    }));
  }

  // Indique si au moins un filtre est actif
  const hasSelected =
    searchQuery.trim().length >= 3 ||
    selectedTags.ingredients.length > 0 ||
    selectedTags.appliances.length > 0 ||
    selectedTags.ustensils.length > 0;

  // Listes de tags possibles
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
      {/* Filtres */}
      <div className={styles.bar}>
        <div className={styles.filters}>
          <TagDropdown
            label="Ingrédients"
            placeholder="Rechercher un ingrédient"
            items={allIngredients}
            selected={selectedTags.ingredients}
            onSelect={(v) => addTag('ingredients', v)}
            onRemove={(v) => removeTag('ingredients', v)}
          />

          <TagDropdown
            label="Appareils"
            placeholder="Rechercher un appareil"
            items={allAppliances}
            selected={selectedTags.appliances}
            onSelect={(v) => addTag('appliances', v)}
            onRemove={(v) => removeTag('appliances', v)}
          />

          <TagDropdown
            label="Ustensiles"
            placeholder="Rechercher un ustensile"
            items={allUstensils}
            selected={selectedTags.ustensils}
            onSelect={(v) => addTag('ustensils', v)}
            onRemove={(v) => removeTag('ustensils', v)}
          />
        </div>

        {/* <span>{currentCount} recette{currentCount > 1 ? 's' : ''}</span> */}
        <span className={styles.count}>
          {currentCount} recette{currentCount > 1 ? 's' : ''}
        </span>

      </div>

      {/* Tags actifs */}
      {/* {hasSelected && (
        <div className={styles.selectedRow}>
          {searchQuery.trim().length >= 3 && (
            <button onClick={onClearSearch}>
              {formatTagLabel(searchQuery)} ×
            </button>
          )}
        </div>
      )} */}
      {/* {hasSelected && (
        <div className={styles.selectedRow}>
          {searchQuery.trim().length >= 3 && (
            <button type="button" className={styles.chip} onClick={onClearSearch}>
              {formatTagLabel(searchQuery)}
              <span className={styles.chipClose}>×</span>
            </button>
          )}
        </div>
      )} */}
      {hasSelected && (
        <div className={styles.selectedRow}>
          {/* Chip de recherche */}
          {searchQuery.trim().length >= 3 && (
            <button type="button" className={styles.chip} onClick={onClearSearch}>
              {formatTagLabel(searchQuery)}
              <span className={styles.chipClose}>×</span>
            </button>
          )}

          {/* Chips ingrédients */}
          {selectedTags.ingredients.map((tag) => (
            <button
              key={`chip-ing-${tag}`}
              type="button"
              className={styles.chip}
              onClick={() => removeTag('ingredients', tag)}
            >
              {formatTagLabel(tag)}
              <span className={styles.chipClose}>×</span>
            </button>
          ))}

          {/* Chips appareils */}
          {selectedTags.appliances.map((tag) => (
            <button
              key={`chip-app-${tag}`}
              type="button"
              className={styles.chip}
              onClick={() => removeTag('appliances', tag)}
            >
              {formatTagLabel(tag)}
              <span className={styles.chipClose}>×</span>
            </button>
          ))}

          {/* Chips ustensiles */}
          {selectedTags.ustensils.map((tag) => (
            <button
              key={`chip-ust-${tag}`}
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