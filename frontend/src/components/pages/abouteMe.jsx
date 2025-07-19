import * as React from "react";
import AboutMe_Slider from './pages_components/aboutMe_Slider.jsx';
import AboutMe_main from "./pages_components/aboutMe_main.jsx";

export default function AbouteMe() {

    return (
        <div className="justify-center text-center items-center">
            <AboutMe_Slider/>
            <AboutMe_main/>
        </div>
    )
}