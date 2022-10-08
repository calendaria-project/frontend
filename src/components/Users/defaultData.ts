type TUsers = Array<{
    id: number | string;
    name: string;
    surname?: string;
    patronymic?: string;
    email?: string;
    phone?: string;
    status: string;
    profession: string;
    iin: string;
    birth: any;
    gender: string;
    date: any;
    sign: any;
}>;

const fullUsersData: TUsers = [
    {
        id: 1,
        name: "SomeName",
        surname: "SomeSurname",
        patronymic: "SomePatronymic",
        email: "mail@google.com",
        phone: "87715489031",
        status: "Верифицированный",
        profession: "HR",
        iin: "129803847123",
        birth: "01.12.2001",
        gender: "female",
        date: "10.22.2020",
        sign: "https://uprostim.com/wp-content/uploads/2021/04/image025-36.jpg"
    },
    {
        id: 2,
        name: "BSomeName2",
        surname: "SomeSurname2",
        email: "mail2@google.com",
        phone: "87715489031",
        status: "Неверифицированный",
        profession: "Lead",
        iin: "129803847123",
        birth: "01.12.2001",
        gender: "female",
        date: "10.15.2019",
        sign: "https://uprostim.com/wp-content/uploads/2021/04/image025-36.jpg"
    },
    {
        id: 3,
        name: "ASomeName3",
        surname: "SomeSurname3",
        email: "mail3@google.com",
        phone: "87715489031",
        status: "Верифицированный",
        profession: "HR",
        iin: "129803847123",
        birth: "01.12.2001",
        gender: "female",
        date: "10.15.2020",
        sign: "https://uprostim.com/wp-content/uploads/2021/04/image025-36.jpg"
    }
];

const usersTableData = fullUsersData.map((userDataItem) => {
    const { id, name, surname, patronymic, email, status, profession, phone, date } = userDataItem;

    return {
        id,
        fullName:
            name + (surname ? ` ${surname[0]}.` : "") + (patronymic ? `${patronymic[0]}.` : ""),
        email,
        status,
        profession,
        phone,
        date
    };
});

const usersCardData = fullUsersData.map((userDataItem) => {
    const { status, name, surname, patronymic, ...data } = userDataItem;

    return {
        ...data,
        fullName: (surname ? `${surname} ` : "") + name + (patronymic ? ` ${patronymic}` : "")
    };
});

export const DATE = "date";
export const ALPHABET = "alphabet";
export const PROFESSION = "profession";
export const VERIFICATION = "verification";
export const VERIFIED = "верифицированный";

const usersSortValues = [
    [DATE, "По дате"],
    [ALPHABET, "По алфавиту"],
    [PROFESSION, "По профессии"],
    [VERIFICATION, "По верификации"]
];

export default usersSortValues;

export { usersTableData, usersCardData };
