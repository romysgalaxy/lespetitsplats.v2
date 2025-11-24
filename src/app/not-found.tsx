import Image from 'next/image';
import styles from './not-found.module.css';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
    <main className={styles.container}>
      {/* Image de fond */}
      <Image
        src="/images/header.jpg"
        alt="Bol de nouilles et légumes"
        fill
        priority
        className={styles.background}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        {/* Logo en haut à gauche */}
        <div className={styles.logo}>
          <Image
            src="/images/logo.svg"
            alt="Les Petits Plats"
            width={180}
            height={40}
            className={styles.logoImage}
          />
        </div>

        {/* Texte centré */}
        <div className={styles.center}>
          <h1 className={styles.code}>404 :(</h1>
          <p className={styles.text}>
            La page que vous demandez est introuvable.
          </p>
        </div>
      </div>
    </main>
    <Footer />
    </>
    
  );
}
