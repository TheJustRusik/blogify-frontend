<template>
    <div ref="cubeContainer" class="cube-container"></div>
  </template>
  
  <script setup>
  import { onMounted, ref } from 'vue'
  import * as THREE from 'three'
  
  const cubeContainer = ref(null)
  
  onMounted(() => {
    const width = cubeContainer.value.clientWidth
    const height = cubeContainer.value.clientHeight
  
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 3
  
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0) // transparent background
    cubeContainer.value.appendChild(renderer.domElement)
  
    // Create cube geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1)
  
    // Add transparent cube body for visual effect
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.1, transparent: true })
    const cube = new THREE.Mesh(geometry, cubeMaterial)
    scene.add(cube)
  
    // Create visible wireframe edges
    const edges = new THREE.EdgesGeometry(geometry)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
    const wireframe = new THREE.LineSegments(edges, lineMaterial)
    scene.add(wireframe)
  
    // Animate
    function animate() {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      wireframe.rotation.x = cube.rotation.x
      wireframe.rotation.y = cube.rotation.y
      renderer.render(scene, camera)
    }
  
    animate()
  })
  </script>
  
  <style scoped>
  .cube-container {
    width: 100px;
    height: 100px;
    background: transparent;
    overflow: hidden;
  }
  </style>
  