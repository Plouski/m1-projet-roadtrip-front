'use client'
import React, { createContext, useState, useEffect } from 'react';
import { Roadtrip } from "../interfaces";

interface ContextProps {
    children: React.ReactNode;
}

interface WishlistContextType {
    roadtrips: Roadtrip[];
    addRoadtrip: (roadtrip: Roadtrip) => void;
    removeRoadtrip: (roadtrip: Roadtrip) => void;
}

const WishlistContext = createContext<WishlistContextType>({
    roadtrips: [],
    addRoadtrip: () => {},
    removeRoadtrip: () => {},
});

export const WishlistContextProvider = ({ children }: ContextProps) => {
    const [roadtrips, setRoadtrips] = useState<Roadtrip[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
            setRoadtrips(wishlist);
        }
    }, []);

    const addRoadtrip = (roadtrip: Roadtrip) => {
        if (!roadtrips.find((item) => item.id === roadtrip.id)) {
            const updatedRoadtrips = [...roadtrips, roadtrip];
            setRoadtrips(updatedRoadtrips);
            localStorage.setItem("wishlist", JSON.stringify(updatedRoadtrips));
        }
    };
    
    const removeRoadtrip = (roadtrip: Roadtrip) => {
        const updatedRoadtrips = roadtrips.filter((item) => item.id !== roadtrip.id);
        setRoadtrips(updatedRoadtrips);
        localStorage.setItem("wishlist", JSON.stringify(updatedRoadtrips));
    };

    const contextValue: WishlistContextType = {
        roadtrips,
        addRoadtrip,
        removeRoadtrip,
    };

    return (
        <WishlistContext.Provider value={contextValue}>
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistContext;