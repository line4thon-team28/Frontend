import { KAKAO_RETURN_PATH_KEY } from '../constants/storageKeys'

const KAKAO_AUTHORIZE_URL = 'https://kauth.kakao.com/oauth/authorize'

export function startKakaoLogin(returnPath) {
  if (returnPath) {
    sessionStorage.setItem(KAKAO_RETURN_PATH_KEY, returnPath)
  } else {
    sessionStorage.removeItem(KAKAO_RETURN_PATH_KEY)
  }

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_KAKAO_REST_API_KEY ?? '',
    redirect_uri: `${window.location.origin}/oauth/kakao/callback`,
    response_type: 'code',
  })
  window.location.assign(`${KAKAO_AUTHORIZE_URL}?${params}`)
}

export function takeKakaoReturnPath() {
  const returnPath = sessionStorage.getItem(KAKAO_RETURN_PATH_KEY)
  sessionStorage.removeItem(KAKAO_RETURN_PATH_KEY)
  return returnPath
}
