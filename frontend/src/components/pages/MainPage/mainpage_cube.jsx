import React from "react";
import '../../../assets/css/cubeStyles.css';
import laravel from '../../../assets/images/laravel4.webp';
import react from '../../../assets/images/react2.png';
import javascript from '../../../assets/images/js2.png';
import nodejs from '../../../assets/images/nodejs.png';
import nextjs from '../../../assets/images/next-js.png'
import postgres from '../../../assets/images/postgres.svg';

export default function MainPage_cube() {
    return (
        <div id="cube-container" className="flex justify-center">
            <div id="front" className="face"><img src={nextjs} alt="Laravel" /></div>
            <div id="back" className="face"><img src={react} alt="React" /></div>
            <div id="right" className="face"><img src={javascript} alt="Javascript"/></div>
            <div id="left" className="face"><img src={nodejs} alt="Nodejs"/></div>
            <div id="top" className="face"><img src={postgres} alt="MySql"/></div>
            <div id="bottom" className="face"><img src={laravel} alt="Php"/></div>
        </div>
    );
}