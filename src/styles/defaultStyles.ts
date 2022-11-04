import { createUseStyles } from "react-jss";

export default createUseStyles({
    "@global": {
        body: {
            margin: 0,
            fontFamily: "Inter, sans-serif",
            letterSpacing: "0.01rem",
            fontSize: "16px",
            "-webkit-font-smoothing": "antialiased",
            "-moz-osx-font-smoothing": "grayscale"
        },
        code: {
            fontFamily: "Inter, sans-serif",
            fontSize: "16px"
        },
        "html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, menu, nav, output, ruby, section, summary, time, mark, audio, video":
            {
                fontSize: "16px"
            },
        button: {
            fontSize: "16px !important",
            borderRadius: "6px !important"
        },
        "#root": {
            overflowX: "auto"
        }
    }
});
