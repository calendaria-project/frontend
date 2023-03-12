const getYearsAmount = (birthDate: string) => {
    const yearMs = 31536000000;
    const birthDateMs = new Date(birthDate).valueOf();
    const nowDateMs = new Date().valueOf();

    return Math.floor((nowDateMs - birthDateMs) / yearMs);
};
export default getYearsAmount;
