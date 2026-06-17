import React, {lazy, Suspense} from "react";
const SvgGlobe = lazy(()=> import("./svgGlobe.jsx"))
import CubeText from "./cubeText.jsx";
import Svg_Image_MainPage from "./svg_image_mainpage.jsx";
import useScreenSize from "../../../hooks/useScreenSize.js";
import "../../../assets/sass/globeContainer.sass";

// some comment

export default function MainPageLogo({svgOpacity, ip}) {
    const screenWidth = useScreenSize();

    return (
        <div className="relative w-full mt-[25vh] pointer-events-none [@media(min-width:750px)_and_(max-width:1500px)]:mt-[15vh]">
            {
                ( screenWidth < 1500 && screenWidth > 750 ) ?
                    (
                        <Suspense fallback={null}>
                            <SvgGlobe ip={ip} />
                            <div className="h-[150px]"></div>
                        </Suspense>
                    ) : null
            }
            <div style={{opacity: svgOpacity}} className="globe-container relative pointer-events-auto">
                {
                    screenWidth > 1500 ? (
                        <Suspense fallback={null}>
                            <SvgGlobe ip={ip} className="w-full h-full" />
                        </Suspense>
                    ) : null
                }
            </div>
            <Svg_Image_MainPage svgOpacity={svgOpacity} className="w-full h-full pointer-events-none"/>
            <div className="w-full flex align-middle items-center justify-center select-none">
                <div className="ml-5 w-full min-h-[400px] min-w-[600px] pointer-events-auto [@media(min-width:860px)_and_(max-width:1800px)]:mr-[100px]">
                    <CubeText svgOpacity={svgOpacity}/>
                </div>
            </div>
        </div>
    );
}