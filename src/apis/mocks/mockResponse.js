export function mockResponse(data, delayMs = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs)
  })
}
