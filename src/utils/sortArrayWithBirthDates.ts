export const dateToYMD = (date: any) => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    return "" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
};

function sortArrayWithBirthDates<T>(arrWithDates: Array<T>): Array<T> {
    type TSample = { birthDate: string };
    return arrWithDates.sort((a, b) =>
        dateToYMD(new Date((a as TSample).birthDate)) >
            dateToYMD(new Date((b as TSample).birthDate)) &&
        dateToYMD(new Date((a as TSample).birthDate)) < dateToYMD(new Date())
            ? 1
            : -1
    );
}
export default sortArrayWithBirthDates;
