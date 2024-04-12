import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import planeVertex from './plane.vert'
import planeFragment from './plane.frag'

import { Pane } from 'tweakpane'


/* -------------------------------------------------------------------------- */
/*                                     GUI                                    */
/* -------------------------------------------------------------------------- */
let PARAMS = {
  progress: 0,
}

let pane = new Pane()

pane.addBinding(PARAMS, 'progress', { label: 'progress', min: 0, max: 1, step: 0.1 })

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
  planeGeometry = new THREE.PlaneGeometry(1, 1)
  planeMaterial = new THREE.ShaderMaterial({
    vertexShader: planeVertex,
    fragmentShader: planeFragment,
    uniforms: {
      uTime: uniforms.uTime,
      uResolution: uniforms.uResolution,
      uProgress: { value: PARAMS.progress },
    },
  })
  plane = new THREE.Mesh(planeGeometry, planeMaterial)

  scene.add(plane)

  /* ------------------------------- Scene utils ------------------------------ */
  controls = new OrbitControls(camera, canvas)
  clock = new THREE.Clock()

  /* --------------------------------- Events --------------------------------- */
  resize()
  window.addEventListener('resize', resize, false)
}

function resize() {
  camera.aspect = WIDTH / HEIGHT
  camera.updateProjectionMatrix()

  renderer.setSize(WIDTH, HEIGHT)
}

function render() {
  requestAnimationFrame(render)

  time = clock.getElapsedTime()

  uniforms.uTime.value = time

  renderer.render(scene, camera)
}
