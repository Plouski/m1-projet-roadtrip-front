import React from "react";
import styles from "./index.module.scss";

const Modal = ({ children, onClose }) => {
  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );
};

export default Modal;
