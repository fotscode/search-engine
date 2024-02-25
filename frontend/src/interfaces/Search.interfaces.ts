export interface Movie {
  code: number
  title: string
  title_suggest: string
  genre: string[]
  director: string
  actors: string[]
  description: string
  year: number
  runtime: string
  rating: number
  votes: number
  revenue: string
  metascore: number
  certificate: string
  avatar: string
}

export interface HitsElastic {
  _id: string
  _index: string
  _score: number
  _source: Movie
}


export interface Facet {
  field: string
  key: string
  doc_count: number
  active: boolean
}
