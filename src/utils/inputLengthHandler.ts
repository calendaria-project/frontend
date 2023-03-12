export const inputLengthHandler = (e: any) => {
    const { value, maxLength } = e.target;
    if (String(value).length >= maxLength) {
        e.preventDefault();
        return;
    }
};
