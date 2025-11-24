import Image from 'next/image';
import styles from './Header.module.css';
import SearchBar from './SearchBar';

interface HeaderProps {
  /** 
   * false (ou rien) = header complet avec titre + search
   * true = version compacte (logo seul, header ≈ 120px)
   */
  compact?: boolean;
}

export default function Header({ compact = false }: HeaderProps) {
  return (
    <header
      className={`${styles.header} ${compact ? styles.compact : ''}`}
    >
      {/* Image de fond */}
      <Image
        src="/images/header.jpg"
        alt="Bol de nouilles et légumes"
        fill
        priority
        className={styles.backgroundImage}
      />
      <div className={styles.overlay} />

      {/* Contenu par-dessus l'image */}
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <Image
            src="/images/logo.svg"
            alt="Les Petits Plats"
            width={180}
            height={40}
            className={styles.logo}
          />
        </div>

        {!compact && (
          <div className={styles.hero}>
            <h1 className={styles.title}>
              DÉCOUVREZ NOS RECETTES
              <br />
              DU QUOTIDIEN, SIMPLES ET DÉLICIEUSES
            </h1>

            <SearchBar />
          </div>
        )}
      </div>
    </header>
  );
}