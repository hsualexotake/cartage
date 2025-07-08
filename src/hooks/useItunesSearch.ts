import { useState, useEffect, useCallback } from 'react'

interface ItunesTrack {
  trackId: number
  artistName: string
  trackName: string
  collectionName: string
  artworkUrl100: string
  previewUrl: string
  trackPrice: number
  currency: string
  trackTimeMillis: number
  releaseDate: string
  primaryGenreName: string
  kind: string // "song" for tracks, used for filtering
  wrapperType: string // "track" for songs
}

interface ItunesSearchResponse {
  resultCount: number
  results: ItunesTrack[]
}

export const useItunesSearch = (searchTerm: string, debounceMs: number = 300) => {
  const [tracks, setTracks] = useState<ItunesTrack[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchItunes = useCallback(async (term: string) => {
    if (!term.trim()) {
      setTracks([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      // iTunes Search API URL - filtering for songs only
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=50`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ItunesSearchResponse = await response.json()
      
      // Additional client-side filtering to ensure only songs are included
      const songsOnly = data.results.filter(item => {
        return (
          // Must be a song kind
          item.kind === 'song' &&
          // Must be a track wrapper type  
          item.wrapperType === 'track' &&
          // Must have a track ID and track name
          item.trackId &&
          item.trackName &&
          // Must have an artist name
          item.artistName
        )
      })
      
      setTracks(songsOnly)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching')
      setTracks([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce the search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchItunes(searchTerm)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, debounceMs, searchItunes])

  return { tracks, loading, error }
} 