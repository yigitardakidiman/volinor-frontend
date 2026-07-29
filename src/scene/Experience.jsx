/**
 * Experience.jsx
 * React Three Fiber (R3F) Canvas bileşenini içerir.
 * Tüm 3D sahnelerin (ışıklandırma, çevre, gölgeler, kameralar ve modeller)
 * render edildiği ana 3D motor dosyasıdır.
 */
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Center,
  ContactShadows,
  Ring,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { BeeModel } from "./BeeModel";
import { BeeController } from "./BeeController";
import { SimulationObstacles } from "./SimulationObstacles";
import { WindParticles } from "./WindParticles";
import { useConfigStore } from "../store/useConfigStore";
import { useIsMobile } from "../hooks/useIsMobile";

export const Experience = () => {
  const controlsRef = useRef();
  const selectedModel = useConfigStore((state) => state.selectedModel);
  const selectedPart = useConfigStore((state) => state.selectedPart);
  const isMobile = useIsMobile();

  return (
    <Canvas
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 1.5]}
      camera={{ position: isMobile ? [2.1, 0.3, 2.1] : [1.5, 0.2, 1.5], fov: 45 }}
      className="bg-transparent"
      performance={{ min: 0.5 }}>
      <fog attach="fog" args={["#020202", 12, 45]} />

      <Suspense fallback={null}>
        {/* City ışığına geri dönüldü, binaların tamamen silinmesi için çözünürlük ekstrem şekilde düşürüldü */}
        <Environment
          preset="city"
          resolution={2}
          blur={1}
          environmentIntensity={0.8}
        />

        <ambientLight intensity={1.0} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={2.5}
          castShadow
          shadow-mapSize={512}
        />
        <spotLight
          position={[-5, 5, -5]}
          intensity={3.5}
          color="#ffffff"
          penumbra={1}
          distance={20}
        />

        <Center position={[0, 0.3, 0]}>
          <group visible={selectedModel === "bee"}>
            <BeeModel scale={0.005} />
          </group>
        </Center>

        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.8}
          scale={10}
          blur={2}
          far={4}
          resolution={256}
          color="#000000"
          frames={1}
        />

        {selectedPart === "subtitle2" && (
          <group position={[0, -0.79, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Inner Ring */}
            <Ring args={[0.9, 0.91, 64]}>
              <meshBasicMaterial color="#ffb800" transparent opacity={0.6} side={THREE.DoubleSide} />
            </Ring>
            {/* Outer Ring */}
            <Ring args={[1.25, 1.26, 64]}>
              <meshBasicMaterial color="#ffb800" transparent opacity={0.4} side={THREE.DoubleSide} />
            </Ring>

            {/* Small accent dots on the rings */}
            <mesh position={[0.905, 0, 0]}><circleGeometry args={[0.02, 16]} /><meshBasicMaterial color="#ffb800" transparent opacity={0.8} /></mesh>
            <mesh position={[-0.905, 0, 0]}><circleGeometry args={[0.02, 16]} /><meshBasicMaterial color="#ffb800" transparent opacity={0.8} /></mesh>
            
            <mesh position={[0, 1.255, 0]}><circleGeometry args={[0.03, 16]} /><meshBasicMaterial color="#ffb800" transparent opacity={0.6} /></mesh>
            <mesh position={[0, -1.255, 0]}><circleGeometry args={[0.03, 16]} /><meshBasicMaterial color="#ffb800" transparent opacity={0.6} /></mesh>
          </group>
        )}

        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={false}
          enableZoom={true}
          enableRotate={!isMobile}
          minDistance={1}
          maxDistance={20}
          maxPolarAngle={Math.PI}
          autoRotate={selectedPart !== "subtitle2" && selectedPart !== "subtitle4"}
          autoRotateSpeed={1}
        />
        {selectedModel === "bee" && <BeeController controlsRef={controlsRef} />}
        
        {selectedPart !== "subtitle4" && <WindParticles count={150} />}
      </Suspense>
    </Canvas>
  );
};
