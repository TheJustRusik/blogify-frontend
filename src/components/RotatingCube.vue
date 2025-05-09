<script setup>
import { onMounted, ref } from 'vue'
import * as THREE from 'three'
import { useTheme } from 'vuetify'

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

  // 🔹 Получаем цвет из темы Vuetify
  const theme = useTheme()
  const primaryHex = theme.global.current.value.colors.primary // например: "#1976D2"
  const primaryColor = new THREE.Color(primaryHex) // преобразуем в формат three.js

  // Создание геометрии куба
  const geometry = new THREE.BoxGeometry(1, 1, 1)

  // Полупрозрачный основной материал куба
  const cubeMaterial = new THREE.MeshBasicMaterial({
    color: primaryColor,
    opacity: 0.1,
    transparent: true
  })
  const cube = new THREE.Mesh(geometry, cubeMaterial)
  scene.add(cube)

  // Видимая рамка (wireframe) — тот же цвет
  const edges = new THREE.EdgesGeometry(geometry)
  const lineMaterial = new THREE.LineBasicMaterial({ color: primaryColor })
  const wireframe = new THREE.LineSegments(edges, lineMaterial)
  scene.add(wireframe)

  // Анимация
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

<template>
  <div ref="cubeContainer" class="cube-container"></div>
</template>

<style scoped>
.cube-container {
  width: 100px;
  height: 100px;
  background: transparent;
  overflow: hidden;
}
</style>