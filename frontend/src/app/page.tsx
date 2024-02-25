import Header from '../components/Header'
import Landing from '../components/Landing'

export default function Page() {
  return <Landing url={process.env.BACKEND_URL}/>
}
