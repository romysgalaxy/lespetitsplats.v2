import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './RecipeDetail.module.css';
import recipesData from '@/data/recipes.json';
import type { Recipe } from '@/components/RecipeCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const recipes = recipesData as Recipe[];

// on peut laisser ça comme avant (optionnellement async)
export function generateStaticParams() {
  return recipes.slice(0, 50).map((recipe) => ({
    slug: recipe.slug,
  }));
}

// 👇 ICI la différence : params est une Promise et on attend dessus
export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // on "unwrap" la Promise

  const recipe = recipes.find((r) => r.slug === slug);

  if (!recipe) {
    notFound();
  }

  return (
    <>
     <Header compact={true} />
    <main className={styles.page}>
      <div className={styles.inner}>
        {/* Colonne image */}
        <div className={styles.imageWrapper}>
          <Image
            src={`/recipes/${recipe.image}`}
            alt={recipe.name}
            fill
            sizes="(min-width: 1024px) 540px, (min-width: 768px) 50vw, 100vw"
            className={styles.image}
          />
        </div>

        {/* Colonne texte */}
        <div className={styles.content}>
          <h1 className={styles.title}>{recipe.name}</h1>

          <section className={styles.block}>
            <p className={styles.label}>Temps de préparation</p>
            <div className={styles.timeBadge}>
              <span>{recipe.time}min</span>
            </div>
          </section>

          <section className={styles.block}>
            <p className={styles.label}>Ingrédients</p>
            <div className={styles.ingredientsGrid}>
              {recipe.ingredients.map((item, index) => (
                <div key={index} className={styles.ingredientRow}>
                  <span className={styles.ingredientName}>
                    {item.ingredient}
                  </span>
                  <span className={styles.ingredientQuantity}>
                    {item.quantity !== undefined ? item.quantity : ''}
                    {item.unit ? ` ${item.unit}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.block}>
            <p className={styles.label}>Ustensiles nécessaires</p>
            <ul className={styles.simpleList}>
              {recipe.ustensils.map((ustensil) => (
                <li key={ustensil}>
                  <span className={styles.bold}>{ustensil}</span>
                  <span className={styles.muted}> 1</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.block}>
            <p className={styles.label}>Appareils nécessaires</p>
            <ul className={styles.simpleList}>
              <li>
                <span className={styles.bold}>{recipe.appliance}</span>
                <span className={styles.muted}> 1</span>
              </li>
            </ul>
          </section>

          <section className={styles.block}>
            <p className={styles.label}>Recette</p>
            <p className={styles.description}>{recipe.description}</p>
          </section>
        </div>
      </div>
    </main>
    <Footer />
    </>
         
  );
}
