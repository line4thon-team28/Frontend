import { lazy, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './components/AuthProvider/AuthProvider'
import AppRoutes from './routes/AppRoutes'

const MockPrototype = import.meta.env.DEV && import.meta.env.MODE === 'mock'
  ? lazy(() => import('./mocks/MockPrototype'))
  : null

export default function App() {
  return (
    <BrowserRouter>
      {MockPrototype ? (
        <Suspense fallback={null}><MockPrototype /></Suspense>
      ) : (
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      )}
    </BrowserRouter>
  )
}
