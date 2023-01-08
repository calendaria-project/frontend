import moment from "moment";

const diffDateAndToString = (smallDate: Date, hugeDate: Date) => {
    const time = moment(smallDate, "DD/MM/YYYY");
    const time2 = moment(hugeDate, "DD/MM/YYYY");

    const daysDiff = time2.diff(time, "days");
    const hoursDiff = time2.diff(time, "hours");
    const minutesDiff = time2.diff(time, "minutes");
    const secondsDiff = time2.diff(time, "seconds");

    return daysDiff > 0
        ? `${daysDiff} дн.`
        : hoursDiff > 0
        ? `${hoursDiff} ч.`
        : minutesDiff > 0
        ? `${minutesDiff} мин.`
        : secondsDiff > 0
        ? `${secondsDiff} сек.`
        : "Время вышло";
};
export default diffDateAndToString;
