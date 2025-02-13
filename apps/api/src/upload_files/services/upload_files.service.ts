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

  convertToDate(date: string): string {
    if (typeof date !== 'string') {
      return date;
    }

    const parts = date.split('/');

    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    return date;
  }

  convertTo24HourFormat(time: string | number): string {
    if (time == null) return '';

    if (typeof time === 'number') {
      const totalMinutes = Math.round(time * 24 * 60);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
    }

    let normalizedTime = time
      .toString()
      .trim()
      .toLowerCase()
      .replace(/a\.?m\.?/gi, 'AM')
      .replace(/p\.?m\.?/gi, 'PM')
      .replace(/\s+/g, ' ')
      .replace(/(\d+):(\d+):\d+/, '$1:$2');

    normalizedTime = normalizedTime.replace(/^(\d):/, '0$1:');

    let date = new Date(`2000-01-01 ${normalizedTime}`);

    if (isNaN(date.getTime())) {
      console.error(`Error al convertir la hora: ${time}`);
      return '';
    }

    const localHours = date.getHours();
    const localMinutes = date.getMinutes();

    return `${localHours.toString().padStart(2, '0')}:${localMinutes
      .toString()
      .padStart(2, '0')}`;
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
    const soloEnCO: IExcelRowsCoco[] = [];

    hosvitalFileData.forEach((row1) => {
      const horaHosvital = this.convertTo24HourFormat(row1.HORA_CITA);

      const match = cocoFileData.find((row2) => {
        const horaCoco = this.convertTo24HourFormat(row2.HORA_CITA);
        const esCoincidencia =
          row1.TIPO_DOCUMENTO === row2.TIPO_DOCUMENTO &&
          row1.NÚMERO_DOCUMENTO === row2.NÚMERO_DOCUMENTO &&
          row1.FECHA_CITA === row2.FECHA_CITA &&
          horaHosvital === horaCoco;

        return esCoincidencia;
      });

      if (match) {
        coincidencias.push({
          TIPO_DOCUMENTO: row1.TIPO_DOCUMENTO,
          NÚMERO_DOCUMENTO: row1.NÚMERO_DOCUMENTO,
          FECHA_CITA: row1.FECHA_CITA,
          HORA_CITA: horaHosvital,
          ESPECIALIDAD: row1.ESPECIALIDAD,
        });
      } else {
        soloEnHO.push({
          TIPO_DOCUMENTO: row1.TIPO_DOCUMENTO,
          DOCUMENTO: row1.NÚMERO_DOCUMENTO,
          FECHA_CITA: row1.FECHA_CITA,
          HORA_CITA: horaHosvital,
          DESCRIPCION_ESPECIALIDAD: row1.ESPECIALIDAD,
        });
      }
    });

    cocoFileData.forEach((row2) => {
      const horaCoco = this.convertTo24HourFormat(row2.HORA_CITA);

      const match = hosvitalFileData.find((row1) => {
        const horaHosvital = this.convertTo24HourFormat(row1.HORA_CITA);

        return (
          row1.TIPO_DOCUMENTO === row2.TIPO_DOCUMENTO &&
          row1.NÚMERO_DOCUMENTO === row2.NÚMERO_DOCUMENTO &&
          row1.FECHA_CITA === row2.FECHA_CITA &&
          horaHosvital === horaCoco
        );
      });

      if (!match) {
        soloEnCO.push({
          'Tipo documento': row2.TIPO_DOCUMENTO,
          'Número de Identificación': row2.NÚMERO_DOCUMENTO,
          'Fecha de la Cita': row2.FECHA_CITA,
          'Hora de la Cita': horaCoco,
          Servicio: row2.ESPECIALIDAD,
        });
      }
    });

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
