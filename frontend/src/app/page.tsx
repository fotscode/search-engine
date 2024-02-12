import Search from '../components/Search'

export default function Page() {
  return (
    <div className="min-h-screen">
      <Search
        url={process.env.BACKEND_URL}
      />
    </div>
  )
}
