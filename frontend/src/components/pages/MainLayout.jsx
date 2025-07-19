import React from "react";
import Header from "../../layouts/Header.jsx";
import Footer from "../../layouts/Footer.jsx";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex flex-col text-center min-h-[90vh] bg-gradient-to-bl from-sky-500 to-indigo-500">
                <Outlet />
            </main>
            <Footer/>
        </div>
    )
}