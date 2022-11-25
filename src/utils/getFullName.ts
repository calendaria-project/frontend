const getFullName = (name: string, surname?: string, patronymic?: string) =>
    (surname ? `${surname} ` : "") + (name || "") + (patronymic ? ` ${patronymic}` : "");
export default getFullName;
