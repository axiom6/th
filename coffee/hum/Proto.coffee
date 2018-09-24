`import Util  from '../util/Util.js'`
`import Vis   from '../vis/Vis.js'`
`import Cube  from '../hum/Cube.js'`

container = undefined
stats = undefined
camera = undefined
controls = undefined
scene = undefined
renderer = undefined

mouse = new (THREE.Vector2)
offset = new (THREE.Vector3)(10, 10, 10)

cubeSize      = 144
cubeScale     = cubeSize    / 4
cubeSpacing   = cubeSize    * 2 / 3
cubeMargin    = cubeSpacing / 2

baseSize      = (cubeSize+cubeSpacing) * 3
cubePos1      = -cubeSize - cubeSpacing
cubePos2      = 0
cubePos3      =  cubeSize + cubeSpacing

studySize     = cubeSize    / 3
ss            = studySize
sd            =  ss
sx            = [0,-sd,  0,sd, 0]
sy            = [0,  0,-sd, 0,sd]

canvasWidth   = baseSize
canvasHeight  = baseSize
canvasDepth   = baseSize
screenWidth   = 0
screenHeight  = 0
screenDepth   = 0
aspectRatio   = 1
modelRatio    = 1

applyVertexColors = (geometry, color) ->
  position = geometry.attributes.position
  colors = []
  i = 0
  while i < position.count
    colors.push color.r, color.g, color.b
    i++
  geometry.addAttribute 'color', new (THREE.Float32BufferAttribute)(colors, 3)
  return


init = ->

  resizeScreen()
  container = document.getElementById('container')
  camera = new (THREE.PerspectiveCamera)(70, aspectRatio, 1, 10000 )
  camera.position.z = 1000

  controls = new (THREE.TrackballControls)(camera)
  controls.rotateSpeed = 1.0
  controls.zoomSpeed = 1.2
  controls.panSpeed = 0.8
  controls.noZoom = false
  controls.noPan = false
  controls.staticMoving = true
  controls.dynamicDampingFactor = 0.3

  scene = new (THREE.Scene)
  scene.background = new (THREE.Color)(0x333333)

  scene.add new (THREE.AmbientLight)(0x555555)
  light = new (THREE.SpotLight)(0xffffff, 1.5)
  light.position.set 0, 500, 2000
  scene.add light

  axes = new THREE.AxesHelper( 1000 )
  scene.add( axes )

  for plane     in [ {name:'Information',z:cubePos1}, {name:'Knowledge',z:cubePos2}, {name:'Wisdom',   z:cubePos3} ]
    for row     in [ {name:'Learn',      y:cubePos1}, {name:'Do',       y:cubePos2}, {name:'Share',    y:cubePos3} ]
      for col   in [ {name:'Embrace',    x:cubePos1}, {name:'Innovate', x:cubePos2}, {name:'Encourage',x:cubePos3} ]
        pracCube = new Cube( "Title", [col.x,row.y * modelRatio,plane.z], [0,0,0], [cubeSize,cubeSize,cubeSize],[90,90,90] )
        scene.add( pracCube.mesh )

  renderer = new (THREE.WebGLRenderer)(antialias: true)
  renderer.setPixelRatio( window['devicePixelRatio'] )
  renderer.setSize( screenWidth, screenHeight )
  container.appendChild( renderer.domElement )

  renderer.domElement.addEventListener 'mousemove', onMouseMove
  renderer.domElement.addEventListener 'mousedown', onMouseDown

  return

onMouseMove = (e) ->
  mouse.x = e.clientX
  mouse.y = e.clientY
  return

onMouseMove2 = (e) ->
  mouse.x =   e.clientX # - screenWidth  / 2
  mouse.y = ( e.clientY  ) * aspectRatio
  return

onMouseDown = (e) ->
  onMouseMove( e )
  console.log( 'onMouseDown',  { xm:mouse.x, ym: mouse.y, xs:e.clientX, ys:e.clientY } )
  return

animate = ->
  requestAnimationFrame( animate )
  render()
  #stats.update()
  return

resizeScreen = () ->
  screenWidth  = window.innerWidth
  screenHeight = window.innerHeight
  screenDepth  = baseSize
  aspectRatio  = screenWidth  / screenHeight
  modelRatio   = aspectRatio  / 2

onWindowResize = () ->
  resizeScreen()
  camera.aspect = aspectRatio
  camera.updateProjectionMatrix()
  renderer.setSize( screenWidth, screenHeight )

render = ->
  controls.update()
  #pick()
  renderer.render( scene, camera )
  return

noop = (arg) ->
  if arg == false
    console.log 'noop', arg
  return

Util.ready ->
  init()
  animate()

