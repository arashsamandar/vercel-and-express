import * as React from 'react';
import './App.css';
import MainLayout from "./layouts/MainLayout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import AddBooksForm from "./components/test_components/AddBooksForm.jsx";
import UpdateBooksSimpleTransitions from "./components/test_components/UpdateBooksSimpleTransitions.jsx";
import NotFound404 from "./layouts/NotFound404.jsx";
import MainPage from "./layouts/MainPage.jsx";
import MUI_Main from "./layouts/MUI_Main.jsx";
import Mui_Main_Layout from "./layouts/mui_layouts/Mui_Main_Layout.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout/>}>
                    <Route path="/" element={<MainPage />}/>
                    <Route path="/updatebooks" element={<UpdateBooksSimpleTransitions />}/>
                    <Route path="/addbooks" element={<AddBooksForm />}/>
                    <Route path="/mui" element={<Mui_Main_Layout/>}/>
                    <Route path="/showbooks" element={<>Get & Show Books Page Here</>}/>
                    <Route path="*" element={<NotFound404 />}/>
                </Route>
                <Route path="/materialui" element={<Mui_Main_Layout/>}/>
            </Routes>
        </BrowserRouter>
    )
}