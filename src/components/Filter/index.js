'use client'

import React, { useState, useEffect } from 'react';
import { GET_DURATION_OPTIONS } from '../../graphql/queries';
import styles from "./index.module.scss";

const FilterRoadtripsByDuration = ({ roadtrips, setFilteredRoadtrips }) => {
  const [durationOptions, setDurationOptions] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState('');

  useEffect(() => {
    const fetchDurationOptions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: GET_DURATION_OPTIONS,
          }),
        });

        const { data } = await res.json();

        if (data && data.getRoadtrips) {
          const durations = [...new Set(data.getRoadtrips.map(roadtrip => roadtrip.duration))];
          durations.sort((a, b) => a - b);
          setDurationOptions(['Tout', ...durations]);
          setSelectedDuration('Tout');
        }
      } 
      catch (error) {
        console.error('Error fetching duration options:', error);
      }
    };

    fetchDurationOptions();
  }, []);

  useEffect(() => {
    filterRoadtrips(selectedDuration);
  }, [selectedDuration]);

  const handleDurationChange = (e) => {
    setSelectedDuration(e.target.value);
  };

  const filterRoadtrips = (selectedDuration) => {
    if (selectedDuration === 'Tout') {
      setFilteredRoadtrips(roadtrips);
    } else {
      const filtered = roadtrips.filter(roadtrip => roadtrip.duration === parseInt(selectedDuration));
      setFilteredRoadtrips(filtered);
    }
  };

  return (
    <div className={styles.filter_wrapper}>
      <select value={selectedDuration} onChange={handleDurationChange}>
        {durationOptions.map(duration => (
          <option key={duration} value={duration}>{duration === 'Tout' ? duration : `${duration} jours`}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterRoadtripsByDuration;
