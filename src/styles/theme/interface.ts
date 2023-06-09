type TSimpleThemeRecord = { [key: string]: string | number };

export interface ITheme {
    color: TSimpleThemeRecord;
    background: TSimpleThemeRecord;
    border: string;
    borderRadius: string;
    fontWeight: TSimpleThemeRecord;
    fontSize: TSimpleThemeRecord;
    selection: {
        background: TSimpleThemeRecord;
    };
    image: {
        fontSize: string;
        color: TSimpleThemeRecord;
    };
    button: {
        height: string;
        colors: TSimpleThemeRecord;
        border: TSimpleThemeRecord;
        background: TSimpleThemeRecord;
    };
    select: TSimpleThemeRecord;
    input: TSimpleThemeRecord;
    table: {
        header: TSimpleThemeRecord;
        background: string;
        color: string;
        selection: string;
    };
    notifications: TSimpleThemeRecord;
    layout: {
        header: TSimpleThemeRecord;
        sider: TSimpleThemeRecord;
        btnRowMargin: string;
        padding: string;
        hugeMargin: string;
        margin: string;
        mediumMargin: string;
        smallMargin: string;
        mediumPadding: string;
        smallPadding: string;
    };
}
