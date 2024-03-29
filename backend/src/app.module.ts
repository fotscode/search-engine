import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './models/search/search.module';

@Module({
  imports: [SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
