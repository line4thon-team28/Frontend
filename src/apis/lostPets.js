import { request } from './client'

export function fetchMyLostPets() {
  return request('/lost-pets/me')
}
