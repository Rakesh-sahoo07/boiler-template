import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface GlobeProps {
  width?: number
  height?: number
  className?: string
  autoRotate?: boolean
  enableZoom?: boolean
  showCountries?: boolean
}

interface GlobeGeometryProps {
  autoRotate: boolean
  showCountries: boolean
}

function GlobeGeometry({ autoRotate, showCountries }: GlobeGeometryProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireframeRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2
    }
    if (autoRotate && wireframeRef.current) {
      wireframeRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group>
      {/* Main globe */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#0f172a"
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Wireframe overlay */}
      {showCountries && (
        <mesh ref={wireframeRef}>
          <sphereGeometry args={[2.01, 32, 32]} />
          <meshBasicMaterial
            color="#3b82f6"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Connection lines */}
      <group>
        {Array.from({ length: 20 }).map((_, i) => {
          const phi = Math.acos(-1 + (2 * i) / 20)
          const theta = Math.sqrt(20 * Math.PI) * phi
          const x = 2 * Math.cos(theta) * Math.sin(phi)
          const y = 2 * Math.sin(theta) * Math.sin(phi)
          const z = 2 * Math.cos(phi)
          
          return (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#60a5fa" />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

const Globe3D: React.FC<GlobeProps> = ({
  width = 400,
  height = 400,
  className,
  autoRotate = true,
  enableZoom = true,
  showCountries = true,
}) => {
  return (
    <div 
      className={className} 
      style={{ width, height }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />
        
        <GlobeGeometry 
          autoRotate={autoRotate} 
          showCountries={showCountries} 
        />
        
        <OrbitControls
          enableZoom={enableZoom}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
    </div>
  )
}

export { Globe3D }