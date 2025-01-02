export interface ColumnConfig<T> {
  title: string;
  key: string;
  dataIndex: string;
  width: string | number;
  filters?: { text: string; value: React.Key }[];
  onFilter?: (value: boolean | React.Key, record: T) => boolean;
  sorter?: (a: T, b: T) => number;
  searchable?: boolean;
  fixed?: boolean | "left" | "right";
}
