'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CREATE_ROADTRIP } from "../../../graphql/mutations";
import jwt from "jsonwebtoken";
import Cookies from 'js-cookie';
import Title from "../../../components/UI/Title";
import Input from "../../../components/UI/Input";
import Button from "../../../components/UI/Button";
import styles from './index.module.scss';

const CreateRoadtripPage = () => {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedToken = Cookies.get('token');
        if (storedToken) {
            const decodedToken = jwt.decode(storedToken);
            setUserId(decodedToken?.id);
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const [form, setForm] = useState({
        title: "",
        description: "",
        duration: "",
        // image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'duration' && value < 0) {
            setError("Le nombre de jours ne peut pas être inférieur à 0");
        } else {
            setForm({ ...form, [name]: value });
            setError(null);
        }
    };

    // const handleFileChange = (e) => {
    //     setForm({ ...form, image: e.target.files[0] });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // let imageUrl = null;

            // if (form.image) {
            //     const formData = new FormData();
            //     formData.append('file', form.image);

            //     const uploadRes = await fetch('/api/upload', {
            //         method: 'POST',
            //         body: formData,
            //     });

            //     if (!uploadRes.ok) {
            //         setError('Error uploading image');
            //         return;
            //     }

            //     const uploadData = await uploadRes.json();

            //     if (uploadData.filePath) {
            //         imageUrl = uploadData.filePath;
            //     } else {
            //         setError('Error uploading image');
            //         return;
            //     }
            // }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: CREATE_ROADTRIP,
                    variables: {
                        roadtrip: {
                            title: form.title,
                            description: form.description,
                            duration: parseInt(form.duration, 10),
                            user_id: userId,
                            // image: imageUrl,
                        }
                    }
                }),
            });

            const data = await res.json();

            if (data.errors) {
                setError(data.errors[0].message);
                return;
            }

            if (data.data && data.data.createRoadtrip) {
                const roadtripId = data.data.createRoadtrip.id;
                router.push(`/roadtrip/${roadtripId}`);
            }

        } 
        catch (error) {
            console.error('Error creating roadtrip:', error);
            setError('An unexpected error occurred');
        }
    };

    if (loading) return <div>Chargement...</div>;

    if (!token || !userId) {
        router.push('/permission-denied');
        return null;
    }

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Title title="Création du roadtrip" level={1} color="primary" />
                {error && <div className={styles.error}>{error}</div>}
                <label>Titre</label>
                <Input 
                    type="text" 
                    name="title" 
                    value={form.title} 
                    isRequired={true} 
                    placeholder="Veuillez saisir le titre du roadtrip" 
                    onChange={handleChange} 
                />
                <label>Nombre de jours</label>
                <Input 
                    type="number" 
                    name="duration" 
                    value={form.duration} 
                    isRequired={true} 
                    placeholder="Veuillez saisir le nombre de jours" 
                    onChange={handleChange} 
                />
                <label>Description</label>
                <Input 
                    type="textarea" 
                    name="description" 
                    value={form.description} 
                    isRequired={false} 
                    placeholder="Veuillez saisir la description du roadtrip" 
                    onChange={handleChange} 
                />
                {/* <label>Image</label>
                <Input 
                    type="file" 
                    name="image" 
                    value="" 
                    isRequired={false} 
                    placeholder="" 
                    onChange={handleFileChange} 
                /> */}
                <Button type="submit" text="Créer Roadtrip" color="primary" />
            </form>
        </div>
    );
};

export default CreateRoadtripPage;
