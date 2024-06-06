import { useState } from "react";
import styles from "./index.module.scss";

const Input = ({ type, name, value, isRequired, placeholder, onChange }) => {
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setFileName(file.name);
      }
    }
    onChange(e);
  };

  const inputElement = type === "textarea" ? (
    <textarea 
      name={name}
      value={value}
      required={isRequired}
      placeholder={placeholder}
      onChange={handleChange}
    />
  ) : (
    <input 
      name={name} 
      value={type !== "file" ? value : undefined}
      required={isRequired} 
      placeholder={placeholder}
      type={type}
      onChange={handleChange} 
    />
  );

  return (
    <div className={styles.wrapper}>
      {inputElement}
    </div>
  );
}

export default Input;
