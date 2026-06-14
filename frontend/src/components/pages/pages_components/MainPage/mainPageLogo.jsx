import React, {lazy, Suspense} from "react";
const SvgGlobe = lazy(()=> import("./svgGlobe.jsx"))
import CubeText from "./cubeText.jsx";
import Svg_Image_MainPage from "./svg_image_mainpage.jsx";
import useScreenSize from "../../../../assets/js/hooks/useScreenSize.js";
import "../../../../assets/sass/globeContainer.sass";

export default function MainPageLogo({svgOpacity, ip}) {
    const screenWidth = useScreenSize();

    return (
        <div className="relative w-full mt-[25vh] pointer-events-none">
            <div style={{opacity: svgOpacity}} className={`globe-container ${svgOpacity === 1 ? "" : "globe-hidden"} relative pointer-events-auto`}>
                {
                    screenWidth > 1500 ? (
                        <Suspense fallback={null}>
                            <SvgGlobe ip={ip} className="w-full h-full" />
                        </Suspense>
                    ) : null
                }
            </div>
            <Svg_Image_MainPage svgOpacity={svgOpacity} className="w-full h-full pointer-events-none"/>
            <div className="w-full flex justify-center select-none">
                <div className="ml-5 w-full min-h-[400px] min-w-[600px] pointer-events-auto">
                    <CubeText svgOpacity={svgOpacity}/>
                </div>
                {/*<NameTag svgOpacity={svgOpacity} classNames="hidden md:block"/>*/}
            </div>
            {/*<NameTag svgOpacity={svgOpacity} classNames="block md:hidden"/>*/}
        </div>
    );
}