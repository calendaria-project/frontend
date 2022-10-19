export const removeEmptyObjectProperties = (obj: Object): Object =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));
