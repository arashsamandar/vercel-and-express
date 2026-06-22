import React from "react";
import '../../assets/css/cubeStyles.css';
import laravel from '../../assets/images/laravel4.webp';
import react from '../../assets/images/react2.png';
import javascript from '../../assets/images/js2.png';
import nodejs from '../../assets/images/nodejs.png';
import nextjs from '../../assets/images/next-js.png';
import postgres from '../../assets/images/postgres.svg';

export default function MainPage_cube({ svgOpacity }) {
    // Define the style object once to clean up the JSX
    const faceStyle = { opacity: svgOpacity };

    return (
        <div id="cube-container" className="flex justify-center">
            <div id="front" className="face" style={faceStyle}><img src={nextjs} alt="Nextjs" /></div>
            <div id="back" className="face" style={faceStyle}><img src={react} alt="React" /></div>
            <div id="right" className="face" style={faceStyle}><img src={javascript} alt="Javascript"/></div>
            <div id="left" className="face" style={faceStyle}><img src={nodejs} alt="Nodejs"/></div>
            <div id="top" className="face" style={faceStyle}><img src={postgres} alt="Postgres"/></div>
            <div id="bottom" className="face" style={faceStyle}><img src={laravel} alt="Laravel"/></div>
        </div>
    );
}