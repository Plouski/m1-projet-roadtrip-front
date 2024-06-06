import styles from "./index.module.scss";

const Index = ({title}) => {
    return (
        <div className={`${styles.wrapper}`}>
            {title}
        </div>
    );
}

export default Index;
