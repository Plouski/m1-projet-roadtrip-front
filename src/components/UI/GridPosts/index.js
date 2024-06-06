import PostItem from "../PostItem";
import styles from "./index.module.scss";

const Index = ({ roadtrips }) => {
    return (
        <div className={styles.grid}>
            {
                roadtrips?.map((roadtrip, index) => (
                    <PostItem key={roadtrip.id} roadtrip={roadtrip} position={index} />
                ))
            }
        </div>
    );
}

export default Index;
