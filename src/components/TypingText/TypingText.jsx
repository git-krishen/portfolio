import React, { useState, useEffect } from 'react';
import { randInt } from 'three/src/math/MathUtils.js';

const strings = [
    "Computer Science Enthusiast",
    "Java Developer",
    "Python Programmer",
    "Robotics Buff",
    "Software Engineer",
    "Team Leader"
]
var text = strings[0];

const TypingText = ({ delay, infinite }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
  
    useEffect(() => {
        let timeout;
        
        
        if (currentIndex < text.length) {
            timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, delay);
        } else if (currentIndex == text.length) { 
            timeout = setTimeout(() => {
                setCurrentText(prevText => prevText + text[currentIndex]);
                setCurrentIndex(prevIndex => prevIndex + 1);
            }, delay*4);
        } else if (infinite) {
            setCurrentIndex(0);
            setCurrentText('');
            text = strings[randInt(0,strings.length-1)]
        }
  
      return () => clearTimeout(timeout);
    }, [currentIndex, delay, infinite, text]);
  
    return <span>{currentText}</span>;
};
  
export default TypingText;