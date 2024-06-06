'use client'
import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Logo from "../../UI/Logo";
import WishlistContext from "../../../context/WishlistContext";
import styles from "./index.module.scss";
import LogoImage from "../../../../public/logo-png.png";
import { FaUserCircle } from 'react-icons/fa';
import Link from "next/link";
import Cookies from 'js-cookie';

const Navbar = () => {
    const router = useRouter();
    const [isFixed, setIsFixed] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { roadtrips } = useContext(WishlistContext);
    const [showDropdown, setShowDropdown] = useState(false);

    const token = Cookies.get('token');
    
    const handleLogout = () => {
        closeDropdown();
        logout();
    };

    const logout = () => {
        Cookies.remove('token');
        setIsLoggedIn(false);
        router.push('/auth/login');
        router.refresh();
    };

    useEffect(() => {
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [token]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const closeDropdown = () => {
        setShowDropdown(false);
    };

    useEffect(() => { 
        window.addEventListener("scroll", () => {
            if (window.scrollY > 150) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        });
    }, []);

    return (
        <header className={`${styles.nav} ${isFixed ? styles.fixed : ''}`}>
            <div className={styles.navContainer}>
                <div className={styles.leftContainer}>
                    <Logo image={LogoImage.src} />
                </div>
                <div className={styles.rightContainer}>
                    {isLoggedIn ? (
                        <div className={styles.profileContainer}>
                            <Link href='/roadtrip' className={styles.navLink} onClick={closeDropdown}>
                                Mes Road trips
                            </Link>
                            <Link href='/wishlist' className={styles.navLink} onClick={closeDropdown}>Coup de ❤️ ({roadtrips.length})</Link>
                            <FaUserCircle 
                                size={30} 
                                onClick={toggleDropdown} 
                                className={`${styles.profileIcon} ${isLoggedIn ? styles.loggedIn : styles.loggedOut}`} 
                            />
                            {showDropdown && (
                                <div className={styles.dropdownMenu}>
                                    <Link href='/account/profil' className={styles.navLink} onClick={closeDropdown}>
                                        Mon profil
                                    </Link>
                                    <a onClick={handleLogout} className={styles.navLink}>
                                        Déconnexion
                                    </a>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.profileContainer}>
                            <Link href='/wishlist' className={styles.navLink} onClick={closeDropdown}>Coup de ❤️ ({roadtrips.length})</Link>
                            <FaUserCircle 
                                size={30} 
                                onClick={toggleDropdown} 
                                className={`${styles.profileIcon} ${isLoggedIn ? styles.loggedIn : styles.loggedOut}`} 
                            />
                            {showDropdown && (
                                <div className={styles.dropdownMenu}>
                                    <Link href='/auth/register' className={styles.navLink} onClick={closeDropdown}>Inscription</Link>
                                    <Link href='/auth/login' className={styles.navLink} onClick={closeDropdown}>Connexion</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
