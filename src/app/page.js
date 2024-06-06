'use client';
import { useState, useEffect } from 'react';
import GridPosts from "../components/UI/GridPosts";
import FilterRoadtripsByDuration from "../components/Filter";
import { GET_ROADTRIPS } from '../graphql/queries';
import Hero from "../components/UI/Hero";
import Title from "../components/UI/Title";
import Accueil from "../../public/accueil.jpg";

export default function Home() {
  const [roadtrips, setRoadtrips] = useState([]);
  const [filteredRoadtrips, setFilteredRoadtrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadtrips = async () => {
      setLoading(true); 
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: GET_ROADTRIPS,
          }),
        });
        
        const data = await res.json();

        if (data && data.data && data.data.getRoadtrips) {
          setRoadtrips(data.data.getRoadtrips);
          setFilteredRoadtrips(data.data.getRoadtrips);
        }

      } 
      catch (error) {
        console.error('Error fetching roadtrips:', error);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchRoadtrips();
  }, []);

  return (
    <>
      <Hero
        subtitle="Explorez le Monde"
        title="Roadtrips Inoubliables"
        image={Accueil.src}
      />
      <Title title="La liste de tous les Road trips" level={1} color="tertiary" alignment="left" />
      <FilterRoadtripsByDuration roadtrips={roadtrips} setFilteredRoadtrips={setFilteredRoadtrips} />
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <GridPosts roadtrips={filteredRoadtrips} />
      )}
    </>
  );
}
