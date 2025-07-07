import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/ui/footer'
import { Github, Twitter, MessageSquare, Home, Users, Settings } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content Section */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              My React App
            </h1>
            <p className="text-gray-600">
              Built with React, TypeScript, Tailwind CSS & shadcn/ui
            </p>
          </header>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Demo Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-4">Interactive Demo</h2>
              <div className="flex items-center justify-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => setCount(count - 1)}
                >
                  -
                </Button>
                <span className="text-2xl font-bold min-w-[3rem] text-center">{count}</span>
                <Button 
                  variant="default"
                  onClick={() => setCount(count + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Features Grid - Easy to extend */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Feature 1</h3>
                <p className="text-gray-600">Add your content here</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Feature 2</h3>
                <p className="text-gray-600">Add your content here</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-2">Feature 3</h3>
                <p className="text-gray-600">Add your content here</p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <Footer
        className="bg-white border-t"
        brand={{
          name: "My React App",
          description: "A clean, modern React application."
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
        copyright="© 2024 My React App. All rights reserved."
      />
    </div>
  )
}

export default App
