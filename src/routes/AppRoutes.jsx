import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout/MainLayout'
import CandidatesEntryPage from '../pages/CandidatesEntryPage/CandidatesEntryPage'
import HomePage from '../pages/HomePage/HomePage'
import KakaoCallbackPage from '../pages/KakaoCallbackPage/KakaoCallbackPage'
import LoginPage from '../pages/LoginPage/LoginPage'
import LostPetRegisterPage from '../pages/LostPetRegisterPage/LostPetRegisterPage'
import MatchesPage from '../pages/MatchesPage/MatchesPage'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import NotificationsPage from '../pages/NotificationsPage/NotificationsPage'
import SignupPage from '../pages/SignupPage/SignupPage'
import SplashPage from '../pages/SplashPage/SplashPage'
import StartPage from '../pages/StartPage/StartPage'
import GuestOnly from './GuestOnly'
import RequireAuth from './RequireAuth'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/start" element={<StartPage />} />
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
      <Route path="/oauth/kakao/callback" element={<KakaoCallbackPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/candidates" element={<CandidatesEntryPage />} />
          <Route path="/lost-pets/:lostPetId/matches" element={<MatchesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
        <Route path="/lost-pets/new" element={<LostPetRegisterPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
