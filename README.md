# Boiler Template

A comprehensive full-stack boilerplate template with React frontend and smart contract integration.

## Project Structure

```
├── frontend/          # React frontend with Vite
├── smart-contracts/   # Solidity smart contracts (to be added)
└── README.md
```

## Frontend Features

### Tech Stack
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS v4** with PostCSS integration
- **Radix UI** complete component library
- **Framer Motion** for animations
- **Three.js & React Three Fiber** for 3D graphics
- **Class Variance Authority** for component variants
- **Zod** for schema validation
- **React Hook Form** for form management

### Component Library

#### Layout Components
- **Navbar** - Responsive navigation with mobile menu
- **Footer** - Flexible footer with sections and links

#### UI Components
- **Button** - Multiple variants with loading states and icons
- **Card** - Flexible card component with header, content, and footer
- **Input** - Form input with label, error states, and icons
- **Select** - Dropdown select with search and keyboard navigation
- **Checkbox** - Checkbox with label and description support
- **Switch** - Toggle switch with customizable sizes

#### Display Components
- **BentoGrid** - Masonry-style grid layout for dashboards
- **Carousel** - Image/content carousel with auto-play and navigation

#### Feedback Components
- **Toast** - Notification system with success, error, warning, and info variants
- **Modal** - Accessible modal with focus management and keyboard navigation

#### Advanced Components
- **CommandPalette** - Searchable command interface with keyboard shortcuts (⌘K)
- **Globe3D** - Interactive 3D globe with WebGL rendering
- **AnimatedBackground** - Particle system backgrounds with multiple presets

### Design System Features

#### CSS Variables
All colors, fonts, spacing, and other design tokens are defined as CSS variables in `:root`, making the entire design system fully customizable:

- **Colors**: Primary, secondary, accent, destructive, muted, etc.
- **Typography**: Font families, sizes, and line heights
- **Spacing**: Consistent spacing scale
- **Shadows**: Elevation system
- **Animation**: Duration constants
- **Z-index**: Layering system

#### Component Architecture
- **Generic Components**: No hardcoded values, all configurable
- **Small Components**: Each component under 50 lines as requested
- **Consistent API**: All components follow similar prop patterns
- **TypeScript**: Full type safety with variant props
- **Accessibility**: ARIA labels, keyboard navigation, focus management

## Getting Started

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 to view the component showcase

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## Component Usage Examples

### Button Component
```tsx
import { Button } from './components/ui'

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="secondary" size="lg">Large Secondary</Button>

// With loading state
<Button loading>Processing...</Button>

// With icons
<Button leftIcon={<Icon />}>With Icon</Button>
```

### Toast Notifications
```tsx
import { ToastProvider, useToastActions } from './components/feedback'

function App() {
  return (
    <ToastProvider position="top-right">
      <MyComponent />
    </ToastProvider>
  )
}

function MyComponent() {
  const { success, error } = useToastActions()
  
  return (
    <Button onClick={() => success('Success!', 'Operation completed')}>
      Show Toast
    </Button>
  )
}
```

### Bento Grid Layout
```tsx
import { BentoGrid, BentoItem, BentoHeader, BentoTitle } from './components/display'

<BentoGrid columns={3}>
  <BentoItem size="md" width="md">
    <BentoHeader>
      <BentoTitle>Large Feature</BentoTitle>
    </BentoHeader>
    <BentoContent>
      {/* Your content */}
    </BentoContent>
  </BentoItem>
</BentoGrid>
```

## Customization

### Theme Colors
Modify the CSS variables in `src/index.css` to customize the entire theme:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}
```

### Component Variants
Add new variants to any component by extending the `variants` object in the component's `cva` definition.

## Next Steps

### Smart Contracts (Planned)
- Solidity contracts with Hardhat setup
- Deployment scripts
- Integration with frontend
- Web3 connectivity

### Additional Components (Planned)
- Select/Dropdown
- Checkbox/Radio groups
- Data tables
- Charts and graphs
- Form validation
- Loading states

## Contributing

This is a boilerplate template designed to be customized for your specific needs. Feel free to:
- Add new components following the established patterns
- Extend existing components with new variants
- Customize the design system variables
- Add additional features and integrations

## License

MIT License - Feel free to use this template for any project.