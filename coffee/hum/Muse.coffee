`import Util  from '../util/Util.js'`
`import Vis   from '../vis/Vis.js'`
`import Cube  from '../hum/Cube.js'`
`import Rect  from '../hum/Rect.js'`
`import Build from '../hum/Build.js'`
`import Act   from '../hum/Act.js'`
`import Gui   from '../hum/Gui.js'`

scene    = undefined
camera   = undefined
renderer = undefined
threejs  = undefined

WIDTH    = 0
HEIGHT   = 0
mesh     = undefined
color    = 0xAA55DD
material = undefined
controls = undefined
gui      = undefined
act      = undefined

Util.ready ->
  WIDTH = window.innerWidth
  HEIGHT = window.innerHeight
  init()
  animate()
  return

de2ra = (degree) ->
 degree*(Math.PI/180)

onWindowResize = () ->
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight )
  return

init = () ->
  threejs = document.getElementById('Ikw')
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer({antialias:true})
  renderer.setSize(WIDTH, HEIGHT)
  renderer.setClearColor( 0x000000, 1) # 0x333F47, 1
  renderer.shadowMapEnabled = true
  renderer.shadowMapSoft = true

  threejs.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1 , 1000);
  camera.position.set(0, 6, 6);
  camera.lookAt(scene.position);
  scene.add(camera)

  axes = new THREE.AxesHelper( 2 )
  scene.add( axes )
  
  faces()
  ground()
  lights()
  ui()

  controls = new THREE.OrbitControls(camera, renderer.domElement )
  window.addEventListener( 'resize', onWindowResize, false )
  return

geom = () ->

  geometry = new THREE.BoxGeometry( 2, 2, 2 )
  material = new THREE.MeshLambertMaterial({ ambient:color, color:color, transparent:true } )
  mesh     = new THREE.Mesh(geometry, material)
  mesh.position.set(0, 0, 0)
  mesh.rotation.set(0, 0, 0)
  mesh.rotation.y = de2ra(-90)
  mesh.scale.set(1, 1, 1)
  mesh.doubleSided = true
  mesh.castShadow = true
  scene.add(mesh)

  geometry2 = new THREE.BoxGeometry( 1, 1, 1 )
  material2 = new THREE.MeshLambertMaterial({ ambient:color, color:color, transparent:true } )
  mesh2     = new THREE.Mesh(geometry2, material2)
  scene.add(mesh2)
  return

faces = ( ) ->
  color = 0x888888
  ang   = Math.PI / 2
  material = new THREE.MeshLambertMaterial( { ambient:color, color:color, transparent:true, opacity:0.5, side:THREE.DoubleSide } )
  front = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material )
  back  = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material )
  west  = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material ).rotateY( ang )
  east  = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material ).rotateY( ang )
  north = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material ).rotateX( ang )
  south = new THREE.Mesh( new THREE.PlaneGeometry( 2, 2 ), material ).rotateX( ang )
  front.position.z =  1
  back .position.z = -1
  west .position.x = -1
  east .position.x =  1
  north.position.y =  1
  south.position.y = -1

  geometry2 = new THREE.BoxGeometry( 1, 1, 1 )
  material2 = new THREE.MeshLambertMaterial({ ambient:color, color:color, transparent:true } )
  mesh2     = new THREE.Mesh(geometry2, material2)

  mesh      = new THREE.Group().add( front ).add( back ).add( west ).add( east ).add( north ).add( south).add( mesh2 )
  mesh.material = material
  scene.add(mesh)
  return

ground = () ->

  planeGeometry = new THREE.BoxGeometry( 10, 10, 0.1 );
  planeMaterial = new THREE.MeshLambertMaterial({ color:0xffffff, ambient:0x000000, side:THREE.DoubleSide } )

  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  planeMesh.position.set(0, -3, 0)
  planeMesh.rotation.set(0, 0, 0)
  planeMesh.rotation.x = de2ra(90)
  planeMesh.receiveShadow = true
  scene.add(planeMesh)
  return
  
