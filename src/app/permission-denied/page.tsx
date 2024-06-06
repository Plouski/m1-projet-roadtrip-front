'use client'
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./index.module.scss";
import Title from "../../components/UI/Title";
import Button from "../../components/UI/Button";

const PermissionDeniedPage = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.push("/");
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
            <Title title='Permission refusée' level={1} color="primary" />
                <p>Vous ne disposez pas des autorisations nécessaires pour accéder à cette page.</p>
                <Button text="Retour à l'accueil" color="secondary" handleClick={handleGoBack}/>
            </div>
        </div>
    );
};

export default PermissionDeniedPage;
