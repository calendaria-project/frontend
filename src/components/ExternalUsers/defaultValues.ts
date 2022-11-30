import { ALL, ACTIVE, ARCHIVE } from "data/values";
export const requestTypeValues = [
    {
        type: ALL,
        label: "Все внешние пользователи"
    },
    {
        type: ARCHIVE,
        label: "Архивные внешние пользователи"
    },
    {
        type: ACTIVE,
        label: "Активные внешние пользователи"
    }
];

export const DATE = "createdAt";
export const FULL_NAME = "fullName";
export const EMAIL = "personalContact.email";
export const PHONE_NUMBER = "personalContact.mobilePhoneNumber";
export const COUNTER_PARTY = "counterparty.nameRu";
export const POSITION = "position.nameRu";
export const sortTypeValues = [
    {
        type: DATE,
        label: "Дате создания"
    },
    {
        type: FULL_NAME,
        label: "ФИО"
    },
    {
        type: EMAIL,
        label: "E-mail"
    },
    {
        type: PHONE_NUMBER,
        label: "Номеру телефона"
    },
    {
        type: COUNTER_PARTY,
        label: "Контрагентам"
    },
    {
        type: POSITION,
        label: "Должности"
    }
];
