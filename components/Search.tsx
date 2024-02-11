'use client'

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
  auth: string
  url: string
}

export default function Search({ auth, url }: Props) {
  const [results, setResults] = useState<HitsElastic[]>([])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetch(`${url}/premios/_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        query: {
          match: {
            Film: e.target.value,
          },
        },
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
  return (
    <section className='flex flex-col justify-top items-center min-h-screen pt-20'>
      <div className='input-glowing'>
        <input type='text' placeholder='Search' onChange={handleChange} />
      </div>
      {results.length != 0 && (
        <>
          <h2 className='text-3xl mt-5 text-white'>Results</h2>
          <ul className='w-[15em] p-[0.5em] text-[1.5em] rounded-[5px] bg-white mt-5'>
            {results.map((result) => (
              <li key={result._id} className='flex justify-between'>
                <span>{result._source.Film}</span>
                <span>{result._score.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
