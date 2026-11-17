import { NETWORK_ERROR_MESSAGE, UNKNOWN_ERROR_MESSAGE } from '../constants/errorMessages'
import { getAccessToken } from '../utils/tokenStorage'

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/v1`

let handleTokenExpired = () => {}

export function setTokenExpiredHandler(handler) {
  handleTokenExpired = handler
}

export class ApiError extends Error {
  constructor(message, code, status) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

function buildHeaders(body, extraHeaders) {
  const headers = { ...extraHeaders }
  const accessToken = getAccessToken()

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }
  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
}

function serializeBody(body) {
  if (body === undefined || body instanceof FormData) {
    return body
  }
  return JSON.stringify(body)
}

export async function request(path, { method = 'GET', body, headers } = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: buildHeaders(body, headers),
      body: serializeBody(body),
    })
  } catch {
    throw new ApiError(NETWORK_ERROR_MESSAGE, 'NETWORK_ERROR', 0)
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const code = payload?.code ?? 'UNKNOWN_ERROR'
    if (response.status === 401 && code === 'TOKEN_EXPIRED') {
      handleTokenExpired()
    }
    throw new ApiError(payload?.message ?? UNKNOWN_ERROR_MESSAGE, code, response.status)
  }

  return payload?.data ?? null
}
