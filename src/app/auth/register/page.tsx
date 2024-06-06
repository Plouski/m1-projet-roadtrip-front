'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Title from "../../../components/UI/Title";
import styles from "./index.module.scss";
import Inscription from "../../../../public/inscription.jpg";
import { REGISTER_USER } from "../../../graphql/mutations";

const RegisterPage = () => {

    const router = useRouter();

    const [form, setForm] = useState({
        email: "",
        password: "",
        firstname: "",
        lastname: "",
    });

    const [error, setError] = useState(""); 

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(form.password);
            if (!isStrongPassword) {
                setError("Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial.");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: REGISTER_USER,
                    variables: {
                        user: {
                            email: form.email,
                            password: form.password,
                            firstname: form.firstname,
                            lastname: form.lastname,
                        }
                    }
                }),
            });

            const data = await res.json();

            if (data && data.errors && data.errors.length > 0) {
                const errorMessage = data.errors[0].message;
                if (errorMessage) {
                    setError(errorMessage);
                }
            } else if (data && data.data && data.data.register) {
                window.alert("Vous êtes bien inscrit(e) !");
                router.push('/auth/login');
            }

        } catch (error) {
            console.error("Erreur lors de la connexion : ", error);
            setError(error.message);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.left__part}>
                <img src={Inscription.src} alt="auth" />
            </div>
            <div className={styles.right__part}>
                <Title title="Inscription" level={1} color="primary" />
                {error && <div className={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <label>Prénom</label>
                    <Input
                        type="text"
                        name="firstname"
                        placeholder="Veuillez saisir votre prénom"
                        isRequired={true}
                        onChange={(e) => handleChange(e)}
                        value={form.firstname}
                    />
                    <label>Nom</label>
                    <Input
                        type="text"
                        name="lastname"
                        placeholder="Veuillez saisir votre nom"
                        isRequired={true}
                        onChange={(e) => handleChange(e)}
                        value={form.lastname}
                    />
                    <label>Email</label>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Veuillez saisir votre email"
                        isRequired={true}
                        onChange={(e) => handleChange(e)}
                        value={form.email}
                    />
                    <label>Mot de passe</label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Veuillez saisir votre mot de passe"
                        isRequired={true}
                        onChange={(e) => handleChange(e)}
                        value={form.password}
                    />
                    <Link href='/auth/login' className={styles.navLink}>
                        Avez-vous déjà un compte ? Connectez-vous !                    
                    </Link><br/><br/>
                    <Button type="submit" text="S'inscrire" color="primary" />
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
