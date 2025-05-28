
import React, { useRef, useEffect, useState } from 'react';
import '../assets/css/cubeStyles.css';
import laravel from '../assets/images/laravel4.webp';
import react from '../assets/images/react2.png';
import javascript from '../assets/images/js2.png';
import nodejs from '../assets/images/nodejs.png';
import mysql from '../assets/images/mysql.png';
import php from '../assets/images/php.png';
import svgLogo from '../components/my_website_components/svgLogo';

export default function MainPage() {


    return (
        <div className="">
            <div className="flex flex-col text-center min-h-[calc(100vh-8rem)] justify-center items-center">
                <div className="w-1/4 min-w-[350px] z-20">{svgLogo()}</div>
                <br/>
                <div id="cube-container" className="justify-center items-center mt-10 z-20">
                    <div id="front" className="face"><img src={laravel} alt="Laravel" /></div>
                    <div id="back" className="face"><img src={react} alt="React" /></div>
                    <div id="right" className="face"><img src={javascript} alt="Javascript"/></div>
                    <div id="left" className="face"><img src={nodejs} alt="Nodejs"/></div>
                    <div id="top" className="face"><img src={mysql} alt="MySql"/></div>
                    <div id="bottom" className="face"><img src={php} alt="Php"/></div>
                </div>
            </div>
        </div>
    );
}