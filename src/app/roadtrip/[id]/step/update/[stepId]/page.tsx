'use client';
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";
import { UPDATE_ROADTRIPSTEP } from "../../../../../../graphql/mutations";
import Title from "../../../../../../components/UI/Title";
import Input from "../../../../../../components/UI/Input";
import Button from "../../../../../../components/UI/Button";
import styles from "./index.module.scss";

const UpdateStepPage = () => {
  const { id, stepId } = useParams();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [roadtripOwnerId, setRoadtripOwnerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
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

  useEffect(() => {
    const getRoadtripStepById = async (stepId) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query GetRoadtripStepById($id: ID!) {
                getRoadtripStepById(id: $id) {
                  id
                  title
                  location
                  description
                }
              }
            `,
            variables: { id: stepId },
          }),
        });

        const { data, errors } = await res.json();

        if (errors) {
          console.error("Error fetching roadtrip step:", errors);
          setError(errors);
        } else {
          console.log("Fetched roadtrip step:", data.getRoadtripStepById); 
          setForm({
            title: data.getRoadtripStepById.title,
            location: data.getRoadtripStepById.location,
            description: data.getRoadtripStepById.description,
          });
        }

      } catch (error) {
        console.error("Error fetching roadtrip step by ID:", error);
        setError(error);

      } finally {
        setLoading(false);
      }
    };

    if (stepId) {
      getRoadtripStepById(stepId);
    }
  }, [stepId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: UPDATE_ROADTRIPSTEP,
          variables: {
            id: stepId,
            roadtripstep: {
              title: form.title,
              location: form.location,
              description: form.description,
            },
          },
        }),
      });

      const data = await res.json();
      console.log(data);

      if (data && data.data && data.data.updateRoadtripStep) {
        console.log("Roadtrip step updated successfully");
        router.push(`/roadtrip/${id}`);
      } else {
        console.error("Error updating roadtrip step:", data.errors);
      }
      
    } catch (error) {
      console.error("Error updating roadtrip step:", error);
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
        <Title title="Modification de l'étape du roadtrip" level={1} color="primary" />
        {error && <div className={styles.error}>{error.toString()}</div>}
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
          isRequired={true}
          placeholder="Veuillez saisir la description de l'étape"
          onChange={handleChange}
        />
        <Button type="submit" text="Mettre à jour l'étape du roadtrip" color="primary" />
      </form>
    </div>
  );
};

export default UpdateStepPage;
