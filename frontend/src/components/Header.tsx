'use client'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Link,
  Card,
  CardBody,
  CardFooter,
  Chip,
} from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Facet, HitsElastic } from '../interfaces/Search.interfaces'

interface Props {
  url: string
  // react useState function
  handleCardClick: (movie: HitsElastic) => void
}

export default function Header({ url, handleCardClick }: Props) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure()
  const [results, setResults] = useState<HitsElastic[]>([])
  const [didYouMean, setDidYouMean] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [facets, setFacets] = useState<Facet[]>([])
  const [hideFacets, setHideFacets] = useState<boolean>(false)

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'k' && !isOpen) {
        e.preventDefault()
        onOpen()
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        onClose()
      }
    })
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    makeSearch(e.target.value, getFilters())
    makeDidYouMean(e.target.value)
  }

  const makeSearch = (search: string, filters: string[]) => {
    fetch(`${url}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: search,
        field: 'title',
        filters: filters,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResults(data.hits.hits)
        makeFacets(data.aggregations)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const makeFacets = (aggregations: any) => {
    let facetsNew = []
    // for each of agregationss key vlaue
    Object.keys(aggregations).forEach((agg) => {
      aggregations[agg].buckets.forEach((bucket: any) => {
        let active = facets.find(
          (facet) => facet.key === bucket.key && facet.active,
        )
        facetsNew.push({
          field: agg,
          key: bucket.key,
          doc_count: bucket.doc_count,
          active: active,
        })
      })
    })
    setFacets(facetsNew)
  }

  const makeDidYouMean = (search: string) => {
    fetch(`${url}/search/didYouMean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: search,
        field: 'title',
        filters: [],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDidYouMean(getDidYouMean(data.suggest.my_suggestion))
      })
  }

  const getDidYouMean = (suggest: any): string => {
    let didYouMean = ''
    let errors = 0
    suggest.forEach((suggestion: any) => {
      if (suggestion.options.length > 0) {
        errors += 1
      }
      didYouMean +=
        suggestion.options.length > 0
          ? suggestion.options[0].text
          : suggestion.text
      didYouMean += ' '
    })
    return errors > 0 ? didYouMean : ''
  }

  const handleDidYouMean = () => {
    setSearch(didYouMean)
    setDidYouMean('')
    makeSearch(didYouMean, getFilters())
    makeDidYouMean(didYouMean)
  }

  const handleFilter = (facet: Facet) => {
    facet.active = !facet.active
    setFacets([...facets])
    console.log(getFilters())
    makeSearch(search, getFilters())
  }

  const getFilters = (): string[] => {
    return facets
      .filter((facet) => facet.active)
      .map((facet) => `${facet.field}:${facet.key}`)
  }

  return (
    <>
      <div
        className='bg-white flex w-full p-2 gap-16 rounded-lg items-center justify-between text-left hover:bg-gray-200 hover:cursor-pointer max-w-prose'
        onClick={onOpen}
      >
        <img src='/search.svg' width={16} className='m-1'></img>
        Search
        <Chip variant='solid' radius='sm' color='secondary'>
          ^K
        </Chip>
      </div>

      <Modal
        size={'5xl'}
        isOpen={isOpen}
        scrollBehavior='inside'
        onOpenChange={onOpenChange}
        closeButton={<></>}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col'>
                <div className='flex items-center gap-4 bg-gray-200 px-3 rounded-lg'>
                  <input
                    placeholder='Search'
                    className='w-full p-2 rounded-sm text-lg appearance-none focus:outline-none focus:ring-0 bg-gray-200'
                    onChange={handleChange}
                    value={search}
                    autoFocus={true}
                  />
                  <button
                    onClick={onClose}
                    className='text-sm h-min p-1 rounded-sm text-gray-200 bg-gray-900'
                  >
                    Esc
                  </button>
                </div>
                {didYouMean && (
                  <p className='text-sm pl-2'>
                    Did you mean:{' '}
                    <Link className='text-sm' onClick={handleDidYouMean}>
                      {didYouMean}
                    </Link>
                  </p>
                )}
                <div className='flex mt-2 gap-2'>
                  {facets.length > 0 && !hideFacets && (
                    <div className='flex flex-wrap gap-2'>
                      {facets.map((facet) => (
                        <Chip
                          key={facet.key}
                          variant={facet.active ? 'solid' : 'flat'}
                          color={
                            facet.field === 'genre' ? 'secondary' : 'primary'
                          }
                          className={`hover:cursor-pointer hover:bg-${facet.field === 'genre' ? 'secondary' : 'primary'} hover:text-white`}
                          radius='sm'
                          onClick={() => handleFilter(facet)}
                        >
                          {facet.key} ({facet.doc_count})
                        </Chip>
                      ))}
                      <Chip
                        key='clear'
                        variant='solid'
                        color='default'
                        radius='sm'
                        className='hover:cursor-pointer hover:bg-gray-200'
                        onClick={() => {
                          setFacets(
                            facets.map((facet) => {
                              facet.active = false
                              return facet
                            }),
                          )
                          makeSearch(search, [])
                        }}
                      >
                        Clear
                      </Chip>
                    </div>
                  )}
                  {facets.length > 0 && (
                    <Chip
                      key='toggle'
                      className='hover:cursor-pointer'
                      variant='solid'
                      color='default'
                      radius='sm'
                      onClick={() => setHideFacets(!hideFacets)}
                    >
                      {hideFacets ? 'Show facets' : 'Hide'}
                    </Chip>
                  )}
                </div>
              </ModalHeader>
              {results.length > 0 ? (
                <ModalBody className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
                  {results.map((result) => (
                    <Card
                      key={result._id}
                      className='h-max md:h-auto grid grid-cols-3 text-left'
                      isPressable={true}
                      onClick={() => handleCardClick(result)}
                    >
                      <CardBody className='col-span-1'>
                        <img
                          src={result._source.avatar.replace(
                            result._source.avatar.split('_UX')[1],
                            '256.jpg',
                          )}
                          className='w-20 h-auto round-sm mx-auto'
                          // center the image
                        />
                      </CardBody>
                      <CardFooter className='col-span-2'>
                        <div className='flex flex-col gap-1'>
                          <p className='text-sm font-bold'>
                            {result._source.title}
                          </p>
                          <p className='text-xs'>{result._source.director}</p>
                          <p className='text-xs'>
                            {result._source.genre.join(', ')}
                          </p>
                          <p className='text-xs'>{result._source.year}</p>
                          <Chip
                            className='text-xs w-fit text-center items-center justify-center p-2 gap-1'
                            variant='flat'
                            avatar={<img src='/stars.svg' width={16}></img>}
                          >
                            {result._score.toFixed(2)}
                          </Chip>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </ModalBody>
              ) : (
                <ModalBody
                  className='
                text-center p-5
                    '
                >
                  No results...
                </ModalBody>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
