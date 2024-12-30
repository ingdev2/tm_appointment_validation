import { PartialType } from '@nestjs/swagger';
import { UploadFilesDto } from './upload_files.dto';

export class UpdateUserPatientDto extends PartialType(UploadFilesDto) {}
