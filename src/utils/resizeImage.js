const DEFAULT_MAX_SIDE = 1600
const JPEG_QUALITY = 0.85

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('IMAGE_DECODE_FAILED'))
    }
    image.src = url
  })
}

export async function resizeImage(file, maxSide = DEFAULT_MAX_SIDE) {
  const image = await loadImage(file)
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight))
  const width = Math.round(image.naturalWidth * scale)
  const height = Math.round(image.naturalHeight * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d').drawImage(image, 0, 0, width, height)

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
  if (!blob) {
    throw new Error('IMAGE_ENCODE_FAILED')
  }

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo'
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' })
}
