import { Injectable } from '@nestjs/common';

import * as XLSX from 'xlsx';

@Injectable()
export class UploadFilesService {
  parseHeaders(fileBuffer: Buffer): string[] {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const headers = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
    })[0] as string[];
    return headers;
  }

  convertToDate(date: string | number): string {
    if (!date) return '';

    if (typeof date === 'number') {
      const excelDate = new Date((date - 25569) * 86400000);
      return excelDate.toISOString().split('T')[0];
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    const parts = date.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }

    console.error(`Formato de fecha desconocido: ${date}`);
    return '';
  }

  convertTo24HourFormat(time: string | number): string {
    if (!time) return '';

    if (typeof time === 'number') {
      const totalMinutes = Math.round(time * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    let normalizedTime = time
      .toString()
      .trim()
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .replace(/A\.?M\.?/gi, 'AM')
      .replace(/P\.?M\.?/gi, 'PM')
      .replace(/(\d+):(\d+):\d+/, '$1:$2');

    if (normalizedTime.match(/(AM|PM)/)) {
      const date = new Date(`2000-01-01 ${normalizedTime}`);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
    }

    return normalizedTime;
  }

  identifyFileType(fileBuffer: Buffer): 'hosvital' | 'coco' {
    const headers = this.parseHeaders(fileBuffer);

    if (headers.includes('COCO Id') || headers.includes('Servicio')) {
      return 'coco';
    } else {
      return 'hosvital';
    }
  }

  parseExcel(fileBuffer: Buffer): IExcelRows[] {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const fileType = this.identifyFileType(fileBuffer);

    if (fileType === 'hosvital') {
      return data.map((row) => ({
        TIPO_DOCUMENTO: row.TIPO_DOCUMENTO ?? row['Tipo documento'],
        NÚMERO_DOCUMENTO:
          row.NÚMERO_DOCUMENTO ??
          row['Número de Identificación'] ??
          row['DOCUMENTO'],
        FECHA_CITA: this.convertToDate(
          row.FECHA_CITA ?? row['Fecha de la Cita'],
        ),
        HORA_CITA: this.convertTo24HourFormat(
          row.HORA_CITA ?? row['Hora de la Cita'],
        ),
        ESPECIALIDAD: row.ESPECIALIDAD ?? row['DESCRIPCION_ESPECIALIDAD'],
      }));
    } else {
      return data.map((row) => ({
        TIPO_DOCUMENTO: row.TIPO_DOCUMENTO ?? row['Tipo documento'],
        NÚMERO_DOCUMENTO:
          row.NÚMERO_DOCUMENTO ?? row['Número de Identificación'],
        FECHA_CITA: this.convertToDate(
          row.FECHA_CITA ?? row['Fecha de la Cita'],
        ),
        HORA_CITA: this.convertTo24HourFormat(
          row.HORA_CITA ?? row['Hora de la Cita'],
        ),
        ESPECIALIDAD: row.Servicio ?? row['DESCRIPCION_ESPECIALIDAD'],
      }));
    }
  }

  async compareFiles(hosvitalFileBuffer: Buffer, cocoFileBuffer: Buffer) {
    const hosvitalFileData = this.parseExcel(hosvitalFileBuffer);
    const cocoFileData = this.parseExcel(cocoFileBuffer);

    const coincidencias: IExcelRows[] = [];
    const soloEnHO: IExcelRowsHosvital[] = [];
    let soloEnCO: IExcelRowsCoco[] = [];

    hosvitalFileData.forEach((row1) => {
      const fechaHosvital = this.convertToDate(row1.FECHA_CITA);
      const horaHosvital = this.convertTo24HourFormat(row1.HORA_CITA);

      const match = cocoFileData.find((row2) => {
        const fechaCoco = this.convertToDate(row2.FECHA_CITA);
        const horaCoco = this.convertTo24HourFormat(row2.HORA_CITA);

        return (
          row1.TIPO_DOCUMENTO.trim() === row2.TIPO_DOCUMENTO.trim() &&
          row1.NÚMERO_DOCUMENTO.toString().trim() ===
            row2.NÚMERO_DOCUMENTO.toString().trim() &&
          fechaHosvital === fechaCoco &&
          horaHosvital === horaCoco
        );
      });

      if (match) {
        coincidencias.push({
          TIPO_DOCUMENTO: row1.TIPO_DOCUMENTO,
          NÚMERO_DOCUMENTO: row1.NÚMERO_DOCUMENTO,
          FECHA_CITA: fechaHosvital,
          HORA_CITA: horaHosvital,
          ESPECIALIDAD: match.ESPECIALIDAD,
        });
      } else {
        soloEnHO.push({
          TIPO_DOCUMENTO: row1.TIPO_DOCUMENTO,
          DOCUMENTO: row1.NÚMERO_DOCUMENTO,
          FECHA_CITA: fechaHosvital,
          HORA_CITA: horaHosvital,
          DESCRIPCION_ESPECIALIDAD: row1.ESPECIALIDAD,
        });
      }
    });

    const documentosCoincidentes = new Set(
      coincidencias.map(
        (c) =>
          `${c.TIPO_DOCUMENTO}-${c.NÚMERO_DOCUMENTO}-${c.FECHA_CITA}-${c.HORA_CITA}`,
      ),
    );

    soloEnCO = cocoFileData
      .filter((row2) => {
        const fechaCoco = this.convertToDate(row2.FECHA_CITA);
        const horaCoco = this.convertTo24HourFormat(row2.HORA_CITA);
        const clave = `${row2.TIPO_DOCUMENTO}-${row2.NÚMERO_DOCUMENTO}-${fechaCoco}-${horaCoco}`;

        return !documentosCoincidentes.has(clave);
      })
      .map((row2) => ({
        'Tipo documento': row2.TIPO_DOCUMENTO,
        'Número de Identificación': row2.NÚMERO_DOCUMENTO,
        'Fecha de la Cita': this.convertToDate(row2.FECHA_CITA),
        'Hora de la Cita': this.convertTo24HourFormat(row2.HORA_CITA),
        Servicio: row2.ESPECIALIDAD,
      }));

    return { coincidencias, soloEnHO, soloEnCO };
  }

  exportToExcel(
    coincidencias: IExcelRows[],
    soloEnHO: IExcelRowsHosvital[],
    soloEnCO: IExcelRowsCoco[],
  ): Buffer {
    const wsCoincidencias = XLSX.utils.json_to_sheet(coincidencias);
    const wsSoloEnHO = XLSX.utils.json_to_sheet(soloEnHO);
    const wsSoloEnCO = XLSX.utils.json_to_sheet(soloEnCO);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsCoincidencias, 'Coincidencias');
    XLSX.utils.book_append_sheet(wb, wsSoloEnHO, 'Solo en Hosvital');
    XLSX.utils.book_append_sheet(wb, wsSoloEnCO, 'Solo en Coco');

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    return excelBuffer;
  }

  // GET FUNTIONS //

  async getAllFiles() {}

  async getFileById() {}

  // UPDATE FUNTIONS //

  async updateFile() {}

  // DELETED-BAN FUNTIONS //

  async banFiles() {}
}
