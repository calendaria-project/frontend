export const isObjectNotEmpty = (obj: Object): boolean =>
    obj ? (obj instanceof Array ? obj.length > 0 : Object.keys(obj).length > 0) : false;
