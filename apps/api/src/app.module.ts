import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

require('dotenv').config();

import { UploadFilesModule } from './upload_files/upload_files.module';

@Module({
  imports: [UploadFilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
