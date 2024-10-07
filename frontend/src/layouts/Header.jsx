import React from "react";
import CustomLink from "./CustomLink.jsx";

export default function Header(){
    return (
        <header className="relative bg-gray-700 drop-shadow-lg p-4 text-center min-h-[5vh]">
            <nav className="flex items-center justify-center">
                <a href="/getbooks" className="absolute left-4 text-2xl font-bold text-white float-left">Laravel Eleven</a>
                <ul className="flex space-x-4 items-center justify-center">
                    <CustomLink to="/addbooks" name="Add Books" />
                    <CustomLink to="/updatebooks" name="Update Books" />
                    <CustomLink to="/showbooks" name="Show Books" />
                </ul>
            </nav>
        </header>
    )
}
