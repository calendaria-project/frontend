const getObjectWithHandledDates = (obj: Object) => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]: [string, any]) => {
            if (key.includes("Date")) {
                return [key, value?._i ? value._i : null];
            } else return [key, value];
        })
    );
};
export default getObjectWithHandledDates;
