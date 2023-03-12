export const riskLevels = {
    HIGH: "HIGH",
    MEDIUM: "MEDIUM",
    LOW: "LOW"
};

export const riskLevelsTranscripts = {
    [riskLevels.HIGH]: "Высокий",
    [riskLevels.MEDIUM]: "Средний",
    [riskLevels.LOW]: "Низкий"
};

export interface ITempRoleData {
    roleName: string;
    riskLevel: string;
    temp: string;
}

const tempAccountsData: ITempRoleData[] = [
    {
        roleName: "CRM",
        riskLevel: riskLevels.HIGH,
        temp: "Бессрочно"
    },
    {
        roleName: "Сотрудник",
        riskLevel: riskLevels.LOW,
        temp: "Бессрочно"
    },
    {
        roleName: "Аудитор",
        riskLevel: riskLevels.MEDIUM,
        temp: "16.06.2001"
    }
];

export default tempAccountsData;
