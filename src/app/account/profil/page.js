'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileEditForm from "../../../components/Edit/profil";
import Modal from "../../../components/UI/Modal";
import { GET_PROFIL } from "../../../graphql/queries";
import jwt from "jsonwebtoken";
import Cookies from 'js-cookie';
import Title from '../../../components/UI/Title';
import styles from './index.module.scss';
import Button from '../../../components/UI/Button';
import cookie from 'js-cookie';

const ProfilePage = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = Cookies.get('token');
        if (storedToken) {
            const decodedToken = jwt.decode(storedToken);
            setUserProfile(decodedToken);
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = cookie.get('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query: GET_PROFIL })
            });

            const { data, errors } = await res.json();

            if (errors) {
                console.error('Error fetching user profile:', errors);
                return;
            }

            setUserProfile(data.getProfil);

        } 
        catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleSaveProfile = (updatedProfile) => {
        setUserProfile(updatedProfile);
        fetchUserProfile();
    };

    if (loading) return <div>Chargement...</div>;

    if (!token || !userProfile) {
        router.push('/permission-denied');
        return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.profileInfo}>
                <Title title="Mon profil" level={1} color="tertiary" />
                <p>Prénom: {userProfile.firstname}</p>
                <p>Nom: {userProfile.lastname}</p>
                <p>Email: {userProfile.email}</p>
                <Button text="Modifier mon profil" color="primary" handleClick={() => setIsModalOpen(true)} />
            </div>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <ProfileEditForm
                        userProfile={userProfile}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveProfile}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ProfilePage;
