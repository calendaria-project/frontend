const getValueWithoutReplacedSymbols = (value: string, forReplace: Array<string>) => {
    forReplace.forEach((replacingChar) => {
        value = value.replace(replacingChar, "");
    });
    return value;
};
export default getValueWithoutReplacedSymbols;
