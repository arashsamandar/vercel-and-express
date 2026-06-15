import {motion} from "framer-motion";
import {pageVariants, pageTransition} from "../../utils/framer-motion-objects.js";
import Rotating_Icons_Two from "../../utils/rotating_icons_two.jsx";
import React from "react";

export default function TechStack() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="flex flex-col h-[90vh] text-center justify-center items-center">
                <div className="pointer-events-auto cursor-pointer">
                    <Rotating_Icons_Two/>
                </div>
            </div>
        </motion.div>
    )
}