import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
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
  constructor(private usersService: UploadFilesService) {}

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
            fileType: process.env.FILE_TYPES_ALLOWED,
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
    const [hosvitalFile, cocoFile] = files;

    return await this.usersService.compareFiles(
      hosvitalFile.buffer,
      cocoFile.buffer,
    );
  }

  // GET METHODS //

  @Get('/getAllFiles')
  async getAllFiles() {
    return await this.usersService.getAllFiles();
  }

  @Get('/getFileById/:id')
  async getFileById() {
    return await this.usersService.getFileById();
  }

  // PATCH METHODS //

  @Patch('/updateFile/:id')
  async updateFile() {
    return await this.usersService.updateFile();
  }

  @Patch('/banFiles/:id')
  async banFiles() {
    return await this.usersService.banFiles();
  }
}
