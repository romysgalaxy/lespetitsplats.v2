import Footer from "@/components/Footer";
import Header from "@/components/Header";
import RecipeList from "@/components/RecipeList";
// import styles from "./page.module.css";

export default function Home() {
  return (
    // <div className={styles.page}>
    //   <main className={styles.main}>
    <div>
      <main>
       <Header />
       <RecipeList />
       <Footer />
      </main>
    </div>
  );
}
