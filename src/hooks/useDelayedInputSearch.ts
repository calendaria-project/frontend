import React, { useCallback, useEffect, useState } from "react";

const delay = 500;

const useDelayedInputSearch = (query: string, setQuery: (v: string) => void) => {
    const [searchStr, setSearchStr] = useState("");

    useEffect(() => {
        const timeOutId = setTimeout(() => setSearchStr(query), delay);
        return () => clearTimeout(timeOutId);
    }, [query]);

    const handleFiltrationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    return {
        searchStr,
        handleFiltrationChange
    };
};
export default useDelayedInputSearch;
