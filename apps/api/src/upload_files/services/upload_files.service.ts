import { Injectable } from '@nestjs/common';

import * as XLSX from 'xlsx';

@Injectable()
export class UploadFilesService {
  // CREATE FUNTIONS //

  parseExcel(fileBuffer: Buffer): IExcelRows[] {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    return data.map((row) => ({
      TIPO_DOCUMENTO: row.TIPO_DOCUMENTO,
      DOCUMENTO: row.DOCUMENTO,
      ESPECIALIDAD: row.ESPECIALIDAD,
      FECHA_CITA: row.FECHA_CITA,
    }));
  }

  async compareFiles(hosvitalFileBuffer: Buffer, cocoFileBuffer: Buffer) {
    const hosvitalFileData = this.parseExcel(hosvitalFileBuffer);
    const cocoFileData = this.parseExcel(cocoFileBuffer);

    const coincidencias: IExcelRows[] = [];
    const soloEnHO: IExcelRows[] = [];
    const soloEnCO: IExcelRows[] = [];

    hosvitalFileData.forEach((row1) => {
      const match = cocoFileData.find(
        (row2) =>
          row1.TIPO_DOCUMENTO === row2.TIPO_DOCUMENTO &&
          row1.DOCUMENTO === row2.DOCUMENTO &&
          row1.FECHA_CITA === row2.FECHA_CITA &&
          row1.ESPECIALIDAD === row2.ESPECIALIDAD,
      );
      if (match) {
        coincidencias.push({
          TIPO_DOCUMENTO: row1.TIPO_DOCUMENTO,
          DOCUMENTO: row1.DOCUMENTO,
          ESPECIALIDAD: row1.ESPECIALIDAD,
          FECHA_CITA: row1.FECHA_CITA,
        });
      } else {
        soloEnHO.push({
          TIPO_DOCUMENTO: row1.TIPO_DOCUMENTO,
          DOCUMENTO: row1.DOCUMENTO,
          ESPECIALIDAD: row1.ESPECIALIDAD,
          FECHA_CITA: row1.FECHA_CITA,
        });
      }
    });

    cocoFileData.forEach((row2) => {
      const match = hosvitalFileData.find(
        (row1) =>
          row1.TIPO_DOCUMENTO === row2.TIPO_DOCUMENTO &&
          row1.DOCUMENTO === row2.DOCUMENTO &&
          row1.FECHA_CITA === row2.FECHA_CITA &&
          row1.ESPECIALIDAD === row2.ESPECIALIDAD,
      );
      if (!match) {
        soloEnCO.push({
          TIPO_DOCUMENTO: row2.TIPO_DOCUMENTO,
          DOCUMENTO: row2.DOCUMENTO,
          ESPECIALIDAD: row2.ESPECIALIDAD,
          FECHA_CITA: row2.FECHA_CITA,
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
