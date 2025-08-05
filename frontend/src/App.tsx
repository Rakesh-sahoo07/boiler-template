import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastProvider } from './components/feedback/ToastProvider'
import { SimpleWeb3Provider } from './contexts/SimpleWeb3Context'
import { Navbar, NavLogo, NavItem } from './components/layout'
import { HomePage } from './pages/HomePage'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar>
        <NavLogo>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">YP</span>
          </div>
          <span>Your Project</span>
        </NavLogo>
        <NavItem href="/">Home</NavItem>
        {/* Add more navigation items as needed */}
      </Navbar>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <SimpleWeb3Provider>
      <ToastProvider position="top-right">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* Add more routes as needed */}
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </SimpleWeb3Provider>
  )
}

export default App