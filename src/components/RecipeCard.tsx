import Image from 'next/image';
import styles from './RecipeCard.module.css';

export interface Ingredient {
  ingredient: string;
  quantity?: number;
  unit?: string;
}

export interface Recipe {
  id: number;
  image: string;
  name: string;
  slug: string;
  servings: number;
  ingredients: Ingredient[];
  time: number;
  description: string;
  appliance: string;
  ustensils: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className={styles.card}>
      {/* IMAGE + badge temps */}
      <div className={styles.imageWrapper}>
        <Image
          src={`/recipes/${recipe.image}`} // adapte le chemin si besoin
          alt={recipe.name}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 768px) 33vw, 100vw"
          className={styles.image}
        />

        <div className={styles.timeBadge}>
          <span>{recipe.time}min</span>
        </div>
      </div>

      {/* CONTENU */}
      <div className={styles.content}>
        <h2 className={styles.title}>{recipe.name}</h2>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Recette</p>
          <p className={styles.description}>{recipe.description}</p>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>Ingrédients</p>

          <div className={styles.ingredientsGrid}>
            {recipe.ingredients.map((item, index) => (
              <div className={styles.ingredient} key={index}>
                <span className={styles.ingredientName}>
                  {item.ingredient}
                </span>

                {(item.quantity !== undefined || item.unit) && (
                  <span className={styles.ingredientQuantity}>
                    {item.quantity !== undefined ? item.quantity : ''}
                    {item.unit ? ` ${item.unit}` : ''}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}