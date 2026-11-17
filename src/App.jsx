import { Route, Routes } from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
