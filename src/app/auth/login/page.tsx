'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { LOGIN_USER } from '../../../graphql/mutations';
import Link from "next/link";
import Button from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';
import Title from '../../../components/UI/Title';
import styles from './index.module.scss';
import Connexion from "../../../../public/connexion-1.jpg";
import Cookies from 'js-cookie';

const LoginPage = () => {
    const router = useRouter();

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState(""); 

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: LOGIN_USER,
                    variables: {
                        user: {
                            email: form.email,
                            password: form.password,
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
            } else if (data && data.data && data.data.login) {
                const token = data.data.login.token;
                Cookies.set('token', token);
                router.push('/account/profil');
                router.refresh();
            }
            
        } catch (error) {
            console.error("Erreur lors de la connexion : ", error);
            setError(error.message);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.left__part}>
                <img src={Connexion.src} alt="auth" />
            </div>
            <div className={styles.right__part}>
                <Title title="Connexion" level={1} color="primary" />
                {error && <div className={styles.error}>{error}</div>} 
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Veuillez saisir votre email"
                        isRequired={true}
                        onChange={handleChange}
                        value={form.email}
                    />
                    <label>Mot de passe</label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Veuillez saisir votre mot de passe"
                        isRequired={true}
                        onChange={handleChange}
                        value={form.password}
                    />
                    <Link href='/auth/register' className={styles.navLink}>
                        Pas encore de compte ? Inscrivez-vous !                    
                    </Link><br/><br/>
                    <Button type="submit" text="Connexion" color="primary" />
                </form>
            </div>
        </div>  
    );
};

export default LoginPage;
