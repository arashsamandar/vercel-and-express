import { useEffect, useState } from "react";
import loadIp from "../services/loadIp.js";
import { ipData } from "../libs/ipData.js";

export default function useIp() {
    const [ip, setIp] = useState(ipData.data ?? {});

    useEffect(() => {
        let cancelled = false;

        if (ipData.data) {
            setIp(ipData.data);
            return;
        }

        // First caller creates the promise; everyone else reuses it
        if (!ipData.promise) {
            ipData.promise = loadIp().then(data => {
                ipData.data = data;
                return data;
            });
        }

        ipData.promise.then(data => {
            if (!cancelled) setIp(data);
        });

        return () => { cancelled = true; };
    }, []);

    return ip;
}