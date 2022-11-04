type TSimpleThemeRecord = { [key: string]: string | number };

export interface ITheme {
    color: TSimpleThemeRecord;
    background: TSimpleThemeRecord;
    border: string;
    borderRadius: string;
    fontWeight: TSimpleThemeRecord;
    selection: {
        background: TSimpleThemeRecord;
    };
    image: {
        fontSize: string;
        color: TSimpleThemeRecord;
    };
    button: {
        colors: TSimpleThemeRecord;
        border: TSimpleThemeRecord;
        background: TSimpleThemeRecord;
    };
    table: {
        header: TSimpleThemeRecord;
        background: string;
        color: string;
        selection: string;
    };
    notifications: TSimpleThemeRecord;
    layout: {
        header: TSimpleThemeRecord;
        padding: string;
        margin: string;
    };
}
