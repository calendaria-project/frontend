import Tabulator, { ColumnDefinition } from "tabulator-tables";
import "tabulator-tables/dist/css/semantic-ui/tabulator_semantic-ui.css";
import "./styles.scss";
import emptyImg from "assets/icons/emptyImg.png";

const getLoadingHtmlElem = () => {
    let tableContent = document.querySelector(".tabulator-tableHolder");
    let spinnerWrapper = document.createElement("div");
    spinnerWrapper.setAttribute("class", "custom-loading-wrapper");
    let spinner = document.createElement("div");
    spinner.setAttribute("class", "custom-loader");
    spinnerWrapper.appendChild(spinner);
    if (tableContent) {
        tableContent.appendChild(spinnerWrapper);
    }
    return spinnerWrapper;
};

const getEmptyHtmlElem = () => {
    let tableContent = document.querySelector(".tabulator-tableHolder");
    let emptyElemWrapper = document.createElement("div");
    emptyElemWrapper.setAttribute("class", "custom-image-wrapper");
    let emptyElem = document.createElement("img");
    emptyElem.setAttribute("src", emptyImg);
    emptyElemWrapper.appendChild(emptyElem);
    if (tableContent) {
        tableContent.appendChild(emptyElemWrapper);
    }
    return emptyElemWrapper;
};

export function createTableViaTabulator(
    tagId: string,
    columns: ColumnDefinition[],
    data: any[],
    myRowclick: (e: UIEvent, row: Tabulator.RowComponent) => void,
    isLoading?: boolean,
    groupHeader?:
        | ((value: any, count: number, data: any, group: Tabulator.GroupComponent) => string)
        | undefined
): Tabulator {
    const token = sessionStorage.getItem("token");
    const table = new Tabulator(tagId, {
        placeholder: isLoading ? getLoadingHtmlElem() : getEmptyHtmlElem(),
        pageLoaded(pageno) {
            // pageno - the number of the loaded page
        },
        layout: "fitColumns",
        dataTree: true,
        groupHeader: groupHeader,
        rowClick: (e: UIEvent, row: Tabulator.RowComponent) => myRowclick(e, row),
        groupBy: tagId === "#usersTable" ? "divisionId" : undefined,
        columns,
        data,
        cellClick: () => {}
    });

    return table;
}
