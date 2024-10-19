import * as React from 'react';
import './App.css';
import MainLayout from "./layouts/MainLayout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Mainn from "./layouts/mui_layouts/mainn.jsx";
import AddBooksForm from "./components/AddBooksForm.jsx";
import UpdateBooksSimpleTransitions from "./components/UpdateBooksSimpleTransitions.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    <Route path="/updatebooks" element={<UpdateBooksSimpleTransitions />}/>
                    <Route path="/addbooks" element={<AddBooksForm />}/>
                    <Route path="/mui" element={<Mainn/>}/>
                    <Route path="/showbooks" element={<>Get & Show Books Page Here</>}/>
                    <Route path="*" element={<>Routes Handled By ReactJs Here</>}/>
                </Route>
                <Route path="/materialui" element={<Mainn/>}/>
            </Routes>
        </BrowserRouter>
    )
}