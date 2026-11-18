import { useLayoutEffect } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthContext } from '../hooks/authContext'
import MainLayout from '../layouts/MainLayout/MainLayout'
import CandidateDetailPage from '../pages/CandidateDetailPage/CandidateDetailPage'
import CandidatesPage from '../pages/CandidatesPage/CandidatesPage'
import HomePage from '../pages/HomePage/HomePage'
import LostRegistrationPage from '../pages/LostRegistrationPage/LostRegistrationPage'
import MyRegistrationsPage, { EditRegistrationPage } from '../pages/MyRegistrationsPage/MyRegistrationsPage'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import PawPoseMockProvider from './PawPoseMockProvider'

const mockAuth = { user: { nickname: '민지' }, status: 'authenticated', isAuthenticated: true }

export default function MockPrototype() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <AuthContext.Provider value={mockAuth}>
      <PawPoseMockProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route element={<MainLayout />}>
            <Route path="/home" element={(
              <HomePage sightingPreview={<Link to="/candidates/sighting-jeongneung">38 목격 결과 상세 보기</Link>} />
            )} />
            <Route path="/candidates" element={<CandidatesPage />} />
            <Route path="/my" element={<MyRegistrationsPage />} />
          </Route>
          <Route path="/lost-pets/new" element={<LostRegistrationPage />} />
          <Route path="/candidates/:candidateId" element={<CandidateDetailPage />} />
          <Route path="/my/:petId/edit" element={<EditRegistrationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PawPoseMockProvider>
    </AuthContext.Provider>
  )
}
