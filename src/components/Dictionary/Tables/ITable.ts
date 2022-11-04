export interface ITable {
    selectionItems: Array<{ key: string; label: string }>;
    onSetTabActiveKey: (v: string) => void;
}
