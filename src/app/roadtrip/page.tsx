'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import jwt from "jsonwebtoken";
import Cookies from 'js-cookie';
import GridPosts from "../../components/UI/GridPosts";
import { GET_MY_ROADTRIPS } from '../../graphql/queries';
import Button from '../../components/UI/Button';
import styles from './index.module.scss';

export default function Home() {
    const router = useRouter();
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [myRoadtrips, setMyRoadtrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const storedToken = Cookies.get('token');
        if (storedToken) {
            const decodedToken = jwt.decode(storedToken);
            setUserId(decodedToken);
            setToken(storedToken);
        }
        setLoading(false);
    }, []);

    const fetchMyRoadtrips = async () => {
        try {
            const token = Cookies.get('token');
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query: GET_MY_ROADTRIPS }),
            });

            const data = await res.json();
            
            if (data && data.data && data.data.getMyRoadtrips) {
                const roadtrips = data.data.getMyRoadtrips;
                setMyRoadtrips(roadtrips);
            } else {
                setError("Aucun roadtrip disponible.");
            }

        } 
        catch (error) {
            setError(error.toString());
            console.error('Error fetching roadtrips:', error);
        } 
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRoadtrips();
    }, []);
    

    if (loading) return <div>Chargement...</div>;

    if (!token || !userId) {
        router.push('/permission-denied');
        return null;
    }

    return (
        <>
            <div className={styles.container}>
                {userId && (
                    <div className={styles.header}>
                        <Button text="Créer un road trip" handleClick={() => router.push(`/roadtrip/create`)} color="primary"/>
                    </div>
                )}
                {userId && (
                    <>
                        {loading ? (
                            <p>Chargement en cours...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : myRoadtrips.length > 0 ? (
                            <GridPosts roadtrips={myRoadtrips} />
                        ) : (
                            <p>Aucun roadtrip disponible.</p>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
