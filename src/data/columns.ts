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
