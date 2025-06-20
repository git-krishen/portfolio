import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';


const EffectBackground = () => {
  return (
      <Canvas camera={{position: [0,0,3]}}>
        <Box />
        <ambientLight intensity={0.1} />
        <directionalLight position={[0, 0, 5]} color="blue" />
      </Canvas>
  );
};

export default EffectBackground;

const Box = () => {
  const boxRef = useRef();

  useFrame(() => {
    boxRef.current.rotation.x += 0.01;
    boxRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={boxRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
};

// import * as THREE from 'three';
// import { useEffect, useRef } from "react";

// // using three js
// function EffectBackground() {
//   const refContainer = useRef(null);
//   useEffect(() => {
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);

//     refContainer.current && refContainer.current.appendChild( renderer.domElement );

//     const geometry = new THREE.BoxGeometry(1, 1, 1);
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);

//     camera.position.z = 5;

//     function onWindowResize() {
//         const newWidth = window.innerWidth / 2;
//         const newHeight = window.innerHeight;
    
//         renderer.setSize(newWidth, newHeight)
      
//         camera.aspect = newWidth / newHeight
//         camera.updateProjectionMatrix();
//     }
    
//     window.addEventListener("resize", onWindowResize, false)

//     var animate = function() {
//       requestAnimationFrame(animate);
//       cube.rotation.x += 0.01;
//       cube.rotation.y += 0.01;
//       renderer.render(scene, camera);
//     };
//     animate();
//   }, []);

//   return (
//     <div ref={refContainer}></div>
//   );
// }

// export default EffectBackground