import React, {useEffect} from "react";

export default function CryptoPage(){

    useEffect(() => {
        const originalTitle = document.title;

        const favicon = document.querySelector(
            'link[rel~="icon"]'
        );

        const originalFavicon = favicon?.href;

        document.title = "Crypto | Arash";

        if (favicon) {
            favicon.href = "/crypto-favicon.svg";
        } else {
            const link = document.createElement("link");
            link.rel = "icon";
            link.href = "/cryptoFavicon.ico";
            link.type = "image/x-icon";
            document.head.appendChild(link);
        }

        return () => {
            document.title = originalTitle;

            if (favicon && originalFavicon) {
                favicon.href = originalFavicon;
            }
        };
    }, []);

    return(
        <>
            <h1 className="text-3xl">
                Welcome To My Crypto Page Sir :)
            </h1>
        </>
    )
}