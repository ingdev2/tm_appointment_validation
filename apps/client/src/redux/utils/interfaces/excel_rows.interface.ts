interface IExcelRows {
  TIPO_DOCUMENTO: string;
  NÚMERO_DOCUMENTO: string;
  FECHA_CITA: string;
  HORA_CITA: string;
  ESPECIALIDAD?: string;
}

interface IExcelRowsHosvital {
  TIPO_DOCUMENTO: string;
  DOCUMENTO: string;
  FECHA_CITA: string;
  HORA_CITA: string;
  DESCRIPCION_ESPECIALIDAD?: string;
}

interface IExcelRowsCoco {
  "Tipo documento": string;
  "Número de Identificación": string;
  "Fecha de la Cita": string;
  "Hora de la Cita": string;
  Servicio?: string;
}
