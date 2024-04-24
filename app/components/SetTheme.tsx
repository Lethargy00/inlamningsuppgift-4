'use client'
import { useState, useEffect } from 'react';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SetTheme = () => {
    // Retrieve the theme from local storage or default to 'light'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme : 'light';
    });

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    };

    useEffect(() => {
        // Update the theme in local storage whenever it changes
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return <button onClick={toggleTheme} className='themeButton'><FontAwesomeIcon icon={ theme === 'light' ? faSun : faMoon }/></button>
};

export default SetTheme;