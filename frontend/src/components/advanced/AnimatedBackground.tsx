import React from 'react'
import Particles from '@tsparticles/react'

export interface AnimatedBackgroundProps {
  className?: string
  preset?: 'dots' | 'lines' | 'triangles' | 'stars' | 'bubbles'
  color?: string
  density?: number
  speed?: number
}

const presetConfigs = {
  dots: {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: '#ffffff',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.5,
        random: false,
      },
      size: {
        value: 3,
        random: true,
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'none' as const,
        random: false,
        straight: false,
        outModes: {
          default: 'bounce' as const,
        },
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse' as const,
        },
        onClick: {
          enable: true,
          mode: 'push' as const,
        },
      },
    },
  },
  lines: {
    particles: {
      number: {
        value: 50,
      },
      color: {
        value: '#ffffff',
      },
      links: {
        enable: true,
        distance: 150,
        color: '#ffffff',
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 1,
      },
      size: {
        value: 2,
      },
      opacity: {
        value: 0.5,
      },
    },
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'grab' as const,
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 1,
          },
        },
      },
    },
  },
  triangles: {
    particles: {
      number: {
        value: 40,
      },
      color: {
        value: '#ffffff',
      },
      shape: {
        type: 'triangle',
      },
      opacity: {
        value: 0.3,
      },
      size: {
        value: 6,
      },
      move: {
        enable: true,
        speed: 1.5,
        direction: 'none' as const,
        random: true,
      },
    },
  },
  stars: {
    particles: {
      number: {
        value: 100,
      },
      color: {
        value: '#ffffff',
      },
      shape: {
        type: 'star',
      },
      opacity: {
        value: 0.8,
        random: true,
      },
      size: {
        value: 2,
        random: true,
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: 'none' as const,
        random: true,
      },
    },
  },
  bubbles: {
    particles: {
      number: {
        value: 30,
      },
      color: {
        value: '#ffffff',
      },
      shape: {
        type: 'circle',
      },
      opacity: {
        value: 0.3,
        random: true,
      },
      size: {
        value: 20,
        random: true,
      },
      move: {
        enable: true,
        speed: 2,
        direction: 'top' as const,
        straight: false,
        outModes: {
          default: 'out' as const,
        },
      },
    },
  },
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className,
  preset = 'dots',
  color = '#ffffff',
  density = 80,
  speed = 2,
}) => {

  const config = {
    ...presetConfigs[preset],
    particles: {
      ...presetConfigs[preset].particles,
      color: {
        value: color,
      },
      number: {
        ...presetConfigs[preset].particles.number,
        value: density,
      },
      move: {
        ...presetConfigs[preset].particles.move,
        speed,
      },
    },
  }

  return (
    <div className={className}>
      <Particles
        id="tsparticles"
        options={config}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  )
}

export { AnimatedBackground }