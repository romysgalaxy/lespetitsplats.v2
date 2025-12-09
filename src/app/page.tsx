'use client';

import { useMemo, useState } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import RecipeList from '@/components/RecipeList';
import TagFilters, {
  SelectedTags,
  TagCategory,
} from '@/components/TagFilters';

import recipesData from '@/data/recipes.json';
import type { Recipe } from '@/components/RecipeCard';

const allRecipes = recipesData as Recipe[];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function filterRecipes(recipes: Recipe[], selected: SelectedTags): Recipe[] {
  const ing = selected.ingredients.map(normalize);
  const app = selected.appliances.map(normalize);
  const ust = selected.ustensils.map(normalize);

  return recipes.filter((recipe) => {
    const recipeIng = recipe.ingredients.map((i) =>
      normalize(i.ingredient)
    );
    const recipeApp = normalize(recipe.appliance);
    const recipeUst = recipe.ustensils.map(normalize);

    const matchIng = ing.every((tag) => recipeIng.includes(tag));
    const matchApp =
      app.length === 0 || app.includes(recipeApp);
    const matchUst = ust.every((tag) => recipeUst.includes(tag));

    return matchIng && matchApp && matchUst;
  });
}

export default function Home() {
  const [selectedTags, setSelectedTags] = useState<SelectedTags>({
    ingredients: [],
    appliances: [],
    ustensils: [],
  });

  const filteredRecipes = useMemo(
    () => filterRecipes(allRecipes, selectedTags),
    [selectedTags]
  );

  function handleAddTag(type: TagCategory, value: string) {
    setSelectedTags((prev) => {
      if (prev[type].includes(value)) return prev;
      return { ...prev, [type]: [...prev[type], value] };
    });
  }

  function handleRemoveTag(type: TagCategory, value: string) {
    setSelectedTags((prev) => ({
      ...prev,
      [type]: prev[type].filter((t) => t !== value),
    }));
  }

  return (
    <div>
      <main>
        <Header />
         <section className="recipesWrapper">
          <TagFilters
          recipes={filteredRecipes}
          selectedTags={selectedTags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          currentCount={filteredRecipes.length}
        />
        <RecipeList recipes={filteredRecipes} />
         </section>
        <Footer />
      </main>
    </div>
  );
}
