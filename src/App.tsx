import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/ui/footer'
import { Github, Twitter, MessageSquare, Home, Users, Settings, Search, Music, Clock, Heart } from 'lucide-react'
import { useItunesSearch } from '@/hooks/useItunesSearch'

// Define the track interface to match our hook
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
  kind: string
  wrapperType: string
}

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<ItunesTrack[]>([])
  const [favoritesLoaded, setFavoritesLoaded] = useState(false)
  const { tracks, loading, error } = useItunesSearch(searchTerm)

  // Load search term from URL on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchFromUrl = urlParams.get('search')
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl)
    }
  }, [])

  // Update URL when search term changes
  useEffect(() => {
    const url = new URL(window.location.href)
    if (searchTerm) {
      url.searchParams.set('search', searchTerm)
    } else {
      url.searchParams.delete('search')
    }
    // Update URL without page reload
    window.history.replaceState({}, '', url.toString())
  }, [searchTerm])

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('itunes-favorites')
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Failed to load favorites from localStorage:', error)
      }
    }
    setFavoritesLoaded(true)
  }, [])

  // Save favorites to localStorage whenever favorites change (but not on initial load)
  useEffect(() => {
    if (favoritesLoaded) {
      localStorage.setItem('itunes-favorites', JSON.stringify(favorites))
    }
  }, [favorites, favoritesLoaded])

  const toggleFavorite = (track: ItunesTrack) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(fav => fav.trackId === track.trackId)
      
      if (isAlreadyFavorite) {
        // Remove from favorites
        return prevFavorites.filter(fav => fav.trackId !== track.trackId)
      } else {
        // Add to favorites
        return [...prevFavorites, track]
      }
    })
  }

  const isFavorite = (trackId: number) => {
    return favorites.some(fav => fav.trackId === trackId)
  }

  const formatDuration = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(price)
  }

  const renderTrackCard = (track: ItunesTrack) => (
    <div key={track.trackId} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Album Artwork */}
        <div className="flex-shrink-0">
          <img
            src={track.artworkUrl100}
            alt={`${track.collectionName} artwork`}
            className="w-16 h-16 rounded-lg object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f3f4f6"/><text x="50" y="50" text-anchor="middle" dominant-baseline="middle" fill="%236b7280" font-family="Arial" font-size="12">No Image</text></svg>';
            }}
          />
        </div>

        {/* Track Info */}
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-lg truncate">{track.trackName}</h3>
          <p className="text-gray-600 truncate">{track.artistName}</p>
          <p className="text-gray-500 text-sm truncate">{track.collectionName}</p>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(track.trackTimeMillis)}
            </span>
            <span>{track.primaryGenreName}</span>
            <span>{formatPrice(track.trackPrice, track.currency)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {/* Favorite Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleFavorite(track)}
            className={`flex items-center gap-2 ${
              isFavorite(track.trackId) 
                ? 'text-red-600 border-red-300 hover:bg-red-50' 
                : 'hover:text-red-600'
            }`}
          >
            <Heart 
              className={`w-4 h-4 ${isFavorite(track.trackId) ? 'fill-current' : ''}`} 
            />
            {isFavorite(track.trackId) ? 'Favorited' : 'Favorite'}
          </Button>

          {/* Preview Button */}
          {track.previewUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const audio = new Audio(track.previewUrl);
                audio.play().catch(console.error);
              }}
              className="flex items-center gap-2"
            >
              <Music className="w-4 h-4" />
              Preview
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content Section */}
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Music className="w-10 h-10 text-blue-600" />
              iTunes Search App
            </h1>
            <p className="text-gray-600">
              Search and discover music from the iTunes catalog
            </p>
          </header>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for songs, artists, albums... (e.g., Michael Jackson)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
            
            {/* Search Stats */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <span>
                {loading ? 'Searching...' : searchTerm ? `${tracks.length} song${tracks.length !== 1 ? 's' : ''} found` : `${favorites.length} favorite song${favorites.length !== 1 ? 's' : ''}`}
              </span>
              {searchTerm && (
                <span>Search term: "{searchTerm}"</span>
              )}
            </div>
          </div>

          {/* Results Section */}
          <main className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">Error: {error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Searching iTunes...</p>
              </div>
            )}

            {/* No Results */}
            {!loading && searchTerm && tracks.length === 0 && !error && (
              <div className="text-center py-8">
                <Music className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No songs found for "{searchTerm}"</p>
                <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
              </div>
            )}

            {/* Search Results */}
            {!loading && searchTerm && tracks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Search Results</h2>
                <div className="grid gap-4">
                  {tracks.map(renderTrackCard)}
                </div>
              </div>
            )}

            {/* Favorites Display - When no search term */}
            {!searchTerm && favorites.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-600 fill-current" />
                  Your Favorite Songs
                </h2>
                <div className="grid gap-4">
                  {favorites.map(renderTrackCard)}
                </div>
              </div>
            )}

            {/* Empty State - When no search term and no favorites */}
            {!searchTerm && favorites.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Favorites Yet</h3>
                <p className="text-gray-600">Search for music and click the heart icon to save your favorite songs</p>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Try searching for: "Michael Jackson", "The Beatles", "Taylor Swift"</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer
        className="bg-white border-t mt-16"
        brand={{
          name: "iTunes Search App",
          description: "Discover music from the iTunes catalog."
        }}
        socialLinks={[
          { name: "GitHub", href: "https://github.com" },
          { name: "Twitter", href: "https://twitter.com" },
          { name: "Discord", href: "https://discord.com" }
        ]}
        columns={[
          {
            title: "Product",
            links: [
              { name: "Home", Icon: Home, href: "/" },
              { name: "About", Icon: Users, href: "/about" },
              { name: "Contact", Icon: MessageSquare, href: "/contact" }
            ]
          },
          {
            title: "Resources",
            links: [
              { name: "Documentation", Icon: Settings, href: "/docs" },
              { name: "GitHub", Icon: Github, href: "https://github.com" },
              { name: "Support", Icon: Twitter, href: "/support" }
            ]
          }
        ]}
        copyright="© 2024 iTunes Search App. All rights reserved."
      />
    </div>
  )
}

export default App
