import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { SearchDto } from './SearchDto'

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  didYouMean(searchDto: SearchDto) {
    return this.elasticsearchService.search({
      index: 'movies',
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
      index: 'movies',
      // aggregate genre and certificate only by searched text query top 10
      body: {
        size: 10,
        query: this.getQueryFiltered(searchDto),
        aggs: {
          genre: {
            terms: {
              field: 'genre.keyword',
              size: 10,
            },
          },
          certificate: {
            terms: {
              field: 'certificate.keyword',
              size: 10,
            },
          },
        },
      },
    })
  }

  getQueryFiltered(searchDto: SearchDto) {
    return {
      bool: {
        must: {
          match: {
            [searchDto.field]: searchDto.text,
          },
        },
        filter: searchDto.filters.map((filter) => {
          return {
            bool: {
              should: filter.split(',').map((fieldValue) => {
                const [field, value] = fieldValue.split(':')
                return {
                  term: {
                    [field + '.keyword']: value,
                  },
                }
              }),
            },
          }
        }),
      },
    }
  }
}
