const parseModalData = (data: any) => {
    let parsedData: any = {};
    for (let key in data) {
        if (data.hasOwnProperty(key)) {
            if (key.includes(".")) {
                let arrData = key.split(".");
                parsedData[arrData[0]] = {
                    ...(parsedData[arrData[0]] ? parsedData[arrData[0]] : {}),
                    [arrData[1]]: data[key]
                };
            } else if (key.includes("Date")) {
                parsedData[key] = data[key].format("YYYY-MM-DD");
            } else {
                parsedData[key] = data[key];
            }
        }
    }
    return parsedData;
};
export default parseModalData;
