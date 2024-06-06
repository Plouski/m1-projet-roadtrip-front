'use client';
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { UPDATE_ROADTRIP } from "../../../../graphql/mutations";
import Title from "../../../../components/UI/Title";
import Input from "../../../../components/UI/Input";
import Button from "../../../../components/UI/Button";
import styles from "./index.module.scss";

const UpdateRoadtripPage = () => {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [roadtripOwnerId, setRoadtripOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    // image: null,
  });

  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken) {
      const decodedToken = jwt.decode(storedToken);
      setUserId(decodedToken?.id);
      setToken(storedToken);
    }
  }, []);

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
          console.log("Fetched roadtrip:", data.getRoadtripById);
          setForm({
            title: data.getRoadtripById.title,
            duration: data.getRoadtripById.duration,
            description: data.getRoadtripById.description,
            // image: data.getRoadtripById.image,
          });
          setRoadtripOwnerId(data.getRoadtripById.user_id);
        }

      } 
      catch (error) {
        console.error("Error fetching roadtrip by ID:", error);
        setError(error);
      } 
      finally {
        setLoading(false);
      }
    };

    if (id) {
      getRoadtripById(id);
    }
  }, [id]);

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
  //   setForm({ ...form, image: e.target.files[0] });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      setError("User ID is not available");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: UPDATE_ROADTRIP,
          variables: {
            id,
            roadtrip: {
              title: form.title,
              description: form.description,
              duration: parseInt(form.duration, 10),
              user_id: userId,
              // image: form.image,
            },
          },
        }),
      });

      const data = await res.json();

      if (data && data.data && data.data.updateRoadtrip) {
        console.log("Roadtrip updated successfully");
        const roadtripId = data.data.updateRoadtrip.id;
        router.push(`/roadtrip/${roadtripId}`);
      } else {
        console.error("Error updating roadtrip:", data.errors);
      }

    } 
    catch (error) {
      console.error("Error updating roadtrip:", error);
    }
  };

  if (loading) return <div>Chargement...</div>;

  if (!token || !userId || userId != roadtripOwnerId) {
    router.push('/permission-denied');
    return null;
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Title title="Modification du roadtrip" level={1} color="primary" />
        {error && <div className={styles.error}>{error}</div>}
        <label>Titre</label>
        <Input 
          type="text" 
          name="title" 
          value={form.title} 
          isRequired={true} 
          placeholder="Titre du roadtrip" 
          onChange={handleChange} 
        />
        <label>Description</label>
        <Input 
          type="textarea" 
          name="description" 
          value={form.description} 
          isRequired={true}
          placeholder="Description du roadtrip" 
          onChange={handleChange} 
        />
        <label>Nombre de jours</label>
        <Input 
          type="number" 
          name="duration" 
          value={form.duration} 
          isRequired={true} 
          placeholder="Durée du roadtrip (en jours)" 
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
        <Button type="submit" text="Modifier Roadtrip" color="primary" />
      </form>
    </div>
  );
};

export default UpdateRoadtripPage;
