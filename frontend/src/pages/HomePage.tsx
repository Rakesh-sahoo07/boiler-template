import { Button, Card, CardHeader, CardTitle, CardContent } from '../components/ui'
import { SimpleWalletConnect } from '../components/web3/SimpleWalletConnect'

export function HomePage() {
  console.log('HomePage');
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Your Project
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          A modern React boilerplate with TypeScript, Tailwind CSS, and Web3 integration.
          Start building your application with pre-configured tools and components.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">Documentation</Button>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Customize</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Update the project name, colors, and branding in the configuration files.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>2. Build</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use the pre-built components and utilities to create your application.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>3. Deploy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Deploy your application using Vercel, Netlify, or your preferred hosting platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What's Included */}
      <section>
        <h2 className="text-2xl font-bold mb-6">What's Included</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Frontend Stack</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• React 18 with TypeScript</li>
              <li>• Tailwind CSS for styling</li>
              <li>• React Router for navigation</li>
              <li>• Pre-built UI components</li>
              <li>• Toast notifications</li>
              <li>• Form handling utilities</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Web3 Integration</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Wallet connection (MetaMask, WalletConnect)</li>
              <li>• Multi-network support</li>
              <li>• Smart contract interaction</li>
              <li>• ERC20 & NFT utilities</li>
              <li>• Transaction management</li>
              <li>• Web3 React hooks</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Web3 Demo */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Web3 Integration</h2>
        <Card>
          <CardHeader>
            <CardTitle>Wallet Connection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Connect your MetaMask wallet to test Web3 functionality.
            </p>
            <SimpleWalletConnect />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}