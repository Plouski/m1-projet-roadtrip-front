'use client';
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { CREATE_ROADTRIPSTEP } from "../../../../graphql/mutations";
import Title from "../../../../components/UI/Title";
import Input from "../../../../components/UI/Input";
import Button from "../../../../components/UI/Button";
import styles from './index.module.scss';

const CreateStepPage = () => {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [roadtripOwnerId, setRoadtripOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      const decodedToken = jwt.decode(storedToken);
      setUserId(decodedToken?.id);
      setToken(storedToken);
    }
  }, []);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
  });

  useEffect(() => {
    const getRoadtripById = async (roadtripId) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetRoadtripById($id: ID!) {
                getRoadtripById(id: $id) {
                  id
                  title
                  duration
                  description
                  image
                  user_id
                }
              }
            `,
            variables: { id: roadtripId },
          }),
        });

        const { data, errors } = await res.json();

        if (errors) {
          console.error("Error fetching roadtrip:", errors);
          setError(errors);
        } else {
          setRoadtripOwnerId(data.getRoadtripById.user_id);
        }

      } catch (error) {
        console.error("Error fetching roadtrip by ID:", error);
        setError(error);

      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getRoadtripById(id);
    }

  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            query: CREATE_ROADTRIPSTEP,
            variables: {
              roadtripstep: {
                roadtrip_id : id,
                title : form.title,
                location : form.location,
                description : form.description,
              }
            }
          }),
      }); 

      const { data, errors } = await res.json();

      if (errors) {
        setError("Une erreur s'est produite lors de la création du roadtripstep.");
        console.error('Error :', errors);
        return;
      }

      if (data && data.createRoadtripStep) {
        console.log("Roadtripstep created successfully");
        const roadtripId = data.createRoadtripStep.roadtrip_id;
        router.push(`/roadtrip/${roadtripId}`);
      } else {
        console.error('Error creating roadtripstep:', data.errors);
        setError("Erreur lors de la création du roadtripstep.");
      }

    }
    catch (error) {
      console.error('Error creating roadtripstep:', error);
      setError("Une erreur s'est produite lors de la création du roadtripstep.");
    }
  };

  if (loading) return <div>Chargement...</div>;
  
  if (!token || !userId || roadtripOwnerId != userId){
    router.push('/permission-denied');
    return null;
  }
  
  return (
    <div className={styles.container}>            
      <form onSubmit={handleSubmit} className={styles.form}>
        <Title title="Création de l'étape" level={1} color="primary" />
        {error && <div className={styles.error}>{error}</div>}
        <label>Titre</label>
        <Input 
          type="text" 
          name="title" 
          value={form.title}
          isRequired={true} 
          placeholder="Veuillez saisir le titre de l'étape" 
          onChange={handleChange} 
        />
        <label>Location</label>
        <Input 
          type="text" 
          name="location" 
          value={form.location}
          isRequired={true} 
          placeholder="Veuillez saisir la location de l'étape" 
          onChange={handleChange} 
        />
        <label>Description</label>
        <Input 
          type="textarea" 
          name="description" 
          value={form.description} 
          isRequired={false} 
          placeholder="Veuillez saisir la description de l'étape" 
          onChange={handleChange} 
        />
        <Button type="submit" text="Créer l'étape du roadtrip" color="primary" />
      </form>
    </div>
  );
};

export default CreateStepPage;
