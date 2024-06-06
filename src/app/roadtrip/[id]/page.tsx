'use client';
import { useEffect, useState, useContext } from "react";
import { useRouter, useParams } from 'next/navigation';
import jwt from "jsonwebtoken";
import Cookies from 'js-cookie';
import { DELETE_ROADTRIP, DELETE_ROADTRIPSTEP } from "../../../graphql/mutations";
import Title from "../../../components/UI/Title";
import Button from "../../../components/UI/Button";
import styles from './index.module.scss';
import WishlistContext from "../../../context/WishlistContext";

const RoadtripDetailsPage = () => {
    const token = Cookies.get('token');
    const router = useRouter();
    const { roadtrips, addRoadtrip, removeRoadtrip } = useContext(WishlistContext);
    const params = useParams();
    const id = params.id;
    const [roadtrip, setRoadtrip] = useState(null);
    const [steps, setSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingSteps, setLoadingSteps] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isRoadtripInWishlist, setIsRoadtripInWishlist] = useState(false);

    useEffect(() => {
        if (token) {
            const decoded = jwt.decode(token);
            if (decoded && decoded.id) {
                console.log("Decoded user ID:", decoded.id);
                setUserId(decoded.id.toString());
            } else {
                console.error("Failed to decode token or user ID not found in token");
            }
        } else {
            console.error("Token not found in cookies");
        }
    }, [token]);

    useEffect(() => {
        const checkIfRoadtripInWishlist = () => {
            setIsRoadtripInWishlist(roadtrips.some(item => item.id === roadtrip?.id));
        };

        if (roadtrip) {
            checkIfRoadtripInWishlist();
        }
    }, [roadtrip, roadtrips]);

    useEffect(() => {
        const getRoadtripById = async (roadtripId) => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query: `
                            query GetRoadtripById($id: ID!) {
                                getRoadtripById(id: $id) {
                                    id
                                    title
                                    duration
                                    description
                                    user_id
                                    image
                                }
                            }
                        `,
                        variables: { id: roadtripId }
                    }),
                });

                const { data, errors } = await res.json();

                if (errors) {
                    console.error('Error fetching roadtrip:', errors);
                    setError(errors);
                } else {
                    setRoadtrip(data.getRoadtripById);
                    if (data.getRoadtripById && data.getRoadtripById.id) {
                        getRoadtripSteps(data.getRoadtripById.id);
                    } else {
                        console.error("Roadtrip ID is undefined");
                    }
                }

            } 
            catch (error) {
                console.error('Error fetching roadtrip by ID:', error);
                setError(error);
            } 
            finally {
                setLoading(false);
            }
        };

        const getRoadtripSteps = async (roadtripId) => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: `
                            query GetRoadtripSteps($roadtrip_id: ID!) {
                                getRoadtripSteps(roadtrip_id: $roadtrip_id) {
                                    id
                                    title
                                    location
                                    description
                                }
                            }
                        `,
                        variables: { roadtrip_id: roadtripId }
                    }),
                });

                const { data, errors } = await res.json();

                if (errors) {
                    console.error('Error fetching roadtrip steps:', errors);
                    setError(errors);
                } else {
                    console.log("Fetched roadtrip steps:", data.getRoadtripSteps);
                    setSteps(data.getRoadtripSteps);
                }
            } 
            catch (error) {
                console.error('Error fetching roadtrip steps:', error);
                setError(error);
            } 
            finally {
                setLoadingSteps(false);
            }
        };

        if (id) {
            getRoadtripById(id);
        }
    }, [id]);

    const handleWishlistClick = () => {
        if (isRoadtripInWishlist) {
            removeRoadtrip(roadtrip);
        } else {
            addRoadtrip(roadtrip);
        }
    };

    const handleDeleteRoadtrip = async () => {
        const confirmDeleteRoadtrip = window.confirm("Êtes-vous sûr de vouloir supprimer ce roadtrip ?");
        if (!confirmDeleteRoadtrip) return;

        try {
            await Promise.all(steps.map(step => handleDeleteStep(step.id)));

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: DELETE_ROADTRIP,
                    variables: { id }
                }),
            });

            const { data, errors } = await res.json();

            if (errors) {
                console.error('Error deleting roadtrip:', errors);
                setError(errors);
            } else if (data.deleteRoadtrip.success) {
                console.log("Roadtrip deleted successfully");
                removeRoadtrip(roadtrip);
                router.push('/roadtrip');
            } else {
                console.error('Failed to delete roadtrip:', data.deleteRoadtrip.message);
                setError(new Error(data.deleteRoadtrip.message));
            }

        } 
        catch (error) {
            console.error('Error deleting roadtrip:', error);
            setError(error);
        }
    };

    const handleDeleteStep = async (stepId) => {
        const confirmDeleteStep = window.confirm("Êtes-vous sûr de vouloir supprimer cette étape ?");
        if (!confirmDeleteStep) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    query: DELETE_ROADTRIPSTEP,
                    variables: { id: stepId }
                }),
            });

            const { data, errors } = await res.json();

            if (errors) {
                console.error('Error deleting roadtripstep:', errors);
                setError(errors);
            } else if (data.deleteRoadtripStep.success) {
                console.log("Roadtripstep deleted successfully");
                setSteps(steps.filter(step => step.id !== stepId));
            } else {
                console.error('Failed to delete roadtripstep:', data.deleteRoadtripStep.message);
                setError(new Error(data.deleteRoadtripStep.message));
            }

        } 
        catch (error) {
            console.error('Error deleting roadtripstep:', error);
            setError(error);
        }
    };

    if (loading || loadingSteps) return <div>Chargement...</div>;

    if (error) return <div>Error: {error.message || error[0].message}</div>;

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {roadtrip ? (
                    <>
                        <button className={`${styles.wishlist} ${isRoadtripInWishlist ? styles.active : ''}`} onClick={handleWishlistClick}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 20.7846L10.677 19.6194C5.216 15.0755 2 12.0325 2 8.49846C2 5.46746 4.42 3.03746 7.3 3.03746C9.02 3.03746 10.81 4.06346 12 5.68446C13.19 4.06246 14.98 3.03746 16.7 3.03746C19.58 3.03746 22 5.46746 22 8.49846C22 12.0325 18.784 15.0755 13.323 19.6194L12 20.7846Z" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={isRoadtripInWishlist ? "red" : "none"} />
                            </svg>
                        </button>
                        <Title title={roadtrip.title} level={1} color="primary" />
                        <p>Description: {roadtrip.description}</p>
                        <p>Durée: {roadtrip.duration} jours</p>

                        {roadtrip.image && <img src={roadtrip.image} alt={roadtrip.title} className={styles.image} />}

                        {userId === roadtrip.user_id && (
                            <div className={styles.button}>
                                <Button text="Modifier" handleClick={() => router.push(`/roadtrip/update/${roadtrip.id}`)} color="primary" />
                                <Button text="Supprimer" handleClick={handleDeleteRoadtrip} color="secondary" />
                            </div>
                        )}
                        <Title title="Les étapes de ce roadtrip" level={2} color="primary" alignment="left" />
                        {userId === roadtrip.user_id && (
                            <div className={styles.buttonCreate}>
                                <Button text="Créer une étape" handleClick={() => router.push(`/roadtrip/${roadtrip.id}/step`)} color="primary"/>
                            </div>
                        )}
                        
                        {steps.length > 0 ? (
                            <ul className={styles.steps}>
                                {steps.map((step, index) => (
                                    <li key={step.id} className={styles.step}>
                                        <h3>Étape {index + 1}: {step.title}</h3>
                                        <p>Location: {step.location}</p>
                                        <p>Description: {step.description}</p>
                                        {userId === roadtrip.user_id && (
                                            <div className={styles.stepButton}>
                                                <Button text="Modifier" handleClick={() => router.push(`/roadtrip/${roadtrip.id}/step/update/${step.id}`)} color="primary"/>
                                                <Button text="Supprimer" handleClick={() => handleDeleteStep(step.id)} color="secondary" />
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Aucune étape trouvée pour ce roadtrip.</p>
                        )}
                    </>
                ) : (
                    <div>Aucun roadtrip trouvé.</div>
                )}
            </div>
        </div>
    );
}

export default RoadtripDetailsPage;
