import CandidateDetailPage from '../pages/CandidateDetailPage/CandidateDetailPage'
import CandidatesPage from '../pages/CandidatesPage/CandidatesPage'
import EditRegistrationPage from '../pages/EditRegistrationPage/EditRegistrationPage'
import LostRegistrationPage from '../pages/LostRegistrationPage/LostRegistrationPage'
import MyRegistrationsPage from '../pages/MyRegistrationsPage/MyRegistrationsPage'
import { petPaths } from './petPaths'

export const petTabRoutes = [
  { path: petPaths.candidates, element: <CandidatesPage /> },
  { path: petPaths.registrations, element: <MyRegistrationsPage /> },
]

export const petRoutes = [
  { path: petPaths.candidateDetail, element: <CandidateDetailPage /> },
  { path: petPaths.newRegistration, element: <LostRegistrationPage /> },
  { path: petPaths.editRegistration, element: <EditRegistrationPage /> },
]
