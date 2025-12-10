'use client';

import { useMemo, useState } from 'react';
import styles from './page.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TagFilters, { SelectedTags, TagCategory } from '@/components/TagFilters';
import RecipeList from '@/components/RecipeList';
import type { Recipe } from '@/components/RecipeCard';
import recipesData from '@/data/recipes.json';

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // supprime les accents
    .toLowerCase()
    .trim();
}

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<SelectedTags>({
    ingredients: [],
    appliances: [],
    ustensils: [],
  });

  function handleAddTag(type: TagCategory, value: string) {
    setSelectedTags((prev) => {
      if (prev[type].includes(value)) return prev;
      return {
        ...prev,
        [type]: [...prev[type], value],
      };
    });
  }

  function handleRemoveTag(type: TagCategory, value: string) {
    setSelectedTags((prev) => ({
      ...prev,
      [type]: prev[type].filter((t) => t !== value),
    }));
  }

  function handleClearSearch() {
    setSearchQuery('');
  }

  const filteredRecipes: Recipe[] = useMemo(() => {
    const normQuery = normalizeSearch(searchQuery);

    return recipesData.filter((recipe) => {
      // 1) recherche principale (>= 3 caractères)
      if (normQuery.length >= 3) {
        const haystack = [
          recipe.name,
          recipe.description,
          recipe.appliance,
          recipe.ustensils.join(' '),
          recipe.ingredients.map((i) => i.ingredient).join(' '),
        ].join(' ');

        const normHaystack = normalizeSearch(haystack);

        if (!normHaystack.includes(normQuery)) {
          return false;
        }
      }

      // 2) filtres ingrédients
      if (
        selectedTags.ingredients.length > 0 &&
        !selectedTags.ingredients.every((tag) =>
          recipe.ingredients.some(
            (i) =>
              normalizeSearch(i.ingredient) === normalizeSearch(tag)
          )
        )
      ) {
        return false;
      }

      // 3) filtres appareils
      if (
        selectedTags.appliances.length > 0 &&
        !selectedTags.appliances.some(
          (tag) =>
            normalizeSearch(tag) === normalizeSearch(recipe.appliance)
        )
      ) {
        return false;
      }

      // 4) filtres ustensiles
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
  }, [searchQuery, selectedTags]);

  return (
    <div>
      <main>
        {/* 🔥 on passe la callback au Header */}
        <Header onSearch={setSearchQuery} />

        <section className={styles.section}>
          <div id="test" className={styles.content}>
            <TagFilters
              recipes={filteredRecipes}
              selectedTags={selectedTags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              currentCount={filteredRecipes.length}
              searchQuery={searchQuery}
              onClearSearch={handleClearSearch}
            />

            {/* <RecipeList recipes={filteredRecipes} /> */}
            {filteredRecipes.length === 0 ? (
              <p className={styles.noResult}>
                Aucune recette ne contient « {searchQuery} ». Vous pouvez chercher
                « tarte aux pommes », « poisson », etc.
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
