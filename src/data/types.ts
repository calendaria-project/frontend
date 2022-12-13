export type TLayoutModalData = {
    type: string; //тип поля в модальном окне
    placeholder: string; //плейсхолдер
    propertyName: string; //название поля из swagger для формирования запроса
    dictionaryCode?: string; //код справочника для type select для формирования запроса
    maxLength?: number; //для длины input с type=number
    inputType?: string; //тип ввода для type=input (number)
    customType?: "mobile"; //для ввода мобильного телефона
    disabled?: boolean; //задизейблить
    withSearch?: boolean; //для поиска внутри type=select
    pattern?: RegExp; //регулярка для проверки type=input
    patternMessage?: string; //сообщение вместе с регуляркой (обязательно вместе)
    required?: boolean; //обязательно ли поле
    span?: number; //для верстки полей, 24 по дефолту
    suffix?: string; //unit type=input
};

export type TLayoutModalDataRecord = {
    [key: string]: Array<TLayoutModalData>;
};
