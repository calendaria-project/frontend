export const isObjectNotEmpty = (obj: Object | Object[] | null | undefined): boolean =>
    obj ? (obj instanceof Array ? obj.length > 0 : Object.keys(obj).length > 0) : false;
