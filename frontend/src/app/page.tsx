import Header from '../components/Header'

export default function Page() {
  return (
    <>
      <Header url={process.env.BACKEND_URL} />
      <section className='min-h-screen'></section>
    </>
  )
}
