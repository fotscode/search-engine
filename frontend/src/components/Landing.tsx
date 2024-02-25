'use client'
import { useState } from 'react'
import { HitsElastic } from '../interfaces/Search.interfaces'
import Header from './Header'

interface Props {
  url: string
}
export default function Landing({ url }: Props) {
  const [movie, setMovie] = useState<HitsElastic>()

  return (
    <>
      <Header url={url} handleCardClick={setMovie} />
      <section className='min-h-screen text-white'>
        {movie && (
          <div className='flex flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold'>Movie</h1>
            <div className='flex flex-col items-center justify-center'>
              <img
                src={movie._source.avatar.replace(
                  movie._source.avatar.split('_UX')[1],
                  '1080.jpg',
                )}
                alt={movie._source.title}
                className='w-1/4 h-1/4'
              />
              <h2 className='text-2xl font-bold'>{movie._source.title}</h2>
              <p>{movie._source.description}</p>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
