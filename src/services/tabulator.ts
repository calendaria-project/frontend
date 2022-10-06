import Tabulator, { ColumnDefinition } from 'tabulator-tables';
import 'tabulator-tables/dist/css/semantic-ui/tabulator_semantic-ui.css'; // theme
import '../assets/styles/tabulator.scss';

export function createTableViaTabulator(
    tagId: string,
    pageSize: number,
    paginationType: 'local' | 'remote',
    url: string,
    columns: ColumnDefinition[],
    data: any[],
    myRowclick: (e: UIEvent, row: Tabulator.RowComponent) => void,
    isSelectable?: boolean,
    isLoading?: boolean
): Tabulator {
    const token = sessionStorage.getItem('token');
    const table = new Tabulator(tagId, {
        placeholder: isLoading ? "Загрузка..." : 'Отсутствуют данные',
        pageLoaded(pageno) {
            // pageno - the number of the loaded page
        },
        layout: 'fitColumns',
        dataTree: true,
        rowClick: (e: UIEvent, row: Tabulator.RowComponent) => myRowclick(e, row),
        columns,
        data,
        cellClick: () => {
        }
    });

    return table;
}
