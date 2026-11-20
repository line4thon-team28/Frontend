import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './components/AuthProvider/AuthProvider'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
