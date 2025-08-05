# React TypeScript Boilerplate

A modern, production-ready React boilerplate with TypeScript, Tailwind CSS, and Web3 integration.

## 🚀 Features

### Frontend Stack
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for rapid, responsive styling
- **React Router** for client-side routing
- **Vite** for fast development and optimized builds

### UI Components
- Pre-built component library with consistent design
- Toast notifications system
- Form components with validation
- Cards, buttons, inputs, and more
- Responsive design out of the box

### Web3 Integration
- **Wagmi** for Ethereum integration
- **WalletConnect** and **MetaMask** support
- Multi-network support (Ethereum, Polygon, Arbitrum, etc.)
- Smart contract interaction utilities
- Transaction management

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone this template**
   ```bash
   git clone <your-repo-url>
   cd your-project-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🛠 Customization

### 1. Update Project Details
- Change the project name in `package.json`
- Update the app title in `index.html`
- Modify the logo and branding in `App.tsx`

### 2. Configure Styling
- Edit Tailwind configuration in `tailwind.config.js`
- Customize CSS variables in `src/index.css`
- Modify component styles as needed

### 3. Web3 Configuration
- Update Web3 settings in `src/lib/web3-config.ts`
- Add your WalletConnect project ID
- Configure supported networks
- Update smart contract addresses

### 4. Add Your Content
- Replace the homepage content in `src/pages/HomePage.tsx`
- Add new pages in the `src/pages/` directory
- Update routing in `src/App.tsx`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── layout/         # Layout components
│   ├── feedback/       # Toast, modals, etc.
│   ├── forms/          # Form components
│   └── web3/           # Web3-specific components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── pages/              # Page components
└── contracts/          # Smart contract ABIs
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

## 🌐 Web3 Usage

### Connect Wallet
```tsx
import { WalletConnect } from './components/web3'

function MyComponent() {
  return <WalletConnect />
}
```

### Use Web3 Hooks
```tsx
import { useAccount, useBalance } from 'wagmi'

function MyComponent() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  
  return (
    <div>
      {isConnected && <p>Balance: {balance?.formatted}</p>}
    </div>
  )
}
```

## 📱 Deployment

### Vercel
1. Connect your repository to Vercel
2. Deploy with zero configuration

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder

### Other Platforms
Build the project and deploy the `dist` folder to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Wagmi Documentation](https://wagmi.sh)
- [Vite Documentation](https://vitejs.dev)
