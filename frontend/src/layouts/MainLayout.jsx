import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex bg-gradient-to-bl from-sky-500 to-indigo-500 text-center min-h-[90vh] justify-center items-center">
                <Outlet />
            </main>
            <Footer/>
        </div>
    )
}