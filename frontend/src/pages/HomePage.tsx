import { Button, Card, CardHeader, CardTitle, CardContent } from '../components/ui'

export function HomePage() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center px-4 py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-gray-800/20 pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Your Project
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            A modern React boilerplate with TypeScript, Tailwind CSS, and Web3 integration.
            Start building your application with pre-configured tools and components.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 border border-blue-600 hover:border-blue-700">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg border-gray-600 hover:bg-gray-800 hover:border-gray-500">
              Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="px-4 py-16">
        <div className="max-w-full mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Quick Start</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group h-64 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-blue-500">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <CardTitle className="text-xl">1. Customize</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 leading-relaxed">
                  Update the project name, colors, and branding in the configuration files to match your vision.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group h-64 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-green-500">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0h6" />
                  </svg>
                </div>
                <CardTitle className="text-xl">2. Build</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 leading-relaxed">
                  Use the pre-built components and utilities to create your amazing application.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group h-64 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 hover:border-purple-500">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <CardTitle className="text-xl">3. Deploy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 leading-relaxed">
                  Deploy your application using Vercel, Netlify, or your preferred hosting platform.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bento Grid - What's Included */}
      <section className="px-4 py-16">
        <div className="max-w-full mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
            
            {/* Large Feature Card */}
            <div className="md:col-span-2 lg:col-span-3 group">
              <Card className="h-80 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-2 border-gray-700 hover:border-blue-500 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20">
                <CardContent className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Modern Frontend</h3>
                    <p className="text-gray-400">React 18 with TypeScript, Tailwind CSS, and a complete component library ready for production.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">React 18</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">TypeScript</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Tailwind</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Web3 Card */}
            <div className="md:col-span-2 lg:col-span-3 group">
              <Card className="h-80 bg-gradient-to-br from-purple-600/10 to-blue-600/10 border-2 border-gray-700 hover:border-purple-500 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
                <CardContent className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Web3 Ready</h3>
                    <p className="text-gray-400">Complete Web3 integration with wallet connection, smart contracts, and multi-network support.</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">MetaMask</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Ethers.js</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Multi-chain</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Small Feature Cards */}
            <div className="md:col-span-2 lg:col-span-2 group">
              <Card className="h-48 bg-gradient-to-br from-green-600/10 to-gray-800/10 border border-gray-700 hover:border-green-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/20">
                <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500/30 transition-colors">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">Production Ready</h3>
                  <p className="text-sm text-gray-400">Optimized build and deployment configurations</p>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2 lg:col-span-2 group">
              <Card className="h-48 bg-gradient-to-br from-yellow-600/10 to-gray-800/10 border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/20">
                <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500/30 transition-colors">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">Lightning Fast</h3>
                  <p className="text-sm text-gray-400">Vite-powered development with hot reload</p>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2 lg:col-span-2 group">
              <Card className="h-48 bg-gradient-to-br from-pink-600/10 to-gray-800/10 border border-gray-700 hover:border-pink-500 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-pink-500/20">
                <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-500/30 transition-colors">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold mb-2">Developer Experience</h3>
                  <p className="text-sm text-gray-400">Beautiful components and intuitive APIs</p>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16">
        <div className="max-w-full mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "What technologies are included in this boilerplate?",
                answer: "This boilerplate includes React 18, TypeScript, Tailwind CSS, Web3 integration with ethers.js, and a complete UI component library."
              },
              {
                question: "Is this suitable for production applications?",
                answer: "Yes, this boilerplate is production-ready with optimized builds, proper TypeScript configurations, and security best practices."
              },
              {
                question: "How do I customize the styling and branding?",
                answer: "You can customize colors, fonts, and branding by modifying the CSS variables in index.css and updating the components as needed."
              },
              {
                question: "What Web3 features are supported?",
                answer: "The boilerplate supports MetaMask wallet connection, multi-network switching, smart contract interactions, and transaction management."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors bg-gray-900/50">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-800/50 transition-colors">
                  <h3 className="font-semibold text-lg">{faq.question}</h3>
                  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-gray-400 animate-in slide-in-from-top-2 duration-300">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}