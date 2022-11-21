import { createUseStyles } from "react-jss";
import { ITheme } from "styles/theme/interface";
import { UP } from "../defaultValues";

export default createUseStyles({
    sharedBorderedWrapper: {
        height: "100%",
        padding: ({ theme }: { theme: ITheme }) => theme.layout.padding,
        borderRadius: ({ theme }: { theme: ITheme }) => theme.borderRadius,
        border: ({ theme }: { theme: ITheme }) => `1px solid ${theme.color.lines}`
    },
    imageWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "30px",
        width: "30px",
        borderRadius: "50%",
        background: ({ theme, imageKey }: { theme: ITheme; imageKey: string | undefined }) =>
            imageKey
                ? imageKey === UP
                    ? theme.image.color.successful
                    : theme.image.color.removing
                : theme.image.color.regular
    },

    smallInfoCol: {
        height: "150px"
    },
    smallInfoContent: {
        background: ({ theme }: { theme: ITheme }) => theme.background.highlight
    },
    primaryInfo: {
        display: "flex",
        alignItems: "end"
    },
    secondaryInfo: {
        fontSize: "26px",
        color: ({ theme }: { theme: ITheme }) => theme.color.regular
    },

    currentUserCol: {
        height: "200px"
    },
    currentUserContent: {
        background: ({ theme }: { theme: ITheme }) => theme.background.regular,
        color: ({ theme }: { theme: ITheme }) => theme.color.primary
    }
});
