import { Module } from '@nestjs/common';
import { UploadFilesController } from './controllers/upload_files.controller';
import { UploadFilesService } from './services/upload_files.service';

@Module({
  controllers: [UploadFilesController],
  providers: [UploadFilesService],
})
export class UploadFilesModule {}
