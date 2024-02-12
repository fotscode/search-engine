import { Module } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchController } from './search.controller'
import { ElasticsearchModule } from '@nestjs/elasticsearch'

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
