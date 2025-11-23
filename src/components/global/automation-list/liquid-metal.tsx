"use client"

import { Canvas } from "@react-three/fiber"
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei"

function Blob() {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <MeshDistortMaterial
          color="#e2e8f0"
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.9}
          roughness={0.1}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  )
}

export function LiquidMetal() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <Environment preset="studio" />
      <Blob />
      <pointLight position={[10, 10, 10]} color="#38bdf8" intensity={2} />
      <pointLight position={[-10, -10, -10]} color="#f472b6" intensity={2} />
    </Canvas>
  )
}
