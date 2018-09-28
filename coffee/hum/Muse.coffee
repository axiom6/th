`import Util  from '../util/Util.js'`
`import Vis   from '../vis/Vis.js'`
`import Cube  from '../hum/Cube.js'`
`import Rect  from '../hum/Rect.js'`
`import Build from '../hum/Build.js'`
`import Act   from '../hum/Act.js'`
`import Gui   from '../hum/Gui.js'`


Util.ready ->
  @muse = new Muse()
  @muse.animate()
  return

class Muse

  constructor:() ->

    [@screenWidth,@screenHeight,@aspectRatio] = @resizeScreen()
    @ikwElem = document.getElementById('Ikw')
    @scene   = new THREE.Scene()

    @renderer = new THREE.WebGLRenderer( { antialias:true } )
    @renderer.setSize( @screenWidth, @screenHeight )
    @renderer.setClearColor( 0x000000, 1) # 0x333F47, 1
    @renderer.shadowMap.enabled = true
    @renderer.shadowMapSoft = true

    @ikwElem.appendChild( @renderer.domElement );

    @camera = new THREE.PerspectiveCamera( 45, @aspectRatio, 1 , 10000 )
    @camera.position.set( 0, 6, 1200 )
    @camera.lookAt( @scene.position )
    @scene.add(@camera)

    @axes = new THREE.AxesHelper( 2 )
    @scene.add( @axes )

    @fontJSON = Build.syncJSON( 'webfonts/helvetiker_regular.typeface.json' )
    @fontPrac = new THREE.Font( @fontJSON )

    #@faces()
    #@ground()
    @group = @ikw()
    @lights()
    [@gui,@act] = @ui( @group )

    @controls = new THREE.OrbitControls( @camera, @renderer.domElement )
    window.addEventListener( 'resize', @resizeScreen, false )


  de2ra:( degree ) ->
   degree*(Math.PI/180)

  resizeScreen:() ->
    @screenWidth  = window.innerWidth
    @screenHeight = window.innerHeight
    @aspectRatio  = @screenWidth  / @screenHeight
    if @camera? and @renderer?
       @camera.aspect = @aspectRatio
       @camera.updateProjectionMatrix();
       @renderer.setSize( @screenWidth, @screenHeight )
    console.log( "resizeScreen", { width:@screenWidth, height:@screenHeight } )
    [@screenWidth,@screenHeight,@aspectRatio]

  space:() ->
    sp = {}
    sp.modelRatio    =  @aspectRatio / 2
    sp.cubeSize      =  144
    sp.cubeWidth     =  sp.cubeSize * 1.5
    sp.cubeHeight    =  sp.cubeSize * sp.modelRatio
    sp.cubeDepth     =  sp.cubeSize
    sp.cubeHalf      =  sp.cubeSize   / 2
    sp.horzSpace     =  sp.cubeSize   * 2 / 3
    sp.vertSpace     =  sp.horzSpace  * sp.modelRatio
    sp.zzzzSpace     =  sp.horzSpace
    sp.x1            =  sp.cubeWidth  + sp.horzSpace
    sp.x2            =  0
    sp.x3            = -sp.cubeWidth  - sp.horzSpace
    sp.y1            =  sp.cubeHeight + sp.vertSpace
    sp.y2            =     0
    sp.y3            = -sp.cubeHeight - sp.vertSpace
    sp.z1            =  sp.cubeDepth  + sp.zzzzSpace
    sp.z2            =  0
    sp.z3            = -sp.cubeDepth  - sp.zzzzSpace
    sp.studyWidth    =  sp.cubeWidth  / 3
    sp.studyHeight   =  sp.cubeHeight / 3
    sp.sw            =  sp.studyWidth
    sp.sh            =  sp.studyHeight
    sp.sx            = { center:0, west:-sp.sw, north:0,      east:sp.sw, south:0     }
    sp.sy            = { center:0, west:0,      north:-sp.sh, east:0,     south:sp.sh }
    sp

  ikw: () ->
    sp    = @space()
    build = new Build()
    group = new THREE.Group()
    for plane   in [ { name:'Information', z:sp.z1 }, { name:'Knowledge', z:sp.z2 }, { name:'Wisdom',   z:sp.z3 } ]
      for row   in [ { name:'Learn',       y:sp.y1 }, { name:'Do',        y:sp.y2 }, { name:'Share',    y:sp.y3 } ]
        for col in [ { name:'Embrace',     x:sp.x3 }, { name:'Innovate',  x:sp.x2 }, { name:'Encourage',x:sp.x1 } ]
          practice  = build.getPractice( plane.name, row.name, col.name )
          studies   = build.getStudies(  plane.name, practice.name )
          pracCube  = new Cube( plane.name, row.name, col.name, practice.name, [col.x,row.y,plane.z], [sp.cubeWidth,sp.cubeHeight,sp.cubeDepth],practice.hsv, 0.6 )
          pracGroup = new THREE.Group()
          pracGroup.add( pracCube.mesh  )
          pracGroup.add( pracCube.tmesh )
          for key, study of studies
            x = col.x + sp.sx[study.dir]
            y = row.y + sp.sy[study.dir]
            z = plane.z
            studyCube = new Rect( plane.name, row.name, col.name, study.name, [x,y,z], [sp.sw,sp.sh],study.hsv, 1.0 )
            pracGroup.add( studyCube.mesh )
          group.add( pracGroup )
    @convey(  build, sp, group )
    @flow(    build, sp, group )
    @conduit( build, sp, group )
    group.material = new THREE.MeshLambertMaterial( { color:0x888888, transparent:true, opacity:0.5, side:THREE.DoubleSide } )
    group.rotation.set( 0, 0, 0 )
    group.position.set( 0, 0, 0 )
    group.scale.set(    1, 1, 1 )
    @scene.add( group )
    group

  convey: ( build, sp, group ) ->
    hsv = [0,50,50]
    w =   sp.horzSpace
    h =   sp.studyHeight
    x = ( sp.cubeWidth + w ) / 2
    for plane   in [ { name:'Information', z:sp.z1   }, { name:'Knowledge', z:sp.z2   }, { name:'Wisdom', z:sp.z3 } ]
      for row   in [ { name:'Learn',       y:sp.y1   }, { name:'Do',        y:sp.y2   }, { name:'Share',  y:sp.y3 } ]
        for col in [ { name:'Embrace',     x:sp.x3+x }, { name:'Innovate',  x:sp.x2+x } ]
          practice  = build.getPractice( plane.name, row.name, col.name )
          [beg,end] = build.connectName( practice, 'east')
          name = beg.name + ' ' + end.name
          rect = new Rect( plane.name, row.name, col.name, name, [col.x,row.y,plane.z], [w,h],hsv, 0.7 )
          group.add( rect.mesh )
    return

  flow:( build, sp, group ) ->
    hsv = [0,50,50]
    w =   sp.studyWidth
    h =   sp.vertSpace
    y = ( sp.cubeHeight + h ) / 2
    for plane   in [ { name:'Information', z:sp.z1 },  { name:'Knowledge', z:sp.z2   }, { name:'Wisdom',    z:sp.z3 } ]
      for row   in [ { name:'Learn',       y:sp.y1-y}, { name:'Do',        y:sp.y2-y } ]
        for col in [ { name:'Embrace',     x:sp.x3},   { name:'Innovate',  x:sp.x2   }, { name:'Encourage', x:sp.x1 } ]
          practice  = build.getPractice( plane.name, row.name, col.name )
          [beg,end] = build.connectName( practice, 'east')
          name = beg.name + ' ' + end.name
          rect = new Rect( plane.name, row.name, col.name, name, [col.x,row.y,plane.z], [w,h],hsv, 0.7 )
          group.add( rect.mesh )
    return

  conduit: ( build, sp, group ) ->
    hsv = [0,50,50]
    w =   sp.studyWidth
    h =   sp.zzzzSpace
    z = ( sp.cubeDepth + h ) / 2
    for plane   in [ { name:'Information', z:sp.z1-z }, { name:'Knowledge', z:sp.z2-z } ]
      for row   in [ { name:'Learn',       y:sp.y1 },   { name:'Do',        y:sp.y2   }, { name:'Share',    y:sp.y3 } ]
        for col in [ { name:'Embrace',     x:sp.x3 },   { name:'Innovate',  x:sp.x2   }, { name:'Encourage',x:sp.x1 } ]
          practice  = build.getPractice( plane.name, row.name, col.name )
          [beg,end] = build.connectName( practice, 'east')
          name = beg.name + ' ' + end.name
          rect = new Rect( plane.name, row.name, col.name, name, [0,0,0], [w,h],hsv, 0.7 )
          rect.mesh.rotation.x = Math.PI / 2
          rect.mesh.position.x = col.x
          rect.mesh.position.y = row.y
          rect.mesh.position.z = plane.z
          group.add( rect.mesh )
    return

  faces:() ->
    color = 0x888888
    ang   = Math.PI / 2
    material = new THREE.MeshLambertMaterial( { color:color, transparent:true, opacity:0.5, side:THREE.DoubleSide } )
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
    material2 = new THREE.MeshLambertMaterial({ color:color, transparent:true } )
    mesh2     = new THREE.Mesh(geometry2, material2)

    mesh      = new THREE.Group().add( front ).add( back ).add( west ).add( east ).add( north ).add( south).add( mesh2 )
    mesh.material = material
    @scene.add(mesh)
    return

  ground: () ->

    planeGeometry = new THREE.BoxGeometry( 10, 10, 0.1 );
    planeMaterial = new THREE.MeshLambertMaterial({ color:0xffffff, side:THREE.DoubleSide } )

    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
    planeMesh.position.set(0, -3, 0)
    planeMesh.rotation.set(0, 0, 0)
    planeMesh.rotation.x = de2ra(90)
    planeMesh.receiveShadow = true
    @scene.add(planeMesh)
    return
  
  lights:() ->

    object3d  = new THREE.DirectionalLight('white', 0.15)
    object3d.position.set(6,3,9)
    object3d.name = 'Back light'
    @scene.add(object3d)

    object3d = new THREE.DirectionalLight('white', 0.35);
    object3d.position.set(-6, -3, 0)
    object3d.name   = 'Key light'
    @scene.add(object3d)

    object3d = new THREE.DirectionalLight('white', 0.55)
    object3d.position.set(9, 9, 6)
    object3d.name = 'Fill light'
    @scene.add(object3d)

    spotLight = new THREE.SpotLight( 0xffffff )
    spotLight.position.set( 3, 30, 3 )
    spotLight.castShadow = true
    spotLight.shadow.mapSize.width  = 2048
    spotLight.shadow.mapSize.height = 2048
    spotLight.shadow.camera.near    = 1
    spotLight.shadow.camera.far     = 4000
    spotLight.shadow.camera.fov     = 45
    @scene.add( spotLight )
    return

  ui:( group ) ->

    act = {
      Information : true, Knowledge : true, Wisdom    : true,
      Learn       : true, Do        : true, Share     : true,
      Embrace     : true, Innovate  : true, Encourage : true,
      Opacity:group.material.opacity, Color:group.material.color,
      RotationX:group.rotation.x, RotationY:group.rotation.y, RotationZ:group.rotation.z,
      PositionX:0, PositionY:0,  PositionZ:0,
      ScaleX:1,    ScaleY:1,     ScaleZ:1 }

    gui = new dat.GUI()

    traverse = ( prop, value, visible ) ->
      console.error( 'reveal', { prop:prop, value:value, visible:visible } ) if not visible?
      reveal = (child) =>
        #console.log( 'traverse', { name:child.name, tprop:prop, cprop:child[prop], value:value, visible:child.visible } )
        if child[prop]? and child[prop] is value
           child.visible = visible
           console.log( 'reveal',  { name:child.name, prop:prop, value:value, visible:child.visible } )
      group.traverse( reveal ) if group?
      return

    information = () => traverse( 'plane', 'Information', act.Information )
    knowledge   = () => traverse( 'plane', 'Knowledge',   act.Knowledge   )
    wisdom      = () => traverse( 'plane', 'Wisdom',      act.Wisdom      )
    learn       = () => traverse( 'row',   'Learn',       act.Learn       )
    doDo        = () => traverse( 'row',   'Do',          act.Do          )
    share       = () => traverse( 'row',   'Share',       act.Share       )
    embrace     = () => traverse( 'col',   'Embrace',     act.Embrace     )
    innovate    = () => traverse( 'col',   'Innovate',    act.Innovate    )
    encourage   = () => traverse( 'col',   'Encourage',   act.Encourage   )

    # gui.add(      act, 'Opacity', 0.1, 1.0 ).onChange( () -> group.material.opacity = act.Opacity )
    # gui.addColor( act, 'Color',   color    ).onChange( () -> group.material.color.setHex( dec2hex(act.Color) ) )

    f1 = gui.addFolder('Planes')
    f1.add( act, 'Information' ).onChange( information )
    f1.add( act, 'Knowledge'   ).onChange( knowledge   )
    f1.add( act, 'Wisdom'      ).onChange( wisdom      )

    f2 = gui.addFolder('Rows')
    f2.add( act, 'Learn' ).onChange( learn )
    f2.add( act, 'Do'    ).onChange( doDo  )
    f2.add( act, 'Share' ).onChange( share )

    f3 = gui.addFolder('Cols')
    f3.add( act, 'Embrace'   ).onChange( embrace   )
    f3.add( act, 'Innovate'  ).onChange( innovate  )
    f3.add( act, 'Encourage' ).onChange( encourage )

    f4 = gui.addFolder('Rotation')
    f4.add( act, 'RotationX', -180, 180 ).onChange( () -> group.rotation.x = de2ra(act.RotationX) )
    f4.add( act, 'RotationY', -180, 180 ).onChange( () -> group.rotation.y = de2ra(act.RotationY) )
    f4.add( act, 'RotationZ', -180, 180 ).onChange( () -> group.rotation.z = de2ra(act.RotationZ) )

    f5 = gui.addFolder('Position');
    f5.add( act, 'PositionX', -500, 500 ).onChange( () -> group.position.x = act.PositionX )
    f5.add( act, 'PositionY', -500, 500 ).onChange( () -> group.position.y = act.PositionY )
    f5.add( act, 'PositionZ', -500, 500 ).onChange( () -> group.position.z = act.PositionZ )

    f6 = gui.addFolder('Scale')
    f6.add( act, 'ScaleX', 0.1, 5 ).onChange( () -> group.scale.x = act.ScaleX )
    f6.add( act, 'ScaleY', 0.1, 5 ).onChange( () -> group.scale.y = act.ScaleY )
    f6.add( act, 'ScaleZ', 0.1, 5 ).onChange( () -> group.scale.z = act.ScaleZ )

    [gui,act]

  dec2hex:( i ) ->
    result = "0x000000"
    if      i >= 0     and i <=      15 then result = "0x00000" + i.toString(16)
    else if i >= 16    and i <=     255 then result = "0x0000" + i.toString(16)
    else if i >= 256   and i <=    4095 then result = "0x000" + i.toString(16)
    else if i >= 4096  and i <=   65535 then result = "0x00" + i.toString(16)
    else if i >= 65535 and i <= 1048575 then result = "0x0" + i.toString(16)
    else if i >= 1048575                then result = "0x" + i.toString(16)
    result

  animate:() =>
    requestAnimationFrame( @animate )
    @controls.update();
    @renderScene()
    return

  renderScene:() ->
    @renderer.render( @scene, @camera )
    return

  geom:() ->

    geometry = new THREE.BoxGeometry( 2, 2, 2 )
    material = new THREE.MeshLambertMaterial({ color:color, transparent:true } )
    mesh     = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 0, 0)
    mesh.rotation.set(0, 0, 0)
    mesh.rotation.y = de2ra(-90)
    mesh.scale.set(1, 1, 1)
    mesh.doubleSided = true
    mesh.castShadow = true
    @scene.add(mesh)

    geometry2 = new THREE.BoxGeometry( 1, 1, 1 )
    material2 = new THREE.MeshLambertMaterial({ color:color, transparent:true } )
    mesh2     = new THREE.Mesh(geometry2, material2)
    @scene.add(mesh2)
    return

