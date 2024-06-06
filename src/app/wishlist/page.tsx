'use client'
import { useContext } from 'react';
import WishlistContext from '../../context/WishlistContext';
import PostItem from '../../components/UI/PostItem';
import Title from "../../components/UI/Title";

import styles from './index.module.scss';

const WishlistPage = () => {
  const { roadtrips } = useContext(WishlistContext);

  return (
    <div className={styles.container}>
      <Title title="Wishlist" level={1} color="secondary" alignment="left"/>
      <div className={styles.postContainer}>
        {roadtrips.length > 0 ? (
          roadtrips.map((roadtrip, index) => (
            <PostItem key={index} roadtrip={roadtrip} position={index} />
          ))
        ) : (
          <p>Votre wishlist est vide.</p>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
