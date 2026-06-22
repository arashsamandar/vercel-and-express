import React, { lazy, Suspense } from "react";
import CubeText from "./cubeText.jsx";
import Svg_Image_MainPage from "./svg_image_mainpage.jsx";
import useScreenSize from "../../../hooks/useScreenSize.js";
import "../../../assets/sass/globeContainer.sass";
import MainPage_cube from "../mainpage_cube.jsx";
const SvgGlobe = lazy(() => import("./svgGlobe.jsx"));

export default function MainPageLogo({ svgOpacity, ip }) {
    const screenWidth = useScreenSize();

    return (
        <div className="relative w-full mt-[25vh] pointer-events-none [@media(min-width:750px)_and_(max-width:1500px)]:mt-[15vh]">

            {(screenWidth < 1500 && screenWidth > 750) ? (
                <div className="w-full flex flex-col items-center z-20 pointer-events-auto">
                    <div className="w-full max-w-[600px] aspect-square relative">
                        <Suspense fallback={<div className="w-full h-full rounded-full animate-pulse bg-gray-200/10" />}>
                            <SvgGlobe ip={ip} />
                        </Suspense>
                    </div>
                    <div className="h-[150px] w-full"></div>
                </div>
            ) : null}

            <div style={{ opacity: svgOpacity }} className="globe-container relative pointer-events-auto">
                {screenWidth > 1500 ? (
                    <div className="w-full h-full min-h-[800px]">
                        <Suspense fallback={null}>
                            <SvgGlobe ip={ip} className="w-full h-full" />
                        </Suspense>
                    </div>
                ) : null}
            </div>

            <Svg_Image_MainPage svgOpacity={svgOpacity} className="w-full h-full pointer-events-none" />

            <div className="w-full flex align-middle items-center justify-center select-none">
                <div className="ml-5 w-full min-h-[400px] min-w-[600px] pointer-events-auto [@media(min-width:860px)_and_(max-width:1800px)]:mr-[100px]">
                    <div className={`${screenWidth < 750 && "h-[50px]"}`}>
                        <CubeText svgOpacity={svgOpacity} />
                    </div>
                    {screenWidth < 750 && <div className="flex justify-center pt-[50px]"><MainPage_cube svgOpacity={svgOpacity}/></div>}
                </div>
            </div>

        </div>
    );
}