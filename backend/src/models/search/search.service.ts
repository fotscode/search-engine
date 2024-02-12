import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { SearchDto } from './SearchDto'

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  didYouMean(searchDto: SearchDto) {
    return this.elasticsearchService.search({
      index: 'premios',
      suggest: {
        my_suggestion: {
          text: searchDto.text,
          term: {
            field: searchDto.field,
            suggest_mode: 'missing',
          },
        },
      },
    })
  }

  search(searchDto: SearchDto) {
    return this.elasticsearchService.search({
      index: 'premios',
      query: {
        match: {
          [searchDto.field]: searchDto.text,
        },
      },
    })
  }
}
