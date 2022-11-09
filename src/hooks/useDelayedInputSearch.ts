import { useEffect, useState } from "react";

const delay = 700;

const useDelayedInputSearch = (query: string) => {
    const [searchStr, setSearchStr] = useState("");

    useEffect(() => {
        const timeOutId = setTimeout(() => setSearchStr(query), delay);
        return () => clearTimeout(timeOutId);
    }, [query]);

    return {
        searchStr
    };
};
export default useDelayedInputSearch;
