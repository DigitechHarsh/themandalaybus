import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Scene3D() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const W = window.innerWidth
    const H = window.innerHeight

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(W, H)
    renderer.setClearColor(0x000000, 0)

    /* ── Scene & Camera ── */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100)
    camera.position.z = 5

    /* ── Bokeh Particle System ── */
    const COUNT = 200
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(COUNT * 3)
    const colors = new Float32Array(COUNT * 3)
    const baseY = new Float32Array(COUNT) // store original Y for oscillation

    const palette = [
      new THREE.Color('#FF9E00'),
      new THREE.Color('#E6B800'),
      new THREE.Color('#FFB347'),
      new THREE.Color('#FF6B35'),
      new THREE.Color('#FF3B30'),
      new THREE.Color('#FAF6F0'),
    ]

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 14
      const y = (Math.random() - 0.5) * 9
      const z = (Math.random() - 0.5) * 5
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      baseY[i] = y

      const c = palette[Math.floor(Math.random() * palette.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /* ── Circular sprite texture for bokeh look ── */
    const spriteCanvas = document.createElement('canvas')
    spriteCanvas.width = 64
    spriteCanvas.height = 64
    const sc = spriteCanvas.getContext('2d')
    const sg = sc.createRadialGradient(32, 32, 0, 32, 32, 32)
    sg.addColorStop(0, 'rgba(255,255,255,1)')
    sg.addColorStop(0.4, 'rgba(255,255,255,0.6)')
    sg.addColorStop(1, 'rgba(255,255,255,0)')
    sc.fillStyle = sg
    sc.fillRect(0, 0, 64, 64)
    const spriteTex = new THREE.CanvasTexture(spriteCanvas)

    const mat = new THREE.PointsMaterial({
      size: 0.18,
      map: spriteTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(geo, mat)
    scene.add(particles)

    /* ── Subtle steam wisps (larger, dimmer particles) ── */
    const STEAM_COUNT = 30
    const steamGeo = new THREE.BufferGeometry()
    const steamPos = new Float32Array(STEAM_COUNT * 3)
    const steamBaseY = new Float32Array(STEAM_COUNT)
    for (let i = 0; i < STEAM_COUNT; i++) {
      const x = (Math.random() - 0.5) * 10
      const y = (Math.random() - 0.5) * 7
      steamPos[i * 3] = x
      steamPos[i * 3 + 1] = y
      steamPos[i * 3 + 2] = (Math.random() - 0.5) * 3
      steamBaseY[i] = y
    }
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3))
    const steamMat = new THREE.PointsMaterial({
      size: 0.45,
      map: spriteTex,
      color: new THREE.Color('#aaaaaa'),
      transparent: true,
      opacity: 0.07,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const steamParticles = new THREE.Points(steamGeo, steamMat)
    scene.add(steamParticles)

    /* ── Mouse spring parallax ── */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    /* ── Resize ── */
    const onResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    /* ── Animation loop ── */
    let frameId
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Smooth mouse spring
      mouse.tx += (mouse.x - mouse.tx) * 0.035
      mouse.ty += (mouse.y - mouse.ty) * 0.035

      particles.rotation.y = mouse.tx * 0.12
      particles.rotation.x = mouse.ty * 0.06
      steamParticles.rotation.y = mouse.tx * 0.06
      steamParticles.rotation.x = mouse.ty * 0.03

      // Gentle upward drift for each particle with oscillation
      const posArr = geo.attributes.position.array
      const steamArr = steamGeo.attributes.position.array

      for (let i = 0; i < COUNT; i++) {
        posArr[i * 3 + 1] += 0.003
        if (posArr[i * 3 + 1] > 5) posArr[i * 3 + 1] = -5
        posArr[i * 3] += Math.sin(t * 0.2 + i * 0.3) * 0.001
      }
      geo.attributes.position.needsUpdate = true

      for (let i = 0; i < STEAM_COUNT; i++) {
        steamArr[i * 3 + 1] += 0.005
        if (steamArr[i * 3 + 1] > 4.5) steamArr[i * 3 + 1] = -4.5
      }
      steamGeo.attributes.position.needsUpdate = true

      // Subtle camera breathe
      camera.position.x = Math.sin(t * 0.1) * 0.05
      camera.position.y = Math.cos(t * 0.08) * 0.03

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      geo.dispose()
      mat.dispose()
      steamGeo.dispose()
      steamMat.dispose()
      spriteTex.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="scene-3d"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1, width: '100vw', height: '100vh' }}
      aria-hidden="true"
    />
  )
}
