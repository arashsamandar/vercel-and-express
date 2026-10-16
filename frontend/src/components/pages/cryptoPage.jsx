
import React, { useEffect } from "react";

export default function CryptoPage() {
    useEffect(() => {
        const originalTitle = document.title;

        const favicon = document.querySelector(
            'link[rel~="icon"]'
        );

        const originalFavicon = favicon?.href;
        let newFavicon = null;

        document.title = "Crypto | Arash";

        if (favicon) {
            favicon.href = "/cryptoFavicon.ico";
            favicon.type = "image/x-icon";
        } else {
            newFavicon = document.createElement("link");
            newFavicon.rel = "icon";
            newFavicon.href = "/cryptoFavicon.ico";
            newFavicon.type = "image/x-icon";
            document.head.appendChild(newFavicon);
        }

        return () => {
            document.title = originalTitle;

            if (favicon && originalFavicon) {
                favicon.href = originalFavicon;
            }

            if (newFavicon) {
                newFavicon.remove();
            }
        };
    }, []);

    return (
        <h1 className="text-3xl">
            Welcome To My Crypto Page Sir :)
        </h1>
    );
}
