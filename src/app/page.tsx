'use client';

import { useState, useRef } from 'react';
import styles from './page.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TagFilters, { SelectedTags } from '@/components/TagFilters';
import RecipeList from '@/components/RecipeList';
import type { Recipe } from '@/components/RecipeCard';
import recipesData from '@/data/recipes.json';

// Nettoie une chaîne pour la recherche (minuscules, sans accents)
function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

// Applique la recherche texte + les tags sur les recettes
function applyFilters(
  recipes: Recipe[],
  searchQuery: string,
  selectedTags: SelectedTags
): Recipe[] {
  const normQuery = normalizeSearch(searchQuery);

  return recipes.filter((recipe) => {
    // Recherche globale dans les champs de la recette
    if (normQuery.length >= 3) {
      const haystack = [
        recipe.name,
        recipe.description,
        recipe.appliance,
        recipe.ustensils.join(' '),
        recipe.ingredients.map((i) => i.ingredient).join(' '),
      ].join(' ');

      if (!normalizeSearch(haystack).includes(normQuery)) return false;
    }

    // Filtre par ingrédients
    if (
      selectedTags.ingredients.length > 0 &&
      !selectedTags.ingredients.every((tag) =>
        recipe.ingredients.some(
          (i) => normalizeSearch(i.ingredient) === normalizeSearch(tag)
        )
      )
    ) {
      return false;
    }

    // Filtre par appareils
    if (
      selectedTags.appliances.length > 0 &&
      !selectedTags.appliances.some(
        (tag) => normalizeSearch(tag) === normalizeSearch(recipe.appliance)
      )
    ) {
      return false;
    }

    // Filtre par ustensiles
    if (
      selectedTags.ustensils.length > 0 &&
      !selectedTags.ustensils.every((tag) =>
        recipe.ustensils.some(
          (u) => normalizeSearch(u) === normalizeSearch(tag)
        )
      )
    ) {
      return false;
    }

    return true;
  });
}

// Valeur initiale des tags
const INITIAL_TAGS: SelectedTags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

export default function Page() {
  // Texte de recherche
  const [searchQuery, setSearchQuery] = useState('');

  // Tags sélectionnés (sans provoquer de re-render)
  const selectedTagsRef = useRef<SelectedTags>(INITIAL_TAGS);

  // Recettes affichées
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(
    () => applyFilters(recipesData as Recipe[], '', INITIAL_TAGS)
  );

  // Mise à jour lors de la recherche
  function handleSearch(value: string) {
    setSearchQuery(value);
    setFilteredRecipes(
      applyFilters(recipesData as Recipe[], value, selectedTagsRef.current)
    );
  }

  // Mise à jour lors du changement de tags
  function handleSelectedTagsChange(tags: SelectedTags) {
    selectedTagsRef.current = tags;
    setFilteredRecipes(
      applyFilters(recipesData as Recipe[], searchQuery, tags)
    );
  }

  // Réinitialise la recherche
  function handleClearSearch() {
    setSearchQuery('');
    setFilteredRecipes(
      applyFilters(recipesData as Recipe[], '', selectedTagsRef.current)
    );
  }

  return (
    <div>
      <main>
        <Header onSearch={handleSearch} />

        <section className={styles.section}>
          <div className={styles.content}>
            <TagFilters
              recipes={filteredRecipes}
              currentCount={filteredRecipes.length}
              searchQuery={searchQuery}
              onClearSearch={handleClearSearch}
              onSelectedTagsChange={handleSelectedTagsChange}
            />

            {filteredRecipes.length === 0 ? (
              <p className={styles.noResult}>
                Aucune recette ne contient « {searchQuery} ».
              </p>
            ) : (
              <RecipeList recipes={filteredRecipes} />
            )}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}