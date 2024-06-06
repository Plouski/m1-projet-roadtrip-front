import styles from "./index.module.scss";

const Index = ({ text }) => {
    return (
        <div className={`${styles.wrapper}`}>
            {text}
        </div>
    );
}

export default Index;
