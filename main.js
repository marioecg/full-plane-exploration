import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import imgPath from '/uv.jpg';

import planeVertex from './plane.vert'
import planeFragment from './plane.frag'

import { Pane } from 'tweakpane'

import gsap from 'gsap'

/* -------------------------------------------------------------------------- */
/*                                     GUI                                    */
/* -------------------------------------------------------------------------- */
let PARAMS = {
  progress: 0,
}

let pane = new Pane()

pane.addBinding(PARAMS, 'progress', { label: 'progress', min: 0, max: 1, step: 0.01 })

/* -------------------------------------------------------------------------- */
/*                               Sketch settings                              */
/* -------------------------------------------------------------------------- */
let WIDTH = window.innerWidth
let HEIGHT = window.innerHeight
let PIXEL_RATIO = Math.max(window.devicePixelRatio, 2)

/* -------------------------------------------------------------------------- */
/*                                  Graphics                                  */
/* -------------------------------------------------------------------------- */
let canvas = document.querySelector('#gl')
let camera, scene, renderer
let planeGeometry, planeMaterial, plane
let controls, clock, time

let uniforms = {
  uTime: { value: 0 },
  uResolution: { value: new THREE.Vector2(WIDTH, HEIGHT) },
}

init()
requestAnimationFrame(render)

function init() {
  /* -------------------------------- Renderer -------------------------------- */
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setClearColor(0xffffff, 1)
  renderer.setPixelRatio(PIXEL_RATIO)

  /* --------------------------------- Camera --------------------------------- */
  camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000)
  camera.position.z = 1.5

  /* ---------------------------------- Scene --------------------------------- */
  scene = new THREE.Scene()

  /* ---------------------------------- Plane --------------------------------- */
  let texture = new THREE.TextureLoader().load(imgPath)
  planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32) // Make sure the plane has enough tessellation
  planeMaterial = new THREE.ShaderMaterial({
    vertexShader: planeVertex,
    fragmentShader: planeFragment,
    uniforms: {
      uTime: uniforms.uTime,
      tMap: { value: texture },
      uResolution: uniforms.uResolution,
      uProgress: { value: PARAMS.progress },
      uViewSize: { value: new THREE.Vector2(0, 0) },
      uAnimation: { value: 0 },
      uAnimation2: { value: 0 },
    },
    side: THREE.DoubleSide,
  })
  plane = new THREE.Mesh(planeGeometry, planeMaterial)

  scene.add(plane)

  /* ------------------------------- Scene utils ------------------------------ */
  controls = new OrbitControls(camera, canvas)
  clock = new THREE.Clock()

  /* ---------------------------------- Tween --------------------------------- */
  let tl = gsap.timeline({
    delay: 1
  })

  
  tl
    .to(planeMaterial.uniforms.uAnimation, {
      value: 1,
      duration: 2,
      ease: 'expo.inOut',
    })
    .to(planeMaterial.uniforms.uAnimation2, {
      value: 1,
      duration: 2,
      ease: 'power3.inOut',
    }, 0)

  gsap.delayedCall(4, () => tl.reverse())

  /* --------------------------------- Events --------------------------------- */
  resize()
  window.addEventListener('resize', resize, false)
}

function resize() {
  WIDTH = window.innerWidth
  HEIGHT = window.innerHeight

  camera.aspect = WIDTH / HEIGHT
  camera.updateProjectionMatrix()

  renderer.setSize(WIDTH, HEIGHT)  

  // Set and resize view size
  let { viewWidth, viewHeight } = getViewSize(camera)
  planeMaterial.uniforms.uViewSize.value.set(viewWidth, viewHeight)
}

function render() {
  requestAnimationFrame(render)

  time = clock.getElapsedTime()

  uniforms.uTime.value = time
  plane.material.uniforms.uProgress.value = PARAMS.progress

  renderer.render(scene, camera)
}

function getViewSize(camera) {
  const fovInRadians = (camera.fov * Math.PI) / 180
  const height = Math.abs(camera.position.z * Math.tan(fovInRadians / 2) * 2)

  return {
    viewWidth: height * camera.aspect,
    viewHeight: height,
  }
}
