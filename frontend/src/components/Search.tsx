'use client'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Link,
} from '@nextui-org/react'
import { useState } from 'react'
interface HitsElastic {
  _id: string
  _index: string
  _score: number
  _source: Premio
}

interface Premio {
  Actor: string
  Age: string
  Film: string
  Sex: string
  Year: string
  duration: string
  genre1: string
  genre2: string
  nominations: string
  rating: string
  release: string
  synopsis: string
}

interface Props {
  url: string
}

export default function Search({ url }: Props) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [results, setResults] = useState<HitsElastic[]>([])
  const [didYouMean, setDidYouMean] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    makeSearch(e.target.value)
    makeDidYouMean(e.target.value)
  }

  const makeSearch = (search: string) => {
    fetch(`${url}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: search,
        field: 'Film',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setResults(data.hits.hits)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const makeDidYouMean = (search: string) => {
    fetch(`${url}/search/didYouMean`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: search,
        field: 'Film',
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
    makeSearch(didYouMean)
    makeDidYouMean(didYouMean)
  }

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} closeButton={<></>}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col '>
                <div className='flex items-center gap-4'>
                  <input
                    placeholder='Search'
                    // auto focus
                    className='w-full p-2 rounded-sm text-lg
                  appearance-none focus:outline-none focus:ring-0

                  '
                    onChange={handleChange}
                    value={search}
                    // make able to close when pressing esc
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
              </ModalHeader>
              <ModalBody>
                {results.length > 0 ? (
                  results.map((result) => (
                    <div key={result._id}>
                      <p>{result._source.Film}</p>
                      <p>{result._source.Actor}</p>
                    </div>
                  ))
                ) : (
                  <p
                    className='
                text-center p-5
                    '
                  >
                    No results...
                  </p>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
