import { IsNotEmpty } from 'class-validator';

export class UploadFilesDto {
  @IsNotEmpty()
  hosvital_file: Express.Multer.File;

  @IsNotEmpty()
  coco_file: Express.Multer.File;
}
