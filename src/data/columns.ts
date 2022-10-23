import { ColumnDefinition } from "tabulator-tables";

export const companiesColumns: ColumnDefinition[] = [
    {
        title: "Название на Казахском",
        field: "nameKz",
        responsive: 0
    },
    {
        title: "Название на Русском",
        field: "nameRu"
    },
    {
        title: "Название на Английском",
        field: "nameEn"
    },
    {
        title: "БИН",
        field: "bin"
    }
];

export const staffingItemColumns: ColumnDefinition[] = [
    {
        title: "Название на Русском",
        field: "nameRu"
    },
    {
        title: "Оклад",
        field: "salary"
    },
    {
        title: "Надбавка к окладу",
        field: "salarySupplement"
    }
];

export const divisionsColumns: ColumnDefinition[] = [
    {
        title: "Название на Казахском",
        field: "nameKz",
        responsive: 0
    },
    {
        title: "Название на Русском",
        field: "nameRu"
    },
    {
        title: "Название на Английском",
        field: "nameEn"
    },
    {
        title: "Код",
        field: "code"
    }
];

export const usersColumns: ColumnDefinition[] = [
    {
        headerSort: false,
        title: "ФИО",
        field: "fullName",
        formatter: (cell) => {
            const data: any = cell.getData();
            console.log(data);
            return `${data.lastname ? data.lastname : ""} ${data.firstname ? data.firstname : ""} ${
                data.patronymic ? data.patronymic : ""
            }`;
        }
    },
    {
        headerSort: false,
        title: "E-mail",
        field: "personalContact.email"
    },
    {
        headerSort: false,
        title: "Статус",
        field: "status"
    },
    {
        headerSort: false,
        title: "Должность",
        field: "position.nameRu"
    },
    {
        headerSort: false,
        title: "Номер телефона",
        field: "personalContact.mobilePhoneNumber"
    }
];
