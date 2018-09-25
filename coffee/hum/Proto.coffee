`import Util  from '../util/Util.js'`
`import Vis   from '../vis/Vis.js'`
`import Cube  from '../hum/Cube.js'`
`import Rect  from '../hum/Rect.js'`
`import Build from '../hum/Build.js'`
`import Act   from '../hum/Act.js'`
`import Gui   from '../hum/Gui.js'`

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
cubePos1      =  cubeSize + cubeSpacing
cubePos2      = 0
cubePos3      = -cubeSize - cubeSpacing

studySize     = cubeSize    / 3
ss            = studySize
sd            =  ss
sx            = { center:0, west:-sd,  north:0, east:sd, south:0  }
sy            = { center:0, west:0,  north:-sd, east:0,  south:sd }

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
  build = new Build()

  cs = cubeSize
  for plane     in [ {name:'Information', z:cubePos1}, {name:'Knowledge', z:cubePos2}, {name:'Wisdom',   z:cubePos3} ]
    for row     in [ {name:'Learn',       y:cubePos1}, {name:'Do',        y:cubePos2}, {name:'Share',    y:cubePos3} ]
      for col   in [ {name:'Embrace',     x:cubePos3}, {name:'Innovate',  x:cubePos2}, {name:'Encourage',x:cubePos1} ]
        practice = build.getPractice( plane.name, row.name, col.name )
        studies  = build.getStudies(  plane.name, practice.name )
        pracCube = new Cube( plane.name, row.name, col.name, practice.name, [col.x,row.y * modelRatio,plane.z], [cs,cs,cs],practice.hsv, 0.6 )
        scene.add( pracCube.mesh  )
        scene.add( pracCube.tmesh )
        for key, study of studies
          x = col.x              + sx[study.dir]
          y = row.y * modelRatio + sy[study.dir]
          z = plane.z
          s = cubeSize / 3
          studyCube = new Rect( plane.name, row.name, col.name, study.name, [x,y,z], [s,s,s],study.hsv, 1.0 )
          scene.add( studyCube.mesh )

  renderer = new THREE.WebGLRenderer( { antialias: true, alpha:true, transparent:true } )
  renderer.setPixelRatio( window['devicePixelRatio'] )
  renderer.setSize( screenWidth, screenHeight )
  container.appendChild( renderer.domElement )

  act = new Act( scene )
  gui = new Gui( act   )
  noop( gui )

  renderer.domElement.addEventListener 'mousemove', onMouseMove
  renderer.domElement.addEventListener 'mousedown', onMouseDown

  return

onMouseMove = (e) ->
  mouse.x = ( e.clientX - screenWidth/2  ) / 2
  mouse.y = ( e.clientY - screenHeight/2 ) / 2
  return

onMouseMove2 = (e) ->
  mouse.x =   e.clientX # - screenWidth  / 2
  mouse.y = ( e.clientY  ) * aspectRatio
  return

onMouseDown = (e) ->
  onMouseMove( e )
  console.log( 'onMouseDown',  { xm:mouse.x, ym: mouse.y, xs:e.clientX, ys:e.clientY } )
  #scene.traverse( (child) -> reveal(child) )
  return

reveal = (child) ->
  console.log( 'reveal',  { name:child.name, camera:camera.position.z, child:child.position.z } )
  child.visible = Math.abs( camera.position.z - child.position.z ) < 1000

# child.visible = camera.position.distanceToSquared(child.position) < 100

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

