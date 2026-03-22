import './App.css'
import { Login } from './components/Login/Login'

function App() {
  const handleLogin = async (credentials: { username: string; password: string }) => {
    console.log('Logging in with:', credentials.username)
  }

  return <Login onLogin={handleLogin} />
}

export default App
