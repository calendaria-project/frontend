import Tabulator, { ColumnDefinition } from "tabulator-tables";
import "tabulator-tables/dist/css/semantic-ui/tabulator_semantic-ui.css";

import emptyImg from "assets/icons/emptyImg.png";
import questionImage from "assets/icons/question.png";

import "./styles.scss";

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
    console.log(data);
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

export const fullNameTableActionsFormatter = (cell: Tabulator.CellComponent) => {
    const data: any = cell.getData();

    const userPhoto = data.currentPhotoId;

    let photoElement = document.createElement("img");
    photoElement.setAttribute("src", userPhoto ? userPhoto : questionImage);
    photoElement.setAttribute("class", "photo");
    photoElement.setAttribute("width", "30px");
    photoElement.setAttribute("height", "30px");

    let textElement = document.createElement("span");
    textElement.setAttribute("class", "fullNameText");
    textElement.textContent = `${data.lastname ?? ""} ${data.firstname ?? ""} ${
        data.patronymic ?? ""
    }`;

    let wrap = document.createElement("div");
    wrap.setAttribute("class", "fullNameWrap");
    wrap.appendChild(photoElement);
    wrap.appendChild(textElement);
    return wrap;
};

export const customGroupHeader = (
    value: any,
    count: number,
    data: any,
    group: Tabulator.GroupComponent
): any => {
    let divisionName = "";
    if (data.length !== 0) {
        divisionName = data[0].division.nameRu;
    }
    let groupWrap = document.createElement("div");
    groupWrap.setAttribute("class", "groupWrap");
    groupWrap.appendChild(document.createTextNode(divisionName));
    return groupWrap;
};
