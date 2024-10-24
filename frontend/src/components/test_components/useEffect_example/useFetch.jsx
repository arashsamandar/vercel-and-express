import * as React from "react";
import {useEffect, useState} from "react";

export default function useFetch(url){

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const resultedData = await response.json();
                if(isMounted){
                    setData(resultedData);
                    setLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    setError(error.message || 'An unknown error occurred');
                    setLoading(false);
                }
            } finally {
                if(isMounted){
                    setLoading(false);
                }
            }
        }
        fetchData();
        return () => {
            isMounted = false;
        }
    },[url]);

    return {
        data,
        loading,
        error
    }
}