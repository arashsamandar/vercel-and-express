import React from "react";
import {Link, useLocation} from "react-router-dom";

export default function ({to,name,toggleMenu}) {
    const location = useLocation();
    let isActive = ( to === location.pathname );
    return (
        <li>
            <Link to={to} className="text-blue-200 px-4 py-3" onClick={toggleMenu}>
                <span className={`${isActive ? 'shadow-[#333_10px_10px_12px]' : ''}`}>
                    {name}
                </span>
            </Link>
        </li>
    )
}
