import { request } from './client'

export function fetchMe() {
  return request('/auth/me')
}

export function login({ email, password }) {
  return request('/auth/login', { method: 'POST', body: { email, password } })
}

export function kakaoLogin(code) {
  return request('/auth/kakao', { method: 'POST', body: { code } })
}
