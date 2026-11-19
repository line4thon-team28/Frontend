import { useEffect, useRef, useState } from 'react'

function revokePreviews(urls) {
  for (const url of urls) URL.revokeObjectURL(url)
  urls.clear()
}

export default function usePhotoPreviews({ limit, prepareFile }) {
  const [photos, setPhotos] = useState([])
  const currentPhotos = useRef([])
  const ownedUrls = useRef(new Set())
  const generation = useRef(0)

  useEffect(() => {
    const urls = ownedUrls.current
    return () => {
      generation.current += 1
      revokePreviews(urls)
    }
  }, [])

  function publish(nextPhotos) {
    currentPhotos.current = nextPhotos
    setPhotos(nextPhotos)
  }

  async function addPhotos(files) {
    const startedIn = generation.current
    const selected = files.slice(0, limit - currentPhotos.current.length)
    const results = prepareFile
      ? await Promise.allSettled(selected.map(async file => prepareFile(file)))
      : selected.map(value => ({ status: 'fulfilled', value }))
    if (startedIn !== generation.current) return null

    const prepared = results.flatMap(result => result.status === 'fulfilled' ? [result.value] : [])
    const available = limit - currentPhotos.current.length
    const added = prepared.slice(0, available).map(file => {
      const url = URL.createObjectURL(file)
      ownedUrls.current.add(url)
      return { file, name: file.name, url }
    })
    if (added.length) publish([...currentPhotos.current, ...added])

    return {
      added: added.length,
      rejected: prepared.length < selected.length,
      limitReached: selected.length < files.length || prepared.length > available,
    }
  }

  function removePhoto(url) {
    if (ownedUrls.current.delete(url)) URL.revokeObjectURL(url)
    publish(currentPhotos.current.filter(photo => photo.url !== url))
  }

  function clearPhotos() {
    generation.current += 1
    revokePreviews(ownedUrls.current)
    publish([])
  }

  return { photos, addPhotos, removePhoto, clearPhotos }
}
