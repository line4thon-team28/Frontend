import MainLayout from '../layouts/MainLayout/MainLayout'
import CandidateDetailPage from '../pages/CandidateDetailPage/CandidateDetailPage'
import CandidatesPage from '../pages/CandidatesPage/CandidatesPage'
import EditRegistrationPage from '../pages/EditRegistrationPage/EditRegistrationPage'
import LostRegistrationPage from '../pages/LostRegistrationPage/LostRegistrationPage'
import MyRegistrationsPage from '../pages/MyRegistrationsPage/MyRegistrationsPage'
import { petPaths } from './petPaths'

export const petRoutes = [
  {
    element: <MainLayout />,
    children: [
      { path: petPaths.candidates, element: <CandidatesPage /> },
      { path: petPaths.registrations, element: <MyRegistrationsPage /> },
    ],
  },
  { path: petPaths.candidateDetail, element: <CandidateDetailPage /> },
  { path: petPaths.newRegistration, element: <LostRegistrationPage /> },
  { path: petPaths.editRegistration, element: <EditRegistrationPage /> },
]
