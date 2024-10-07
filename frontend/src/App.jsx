import * as React from 'react';
import './App.css';
import MainLayout from "./layouts/MainLayout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
// import Mainn from "./layouts/mui_layouts/mainn.jsx";

export default function App() {
    return (

        <Routes>
            <Route path="/" element={<MainLayout/>}>
                {/*<Route path="/mui" element={<Mainn/>}/>*/}
                <Route path="/updatebooks" element={<>Update Books Page</>}/>
                <Route path="/getbooks" element={<>Get Books Page Arash Here</>}/>
                <Route path="*" element={<>Routes Handled By ReactJs Here</>}/>
            </Route>
            <Route path="/materialui" element={<Mainn/>}/>
        </Routes>

    )
}