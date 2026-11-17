import { request } from './client'

export function fetchMe() {
  return request('/auth/me')
}
