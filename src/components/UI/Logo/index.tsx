import styles from "./index.module.scss";

const Index = ({image}) => {
    return (
        <div className={styles.logo_container}>
            <a href="/">
            <img src={image} alt="Logo" className={styles.logo_image}/>

            </a>
        </div>
    );
}

export default Index;
