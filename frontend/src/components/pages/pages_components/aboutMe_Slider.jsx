import * as React from "react";
import '../../../assets/css/ribbonStyles.css';

export default function AboutMe_Slider() {
    return (
        <div>
            <div className="fixed left-0 z-10 bg-blue-500 shadow-lg flex items-center justify-center animate-slide-in-left mt-[2em]">
                    <span className="text-white text-lg font-semibold">
                        React.js
                    </span>
            </div>

            <div className="fixed left-0 z-10 bg-blue-500 shadow-lg flex items-center justify-center animate-slide-in-left mt-[4em]">
                    <span className="text-white text-lg font-semibold">
                        Mysql & Mongodb
                    </span>
            </div>

            <div className="fixed left-0 z-10 bg-blue-500 shadow-lg flex items-center justify-center animate-slide-in-left mt-[6em]">
                    <span className="text-white text-lg font-semibold">
                        Php & Laravel Framework
                    </span>
            </div>

            <div className="fixed left-0 z-10 bg-blue-500 shadow-lg flex items-center justify-center animate-slide-in-left mt-[8em]">
                    <span className="text-white text-lg font-semibold">
                        Javascript, Node.js & Express.js
                    </span>
            </div>
        </div>
    )
}