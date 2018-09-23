`import Util       from '../util/Util.js'`
`import Vis        from '../vis/Vis.js'`
#`import * as THREE from '../lib/three.module.js'`


container = undefined
stats = undefined
camera = undefined
scene = undefined
renderer = undefined
cube = undefined
plane = undefined
targetRotation = 0
targetRotationOnMouseDown = 0
mouseX = 0
mouseXOnMouseDown = 0
windowHalfX = window.innerWidth / 2
windowHalfY = window.innerHeight / 2

init = () ->
# container = document.getElementById('Proto')
# console.log( 'container', container )
# document.appendChild container
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  info = document.createElement('div')
  info.style.position = 'absolute'
  info.style.top = '10px'
  info.style.width = '100%'
  info.style.textAlign = 'center'
  info.innerHTML = 'Drag to spin the cube'
  container.appendChild info
  camera = new (THREE.PerspectiveCamera)(70, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.y = 150
  camera.position.z = 500
  scene = new (THREE.Scene)
  scene.background = new (THREE.Color)(0xf0f0f0)
  # Cube
  geometryc = new (THREE.BoxGeometry)(200, 200, 200)
  i = 0
  while i < geometryc.faces.length
    hex = Math.random() * 0xffffff
    geometryc.faces[i].color.setHex hex
    geometryc.faces[i + 1].color.setHex hex
    i += 2
  materialc = new (THREE.MeshBasicMaterial)(
    vertexColors: THREE.FaceColors
    overdraw: 0.5)
  cube = new (THREE.Mesh)(geometryc, materialc)
  cube.position.y = 150
  scene.add cube
  # Plane
  geometryp = new (THREE.PlaneBufferGeometry)(200, 200)
  geometryp.rotateX -Math.PI / 2
  materialp = new (THREE.MeshBasicMaterial)(
    color: 0xe0e0e0
    overdraw: 0.5)
  plane = new (THREE.Mesh)(geometryp, materialp)
  scene.add plane
  renderer = new (THREE.CanvasRenderer)
  renderer.setPixelRatio window['devicePixelRatio']
  renderer.setSize window.innerWidth, window.innerHeight
  container.appendChild renderer.domElement
  stats = new Stats
  container.appendChild stats.dom
  document.addEventListener 'mousedown', onDocumentMouseDown, false
  document.addEventListener 'touchstart', onDocumentTouchStart, false
  document.addEventListener 'touchmove', onDocumentTouchMove, false
  #
  window.addEventListener 'resize', onWindowResize, false
  return

onWindowResize = () ->
  windowHalfX = window.innerWidth / 2
  windowHalfY = window.innerHeight / 2
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize window.innerWidth, window.innerHeight
  return

#

onDocumentMouseDown = (event) ->
  event.preventDefault()
  document.addEventListener 'mousemove', onDocumentMouseMove, false
  document.addEventListener 'mouseup', onDocumentMouseUp, false
  document.addEventListener 'mouseout', onDocumentMouseOut, false
  mouseXOnMouseDown = event.clientX - windowHalfX
  targetRotationOnMouseDown = targetRotation
  return

onDocumentMouseMove = (event) ->
  mouseX = event.clientX - windowHalfX
  targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02
  return

onDocumentMouseUp = (event) ->
  noop event
  document.removeEventListener 'mousemove', onDocumentMouseMove, false
  document.removeEventListener 'mouseup', onDocumentMouseUp, false
  document.removeEventListener 'mouseout', onDocumentMouseOut, false
  return

onDocumentMouseOut = (event) ->
  noop event
  document.removeEventListener 'mousemove', onDocumentMouseMove, false
  document.removeEventListener 'mouseup', onDocumentMouseUp, false
  document.removeEventListener 'mouseout', onDocumentMouseOut, false
  return

onDocumentTouchStart = (event) ->
  if event.touches.length == 1
    event.preventDefault()
    mouseXOnMouseDown = event.touches[0].pageX - windowHalfX
    targetRotationOnMouseDown = targetRotation
  return

onDocumentTouchMove = (event) ->
  if event.touches.length == 1
    event.preventDefault()
    mouseX = event.touches[0].pageX - windowHalfX
    targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05
  return

#

animate = () ->
  requestAnimationFrame animate
  # stats.begin()
  render()
  # stats.end()
  return

render = () ->
  plane.rotation.y = cube.rotation.y += (targetRotation - (cube.rotation.y)) * 0.05
  renderer.render scene, camera
  return

noop = (arg) ->
  if arg == false
    console.log 'noop', arg
  return

Util.ready ->
  init()
  animate()