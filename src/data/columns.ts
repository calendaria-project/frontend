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
        title: "ИИН",
        field: "iin"
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
    },
    {
        headerSort: false,
        title: "E-mail",
        field: "personalContact.email"
    },
    {
        headerSort: false,
        title: "Дата приема",
        field: "employmentDate"
    }
];

export const externalUsersColumns: ColumnDefinition[] = [
    {
        headerSort: false,
        title: "E-mail",
        field: "personalContact.email"
    },
    {
        headerSort: false,
        title: "Номер телефона",
        field: "personalContact.mobilePhoneNumber"
    },
    {
        headerSort: false,
        title: "Контрагент",
        field: "counterparty.nameRu"
    },
    {
        headerSort: false,
        title: "Должность",
        field: "position.nameRu"
    }
];

export const usersByStaffingColumns: ColumnDefinition[] = [
    {
        headerSort: false,
        title: "Должность",
        field: "position.nameRu"
    },
    {
        headerSort: false,
        title: "Постоянная з/п",
        field: "salaryConstantPart"
    },
    {
        headerSort: false,
        title: "Переменная з/п",
        field: "salaryVariablePart"
    },
    {
        headerSort: false,
        title: "Оклад",
        field: "salary"
    },
    {
        headerSort: false,
        title: "Дата приема",
        field: "employmentDate"
    }
];

export const userUsersColumns: ColumnDefinition[] = [
    {
        headerSort: false,
        title: "Компания",
        field: "company.nameRu"
    },
    {
        headerSort: false,
        title: "Подразделение",
        field: "division.nameRu"
    },
    {
        headerSort: false,
        title: "Номер телефона",
        field: "personalContact.mobilePhoneNumber"
    },
    {
        headerSort: false,
        title: "E-mail",
        field: "personalContact.email"
    }
];
