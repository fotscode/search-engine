import { Body, Controller, Post } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchDto } from './SearchDto'

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Post()
  search(@Body() searchDto: SearchDto) {
    return this.searchService.search(searchDto)
  }

  @Post('didYouMean')
  didYouMean(@Body() searchDto: SearchDto) {
    return this.searchService.didYouMean(searchDto)
  }
}
