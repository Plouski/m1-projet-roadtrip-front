import React from 'react';
import Logo from "../../UI/Logo";
import LogoImage from "../../../../public/logo-png.png";
import styles from './index.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <Logo image={LogoImage.src} />
        <p>Inès GERVAIS</p>
      </div>
      <div className={styles.copy}>
        &copy; {new Date().getFullYear()} ROADTRIP! . All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
