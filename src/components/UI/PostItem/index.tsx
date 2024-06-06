import React from 'react';
import Link from "next/link";
import styles from './index.module.scss';
import { Roadtrip } from "../../../interfaces";
import { useContext } from "react";
import WishlistContext from "../../../context/WishlistContext";
import Title from "../Title";

interface Iprops {
    position: number;
    roadtrip: Roadtrip;
}

const PostItem: React.FC<Iprops> = ({ roadtrip, position }) => {
    const { roadtrips, addRoadtrip, removeRoadtrip } = useContext(WishlistContext);
    const isRoadtripInWishlist = roadtrips.some(item => item.id === roadtrip.id);

    const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (isRoadtripInWishlist) {
            removeRoadtrip(roadtrip);
        } else {
            addRoadtrip(roadtrip);
        }
    };

    return (
        <Link href={`/roadtrip/${roadtrip.id}`}>
            <div className={styles.item}>
                <div className={styles.actions}>
                    <h3>{(position + 1).toString().padStart(2, "0")}</h3>
                    <button
                        className={`${styles.wishlist} ${isRoadtripInWishlist ? styles.active : ''}`}
                        onClick={handleWishlistClick}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 20.7846L10.677 19.6194C5.216 15.0755 2 12.0325 2 8.49846C2 5.46746 4.42 3.03746 7.3 3.03746C9.02 3.03746 10.81 4.06346 12 5.68446C13.19 4.06246 14.98 3.03746 16.7 3.03746C19.58 3.03746 22 5.46746 22 8.49846C22 12.0325 18.784 15.0755 13.323 19.6194L12 20.7846Z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={isRoadtripInWishlist ? "red" : "none"} />
                        </svg>
                    </button>
                </div>
                <div className={styles.content}>
                    <Title title={roadtrip.title} level={2} color="primary" />
                    <p>{roadtrip.duration} jours</p>
                    <p>{roadtrip.description}</p>
                </div>
            </div>
        </Link>
    );
}

export default PostItem;
