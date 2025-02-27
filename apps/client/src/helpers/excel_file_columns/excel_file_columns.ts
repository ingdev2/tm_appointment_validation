import { ColumnConfig } from "@/components/common/custom_table_filters_and_sorting/interfaces/colum_config.interface";

export const columnsCoincidences: ColumnConfig<IExcelRows>[] = [
  {
    title: "Tipo de Documento",
    dataIndex: "TIPO_DOCUMENTO",
    key: "TIPO_DOCUMENTO",
    width: 7,
  },
  {
    title: "Número de Documento",
    dataIndex: "NÚMERO_DOCUMENTO",
    key: "NÚMERO_DOCUMENTO",
    width: 13,
    searchable: true,
  },
  {
    title: "Especialidad",
    dataIndex: "ESPECIALIDAD",
    key: "ESPECIALIDAD",
    width: 45,
    searchable: true,
  },
  {
    title: "Fecha de Cita",
    dataIndex: "FECHA_CITA",
    key: "FECHA_CITA",
    width: 13,
    sorter: (a, b) => {
      return a.FECHA_CITA.localeCompare(b.FECHA_CITA);
    },
  },
  {
    title: "Hora de Cita",
    dataIndex: "HORA_CITA",
    key: "HORA_CITA",
    width: 10,
    sorter: (a, b) => {
      return a.HORA_CITA.localeCompare(b.HORA_CITA);
    },
  },
];

export const columnsHosvital: ColumnConfig<IExcelRowsHosvital>[] = [
  {
    title: "Tipo de Documento",
    dataIndex: "TIPO_DOCUMENTO",
    key: "TIPO_DOCUMENTO",
    width: 7,
  },
  {
    title: "Número de Documento",
    dataIndex: "DOCUMENTO",
    key: "DOCUMENTO",
    width: 13,
    searchable: true,
  },
  {
    title: "Especialidad",
    dataIndex: "DESCRIPCION_ESPECIALIDAD",
    key: "DESCRIPCION_ESPECIALIDAD",
    width: 45,
    searchable: true,
  },
  {
    title: "Fecha de Cita",
    dataIndex: "FECHA_CITA",
    key: "FECHA_CITA",
    width: 13,
    sorter: (a, b) => {
      return a.FECHA_CITA.localeCompare(b.FECHA_CITA);
    },
  },
  {
    title: "Hora de Cita",
    dataIndex: "HORA_CITA",
    key: "HORA_CITA",
    width: 10,
    sorter: (a, b) => {
      return a.HORA_CITA.localeCompare(b.HORA_CITA);
    },
  },
];

export const columnsCoco: ColumnConfig<IExcelRowsCoco>[] = [
  {
    title: "Tipo de Documento",
    dataIndex: "Tipo documento",
    key: "Tipo documento",
    width: 7,
  },
  {
    title: "Número de Documento",
    dataIndex: "Número de Identificación",
    key: "Número de Identificación",
    width: 13,
    searchable: true,
  },
  {
    title: "Especialidad",
    dataIndex: "Servicio",
    key: "Servicio",
    width: 45,
    searchable: true,
  },
  {
    title: "Fecha de Cita",
    dataIndex: "Fecha de la Cita",
    key: "Fecha de la Cita",
    width: 13,
    sorter: (a, b) => {
      return a["Fecha de la Cita"].localeCompare(b["Fecha de la Cita"]);
    },
  },
  {
    title: "Hora de Cita",
    dataIndex: "Hora de la Cita",
    key: "Hora de la Cita",
    width: 10,
    sorter: (a, b) => {
      return a["Hora de la Cita"].localeCompare(b["Hora de la Cita"]);
    },
  },
];
