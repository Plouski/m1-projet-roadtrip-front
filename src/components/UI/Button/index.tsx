import styles from './index.module.scss';

interface IProps {
    handleClick?: () => void;
    text: string;
    color: string;
    type?: "submit" | "button" | "reset";
    href?: string;
}

const Index = ({ handleClick, text, color, type, href }: IProps) => {
    return (
        <div className={styles.wrapper}>
            {href ? (
                <a href={href} className={`${styles.btn} ${styles[color]}`} onClick={handleClick}>
                    {text}
                </a>
            ) : (
                <button className={`${styles.btn} ${styles[color]}`} onClick={handleClick} type={type}>
                    {text}
                </button>
            )}
        </div>
    );
}

export default Index;
