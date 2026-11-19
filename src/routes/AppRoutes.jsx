import { Route, Routes } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout/MainLayout'
import HomePage from '../pages/HomePage/HomePage'
import KakaoCallbackPage from '../pages/KakaoCallbackPage/KakaoCallbackPage'
import LoginPage from '../pages/LoginPage/LoginPage'
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage'
import SightingReportPage from '../pages/SightingReportPage/SightingReportPage'
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
      <Route path="/sightings/new" element={<SightingReportPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
