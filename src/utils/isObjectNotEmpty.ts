export const isObjectNotEmpty = (obj: Object | Object[] | null | undefined): boolean =>
    obj ? (obj instanceof Array ? obj.length > 0 : Object.keys(obj).length > 0) : false;

export const getObjectLength = (obj: Object | Object[] | null | undefined): number =>
    obj ? (obj instanceof Array ? obj.length : Object.keys(obj).length) : 0;
