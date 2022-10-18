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

const usersTableData = fullUsersData.map((userDataItem, i) => {
    const { id, name, surname, patronymic, email, status, profession, phone, date } = userDataItem;

    return {
        id,
        fullName:
            name + (surname ? ` ${surname[0]}.` : "") + (patronymic ? `${patronymic[0]}.` : ""),
        email,
        status,
        profession,
        phone,
        date,
        division: {
            divisionId: i + 1,
            nameRu: "Division " + (i + 1)
        },
        divisionId: i + 1
    };
});

export { usersTableData };
