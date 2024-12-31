import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadFilesService } from '../services/upload_files.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('upload-files')
@ApiBearerAuth()
@Controller('upload-files')
export class UploadFilesController {
  constructor(private uploadFilesService: UploadFilesService) {}

  // POST METHODS //

  @Post('/compareFiles')
  @UseInterceptors(
    FilesInterceptor('files', +process.env.MAXIMUM_NUMBER_OF_FILES),
  )
  async compareFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType:
              /^(application\/vnd\.ms\-excel|application\/vnd\.openxmlformats\-officedocument\.spreadsheetml\.sheet|application\/vnd\.ms\-excel\.sheet\.macroenabled\.12|application\/vnd\.ms\-excel\.sheet\.binary\.macroenabled\.12|application\/vnd\.openxmlformats\-officedocument\.spreadsheetml\.template|application\/vnd\.ms\-excel\.template\.macroenabled\.12)$/i,
          }),
          new MaxFileSizeValidator({
            maxSize: +process.env.MAXIMUM_FILE_SIZE_IN_BYTES,
            message: '¡El peso del archivo debe ser menor a 10MB!',
          }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    files: Express.Multer.File[],
  ) {
    if (files.length !== 2) {
      throw new HttpException(
        'Debes cargar exactamente 2 archivos.',
        HttpStatus.CONFLICT,
      );
    }

    const [file1, file2] = files;

    const file1Type = this.uploadFilesService.identifyFileType(file1.buffer);
    const file2Type = this.uploadFilesService.identifyFileType(file2.buffer);

    let hosvitalFile: Express.Multer.File;
    let cocoFile: Express.Multer.File;

    if (file1Type === 'coco' && file2Type === 'hosvital') {
      cocoFile = file1;
      hosvitalFile = file2;
    } else if (file1Type === 'hosvital' && file2Type === 'coco') {
      cocoFile = file2;
      hosvitalFile = file1;
    } else {
      throw new HttpException(
        'Error en los archivos cargados: No se encontró un archivo de Hosvital y uno de Coco.',
        HttpStatus.CONFLICT,
      );
    }

    return await this.uploadFilesService.compareFiles(
      hosvitalFile.buffer,
      cocoFile.buffer,
    );
  }

  // GET METHODS //

  @Get('/getAllFiles')
  async getAllFiles() {
    return await this.uploadFilesService.getAllFiles();
  }

  @Get('/getFileById/:id')
  async getFileById() {
    return await this.uploadFilesService.getFileById();
  }

  // PATCH METHODS //

  @Patch('/updateFile/:id')
  async updateFile() {
    return await this.uploadFilesService.updateFile();
  }

  @Patch('/banFiles/:id')
  async banFiles() {
    return await this.uploadFilesService.banFiles();
  }
}
