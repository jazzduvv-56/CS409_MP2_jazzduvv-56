import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          🚀 NASA Explorer
        </Link>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link
              to="/"
              className={`${styles.navLink} ${
                isActive('/') ? styles.active : ''
              }`}
            >
              List View
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link
              to="/gallery"
              className={`${styles.navLink} ${
                isActive('/gallery') ? styles.active : ''
              }`}
            >
              Gallery
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
