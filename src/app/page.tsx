'use client';

import { useState, useRef } from 'react';
import styles from './page.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TagFilters, { SelectedTags } from '@/components/TagFilters';
import RecipeList from '@/components/RecipeList';
import type { Recipe } from '@/components/RecipeCard';
import recipesData from '@/data/recipes.json';

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function applyFilters(recipes: Recipe[], searchQuery: string, selectedTags: SelectedTags): Recipe[] {
  const normQuery = normalizeSearch(searchQuery);

  return recipes.filter((recipe) => {
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

    if (
      selectedTags.ingredients.length > 0 &&
      !selectedTags.ingredients.every((tag) =>
        recipe.ingredients.some((i) => normalizeSearch(i.ingredient) === normalizeSearch(tag))
      )
    ) {
      return false;
    }

    if (
      selectedTags.appliances.length > 0 &&
      !selectedTags.appliances.some(
        (tag) => normalizeSearch(tag) === normalizeSearch(recipe.appliance)
      )
    ) {
      return false;
    }

    if (
      selectedTags.ustensils.length > 0 &&
      !selectedTags.ustensils.every((tag) =>
        recipe.ustensils.some((u) => normalizeSearch(u) === normalizeSearch(tag))
      )
    ) {
      return false;
    }

    return true;
  });
}

const INITIAL_TAGS: SelectedTags = {
  ingredients: [],
  appliances: [],
  ustensils: [],
};

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const selectedTagsRef = useRef<SelectedTags>(INITIAL_TAGS);

  // ✅ Ici on n’accède PAS au ref pendant le render
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(
    () => applyFilters(recipesData as Recipe[], '', INITIAL_TAGS)
  );

  function handleSearch(value: string) {
    setSearchQuery(value);
    setFilteredRecipes(applyFilters(recipesData as Recipe[], value, selectedTagsRef.current));
  }

  function handleSelectedTagsChange(tags: SelectedTags) {
    selectedTagsRef.current = tags; // ✅ OK: dans un handler
    setFilteredRecipes(applyFilters(recipesData as Recipe[], searchQuery, tags));
  }

  function handleClearSearch() {
    setSearchQuery('');
    setFilteredRecipes(applyFilters(recipesData as Recipe[], '', selectedTagsRef.current));
  }

  return (
    <div>
      <main>
        <Header onSearch={handleSearch} />
        <section className={styles.section}>
          <div id="test" className={styles.content}>
            <TagFilters
              recipes={filteredRecipes}
              currentCount={filteredRecipes.length}
              searchQuery={searchQuery}
              onClearSearch={handleClearSearch}
              onSelectedTagsChange={handleSelectedTagsChange}
            />

            {filteredRecipes.length === 0 ? (
              <p className={styles.noResult}>
                Aucune recette ne contient « {searchQuery} ». Vous pouvez chercher « tarte aux pommes », « poisson », etc.
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