lights = () ->

  object3d  = new THREE.DirectionalLight('white', 0.15)
  object3d.position.set(6,3,9)
  object3d.name = 'Back light'
  scene.add(object3d)
  
  object3d = new THREE.DirectionalLight('white', 0.35);
  object3d.position.set(-6, -3, 0)
  object3d.name   = 'Key light'
  scene.add(object3d)
  
  object3d = new THREE.DirectionalLight('white', 0.55)
  object3d.position.set(9, 9, 6)
  object3d.name = 'Fill light'
  scene.add(object3d)
  
  spotLight = new THREE.SpotLight( 0xffffff )
  spotLight.position.set( 3, 30, 3 )
  spotLight.castShadow = true
  spotLight.shadowMapWidth = 2048
  spotLight.shadowMapHeight = 2048
  spotLight.shadowCameraNear = 1
  spotLight.shadowCameraFar = 4000
  spotLight.shadowCameraFov = 45
  scene.add( spotLight )
  return

act = {
  scaleX:1,
  scaleY:1,
  scaleZ:1,
  positionX:0,
  positionY:0,
  positionZ:0,
  rotationX:0,
  rotationY:90,
  rotationZ:0,
  boxColor:color,
  castShadow:true,
  boxOpacity:0.6
}

ui = () ->

  gui = new dat.GUI()

  console.log( 'act', act, color )

  gui.add( act, 'boxOpacity', 0.1, 1.0 ).onChange( () -> mesh.material.opacity = act.boxOpacity )

  f1 = gui.addFolder('Scale')
  f1.add( act, 'scaleX', 0.1, 5 ).onChange( () -> mesh.scale.x = act.scaleX )
  f1.add( act, 'scaleY', 0.1, 5 ).onChange( () -> mesh.scale.y = act.scaleY )
  f1.add( act, 'scaleZ', 0.1, 5 ).onChange( () -> mesh.scale.z = act.scaleZ )

  f2 = gui.addFolder('Position');
  f2.add( act, 'positionX', -5, 5 ).onChange( () -> mesh.position.x = act.positionX )
  f2.add( act, 'positionY', -3, 5 ).onChange( () -> mesh.position.y = act.positionY )
  f2.add( act, 'positionZ', -5, 5 ).onChange( () -> mesh.position.z = act.positionZ )

  f3 = gui.addFolder('Rotation')
  f3.add( act, 'rotationX', -180, 180 ).onChange( () -> mesh.rotation.x = de2ra(act.rotationX) )
  f3.add( act, 'rotationY', -180, 180 ).onChange( () -> mesh.rotation.y = de2ra(act.rotationY) )
  f3.add( act, 'rotationZ', -180, 180 ).onChange( () -> mesh.rotation.z = de2ra(act.rotationZ) )

  gui.addColor( act, 'boxColor',   color    ).onChange( () -> mesh.material.color.setHex( dec2hex(act.boxColor) ) )
  gui.add(      act, 'castShadow', false    ).onChange( () -> mesh.castShadow  = act.castShadow )

  return

dec2hex = ( i ) ->
  result = "0x000000"
  if      i >= 0     and i <=      15 then result = "0x00000" + i.toString(16)
  else if i >= 16    and i <=     255 then result = "0x0000" + i.toString(16)
  else if i >= 256   and i <=    4095 then result = "0x000" + i.toString(16)
  else if i >= 4096  and i <=   65535 then result = "0x00" + i.toString(16)
  else if i >= 65535 and i <= 1048575 then result = "0x0" + i.toString(16)
  else if i >= 1048575                then result = "0x" + i.toString(16)
  result

animate = () ->
  requestAnimationFrame(animate);
  controls.update();
  renderScene()
  return

renderScene = () ->
  renderer.render(scene, camera)
  return
