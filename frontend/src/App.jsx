import * as React from 'react';
import './App.css';
import MainLayout from "./layouts/MainLayout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    {/*<Route path="/mui" element={<Mainn/>}/>*/}
                    <Route path="/updatebooks" element={<>Update Books Page Here</>}/>
                    <Route path="/showbooks" element={<>Get & Show Books Page Here</>}/>
                    <Route path="/addbooks" element={<>Add Books Page Here</>}/>
                    <Route path="*" element={<>Routes Handled By ReactJs Here</>}/>
                </Route>
                {/*<Route path="/materialui" element={<Mainn/>}/>*/}
            </Routes>
        </BrowserRouter>
    )
}