const COORD_TO_REGION_URL = 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json'

export async function fetchRegionByCoords({ latitude, longitude }) {

  const params = new URLSearchParams({ x: longitude, y: latitude })
  const response = await fetch(`${COORD_TO_REGION_URL}?${params}`, {
    headers: { Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}` },
  })
  if (!response.ok) {
    throw new Error('REGION_LOOKUP_FAILED')
  }

  const { documents = [] } = await response.json()
  const region = documents.find((document) => document.region_type === 'B') ?? documents[0]
  if (!region?.region_1depth_name) {
    throw new Error('REGION_LOOKUP_FAILED')
  }

  return {
    sido: region.region_1depth_name,
    sigungu: region.region_2depth_name || region.region_1depth_name,
    dong: region.region_3depth_name,
  }
}
