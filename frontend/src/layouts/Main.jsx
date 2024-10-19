import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
// import Mainn from "./mainn.jsx";

export default function Main(){
    return(
        <div className="flex bg-gradient-to-bl from-sky-500 to-indigo-500 text-center min-h-[90vh] justify-center items-center">
            <Routes>
                <Route path="/mui" element={<Mainn />} />
                <Route path="/updatebooks" element={<>Update Books Page</>} />
                <Route path="/getbooks" element={<>Get Books Page</>} />
                <Route path="/*" element={<>Routes Handled By ReactJs Here</>} />
            </Routes>
        </div>
    );
}