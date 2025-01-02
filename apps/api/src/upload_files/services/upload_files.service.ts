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
      const match = cocoFileData.find(
        (row2) =>
          row1.TIPO_DOCUMENTO === row2.TIPO_DOCUMENTO &&
          row1.NÚMERO_DOCUMENTO === row2.NÚMERO_DOCUMENTO &&
          row1.FECHA_CITA === row2.FECHA_CITA &&
          row1.ESPECIALIDAD === row2.ESPECIALIDAD,
      );
      if (match) {
        coincidencias.push({
          TIPO_DOCUMENTO: row1.TIPO_DOCUMENTO,
          NÚMERO_DOCUMENTO: row1.NÚMERO_DOCUMENTO,
          ESPECIALIDAD: row1.ESPECIALIDAD,
          FECHA_CITA: row1.FECHA_CITA,
        });
      } else {
        soloEnHO.push({
          TIPO_DOCUMENTO: row1.TIPO_DOCUMENTO,
          DOCUMENTO: row1.NÚMERO_DOCUMENTO,
          DESCRIPCION_ESPECIALIDAD: row1.ESPECIALIDAD,
          FECHA_CITA: row1.FECHA_CITA,
        });
      }
    });

    cocoFileData.forEach((row2) => {
      const match = hosvitalFileData.find(
        (row1) =>
          row1.TIPO_DOCUMENTO === row2.TIPO_DOCUMENTO &&
          row1.NÚMERO_DOCUMENTO === row2.NÚMERO_DOCUMENTO &&
          row1.FECHA_CITA === row2.FECHA_CITA &&
          row1.ESPECIALIDAD === row2.ESPECIALIDAD,
      );
      if (!match) {
        soloEnCO.push({
          'Tipo documento': row2.TIPO_DOCUMENTO,
          'Número de Identificación': row2.NÚMERO_DOCUMENTO,
          'Fecha de la Cita': row2.FECHA_CITA,
          Servicio: row2.ESPECIALIDAD,
        });
      }
    });

    return { coincidencias, soloEnHO, soloEnCO };
  }

  // GET FUNTIONS //

  async getAllFiles() {}

  async getFileById() {}

  // UPDATE FUNTIONS //

  async updateFile() {}

  // DELETED-BAN FUNTIONS //

  async banFiles() {}
}
