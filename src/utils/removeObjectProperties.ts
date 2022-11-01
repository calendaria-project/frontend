export const removeObjectProperties = (obj: Object): Object =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));

export function removeEmptyValuesFromAnyLevelObject(obj: any) {
    const finalObj = {} as any;
    Object.keys(obj).forEach((key: string) => {
        if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const nestedObj = removeEmptyValuesFromAnyLevelObject(obj[key]);
            if (Object.keys(nestedObj).length) {
                finalObj[key] = nestedObj;
            }
        } else if (Array.isArray(obj[key])) {
            if (obj[key].length) {
                obj[key].forEach((x: any) => {
                    const nestedObj = removeEmptyValuesFromAnyLevelObject(x);
                    if (Object.keys(nestedObj).length) {
                        finalObj[key] = finalObj[key] ? [...finalObj[key], nestedObj] : [nestedObj];
                    }
                });
            }
        } else if (obj[key] !== "" && obj[key] !== undefined && obj[key] !== null) {
            finalObj[key] = obj[key];
        }
    });
    return finalObj;
}
