import { useState } from 'react';
import Input from '../../../components/UI/Input';
import Button from '../../../components/UI/Button';
import styles from './index.module.scss';
import Cookies from 'js-cookie';

const ProfileEditForm = ({ userProfile, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        email: userProfile.email || '',
        firstname: userProfile.firstname || '',
        lastname: userProfile.lastname || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: `
                        mutation UpdateProfil($user: UserInput!) {
                            updateProfil(user: $user) {
                                id
                                email
                                firstname
                                lastname
                            }
                        }
                    `,
                    variables: {
                        user: formData
                    }
                })
            });
    
            const { data, errors } = await res.json();
    
            if (errors) {
                console.error('Error updating profile:', errors);
                return;
            }
    
            onSave(data.updateProfil);
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };    

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label>Prénom</label>
            <Input
                type="text"
                name="firstname"
                placeholder="Veuillez saisir votre prénom"
                isRequired={true}
                onChange={(e) => handleChange(e)}
                value={formData.firstname}
            />
            <label>Nom</label>
            <Input
                type="text"
                name="lastname"
                placeholder="Veuillez saisir votre nom"
                isRequired={true}
                onChange={(e) => handleChange(e)}
                value={formData.lastname}
            />

            <label>Email</label>
            <Input
                type="email"
                name="email"
                placeholder="Veuillez saisir votre email"
                isRequired={true}
                onChange={(e) => handleChange(e)}
                value={formData.email}
            />
            <Button type="submit" text="Sauvegarder" color="primary" /><br/>
            <Button text="Annuler" color="secondary" handleClick={onClose} />
        </form>
    );
};

export default ProfileEditForm;
