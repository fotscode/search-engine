import Search from './Search'

interface Props{
  url: string
}
export default function Header({url}: Props) {
  return (
    <header id="header-nav" className='fixed w-screen p-4 bg-black text-black h-24 bg-transparent z-50'>
      <div className='flex justify-center items-center'>
        <Search url={url} />
      </div>
    </header>
  )
}
