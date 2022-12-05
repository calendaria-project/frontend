export type TLayoutModalData = {
    type: string;
    propertyName: string;
    dictionaryCode?: string;
    inputType?: string;
    customType?: "mobile";
    withSearch?: boolean;
    pattern?: RegExp;
    patternMessage?: string;
    placeholder: string;
    required?: boolean;
};

export type TLayoutModalDataRecord = {
    [key: string]: Array<TLayoutModalData>;
};
