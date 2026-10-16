
import React, { useEffect } from "react";

export default function CryptoPage() {
    useEffect(() => {
        const originalTitle = document.title;
        document.title = "Crypto | Arash";

        return () => {
            document.title = originalTitle;
        };
    }, []);

    return (
        <h1 className="text-3xl">
            Welcome To My Crypto Page Sir :)
        </h1>
    );
}
