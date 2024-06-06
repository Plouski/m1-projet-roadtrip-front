import { useEffect, useState } from "react";
import TitleMain from "../../../components/UI/TitleMain";
import SubTitle from "../../../components/UI/SubTitle";
import styles from "./index.module.scss";

const Hero = ({ subtitle, title, image }) => {

    const [heroHeight, setHeroHeight] = useState(0);

    const adjustSize = () => { 
        const windowHeight = window.innerHeight;
        const headerHeight = document.querySelector("header").offsetHeight;
        setHeroHeight(windowHeight - headerHeight);
    }

    useEffect(() => {

        adjustSize();
        
        window.addEventListener("resize", adjustSize);

        return () => {
            window.removeEventListener("resize", adjustSize);
        };

    }, []);

    return (
        <div className={styles.wrapper} style={{ height: `${heroHeight}px` }}>
            <div className={styles.overlay}></div>
            <div className={styles.frame}>
                <img src={image} alt="Accueil" />
            </div>
            <div className={styles.content}>
                <SubTitle text={subtitle}/>
                <TitleMain title={title}/>
            </div>
        </div>
    );
}

export default Hero;
