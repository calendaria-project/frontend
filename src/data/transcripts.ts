import {
    accessItemRequestStatuses,
    accessRequestHistoryStatuses,
    accessRequestStatuses,
    appTypesEnum
} from "./enums";

export const appTypesEnumTranscripts: { [key: string]: string } = {
    [appTypesEnum.GET_ACCESS]: "Получение доступа",
    [appTypesEnum.REMOVE_ACCESS]: "Удаление доступа"
};

export const accessRequestTranscripts: { [key: string]: string } = {
    [accessRequestStatuses.ON_APPROVEMENT]: "На согласовании",
    [accessRequestStatuses.ON_PROCESS]: "В процессе",
    [accessRequestStatuses.REJECTED]: "Отказано",
    [accessRequestStatuses.CANCELED]: "Отменена",
    [accessRequestStatuses.DONE]: "Завершена",
    [accessRequestStatuses.ON_EMPLOYER_SIGN]: "На подписании сотрудником"
};

export const accessItemRequestTranscripts: { [key: string]: string } = {
    [accessItemRequestStatuses.ON_PROCESS]: "В процессе",
    [accessItemRequestStatuses.CANCELED]: "Отмена задачи",
    [accessItemRequestStatuses.DONE]: "Выполнено"
};

export const accessRequestHistoryTranscripts: { [key: string]: string } = {
    [accessRequestHistoryStatuses.CREATED]: "Заявка создана",
    [accessRequestHistoryStatuses.REJECTED]: "Заявка отклонена согласующим",
    [accessRequestHistoryStatuses.ON_APPROVEMENT]: "На согласовании",
    [accessRequestHistoryStatuses.ON_EMPLOYER_SIGN]: "На подписании сотрудником",
    [accessRequestHistoryStatuses.EMPLOYER_SIGNED]: "Подписано сотрудником",
    [accessRequestHistoryStatuses.APPROVED]: "Заявка согласована",
    [accessRequestHistoryStatuses.SYSTEM_ACCOUNTS_CREATED]: "Cистемные учетные записи созданы",
    [accessRequestHistoryStatuses.ACCOUNT_TENDERIX_CREATED]: "Аккаунт tenderix создан",
    [accessRequestHistoryStatuses.ACCOUNT_1C_CREATED]: "Аккаунт 1C создан",
    [accessRequestHistoryStatuses.ACCOUNT_ADATA_CREATED]: "Аккаунт adata создан",
    [accessRequestHistoryStatuses.SKUD_CREATED]: "СКУД выдан",
    [accessRequestHistoryStatuses.ACCOUNT_BITRIX_CREATED]: "Аккаунт в bitrix создан",
    [accessRequestHistoryStatuses.MOBILE_NUM_ISSUED]: "Cлужебный номер выдан",
    [accessRequestHistoryStatuses.FINISHED]: "Заявка завершена",
    [accessRequestHistoryStatuses.CANCELED]: "Заявка отменена",
    [accessRequestHistoryStatuses.SYSTEM_ACCOUNTS_BLOCKED]:
        "Системные учетные записи заблокированы",
    [accessRequestHistoryStatuses.ACCOUNT_TENDERIX_BLOCKED]: "Аккаунт tenderix заблокирован",
    [accessRequestHistoryStatuses.ACCOUNT_1C_BLOCKED]: "Аккаунс 1С заблокирован",
    [accessRequestHistoryStatuses.ACCOUNT_ADATA_BLOCKED]: "Аккаунт adata заблокирован",
    [accessRequestHistoryStatuses.SKUD_BLOCKED]: "СКУД заблокирован",
    [accessRequestHistoryStatuses.ACCOUNT_BITRIX_BLOCKED]: "Аккаунт в bitrix заблокирован",
    [accessRequestHistoryStatuses.MOBILE_NUM_BLOCKED]: "Служебный номер заблокирован"
};
