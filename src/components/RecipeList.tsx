import styles from './RecipeList.module.css';
import RecipeCard, { Recipe } from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {recipes.slice(0, 50).map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}