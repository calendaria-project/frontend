export interface ITempAccountData {
    appName: string;
    createDate: string;
    email: string;
    type: string;
}

const tempAccountsData: ITempAccountData[] = [
    {
        appName: "Figma",
        createDate: "16.06.2001",
        email: "somamail@mail.kz",
        type: "Основа"
    },
    {
        appName: "Bitrix",
        createDate: "16.06.2001",
        email: "somamail@mail.kz",
        type: "Админ"
    }
];

export default tempAccountsData;
