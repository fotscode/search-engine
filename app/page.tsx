import Search from '../components/Search'

export default function Page() {
  return (
    <div className="min-h-screen">
      <Search
        auth={btoa(
          `${process.env.ELASTIC_USERNAME}:${process.env.ELASTIC_PASSWORD}`,
        )}
        url={process.env.ELASTIC_URL}
      />
    </div>
  )
}
