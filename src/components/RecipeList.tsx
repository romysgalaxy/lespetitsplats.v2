import recipesData from '@/data/recipes.json';
import RecipeCard, { Recipe } from './RecipeCard';
import styles from './RecipeList.module.css';

const recipes = recipesData as Recipe[];

export default function RecipeList() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {recipes.slice(0, 10).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}