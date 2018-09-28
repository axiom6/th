import Util  from '../util/Util.js';
import Vis   from '../vis/Vis.js';
import Cube  from '../hum/Cube.js';
import Rect  from '../hum/Rect.js';
import Build from '../hum/Build.js';
import Act   from '../hum/Act.js';
import Gui   from '../hum/Gui.js';
var animate, aspectRatio, camera, conduit, controls, convey, de2ra, dec2hex, faces, flow, fontPrac, geom, ground, ikw, ikwElem, init, lights, renderScene, renderer, resizeScreen, scene, screenDepth, screenHeight, screenWidth, space, ui;

scene = void 0;

camera = void 0;

renderer = void 0;

controls = void 0;

ikwElem = void 0;

fontPrac = void 0;

screenWidth = 0;

screenHeight = 0;

screenDepth = 0;

aspectRatio = 1;

Util.ready(function() {
  init();
  animate();
});

de2ra = function(degree) {
  return degree * (Math.PI / 180);
};

resizeScreen = function() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  aspectRatio = screenWidth / screenHeight;
  if ((camera != null) && (renderer != null)) {
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    renderer.setSize(screenWidth, screenHeight);
  }
  console.log("resizeScreen", {
    width: screenWidth,
    height: screenHeight
  });
};

init = function() {
  var axes, fontJSON, group;
  resizeScreen();
  ikwElem = document.getElementById('Ikw');
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(screenWidth, screenHeight);
  renderer.setClearColor(0x000000, 1); // 0x333F47, 1
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  ikwElem.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 10000);
  camera.position.set(0, 6, 1200);
  camera.lookAt(scene.position);
  scene.add(camera);
  axes = new THREE.AxesHelper(2);
  scene.add(axes);
  fontJSON = Build.syncJSON('webfonts/helvetiker_regular.typeface.json');
  fontPrac = new THREE.Font(fontJSON);
  
  //faces()
  //ground()
  group = ikw();
  lights();
  ui(group);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  window.addEventListener('resize', resizeScreen, false);
};

space = function() {
  var sp;
  sp = {};
  sp.cubeSize = 144;
  sp.cubeHalf = sp.cubeSize / 2;
  sp.cubeSpacing = sp.cubeSize * 2 / 3;
  sp.baseSize = (sp.cubeSize + sp.cubeSpacing) * 3;
  sp.c1 = sp.cubeSize + sp.cubeSpacing;
  sp.c2 = 0;
  sp.c3 = -sp.cubeSize - sp.cubeSpacing;
  sp.studySize = sp.cubeSize / 3;
  sp.ss = sp.studySize;
  sp.sd = sp.ss;
  sp.sx = {
    center: 0,
    west: -sp.sd,
    north: 0,
    east: sp.sd,
    south: 0
  };
  sp.sy = {
    center: 0,
    west: 0,
    north: -sp.sd,
    east: 0,
    south: sp.sd
  };
  sp.modelRatio = aspectRatio / 2;
  return sp;
};

ikw = function() {
  var build, col, cs, group, j, k, key, l, len, len1, len2, plane, pracCube, pracGroup, practice, ref, ref1, ref2, row, s, sp, studies, study, studyCube, x, y, z;
  sp = space();
  build = new Build();
  cs = sp.cubeSize;
  group = new THREE.Group();
  ref = [
    {
      name: 'Information',
      z: sp.c1
    },
    {
      name: 'Knowledge',
      z: sp.c2
    },
    {
      name: 'Wisdom',
      z: sp.c3
    }
  ];
  for (j = 0, len = ref.length; j < len; j++) {
    plane = ref[j];
    ref1 = [
      {
        name: 'Learn',
        y: sp.c1
      },
      {
        name: 'Do',
        y: sp.c2
      },
      {
        name: 'Share',
        y: sp.c3
      }
    ];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      row = ref1[k];
      ref2 = [
        {
          name: 'Embrace',
          x: sp.c3
        },
        {
          name: 'Innovate',
          x: sp.c2
        },
        {
          name: 'Encourage',
          x: sp.c1
        }
      ];
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        col = ref2[l];
        practice = build.getPractice(plane.name, row.name, col.name);
        studies = build.getStudies(plane.name, practice.name);
        pracCube = new Cube(plane.name, row.name, col.name, practice.name, [col.x, row.y * sp.modelRatio, plane.z], [cs, cs, cs], practice.hsv, 0.6);
        pracGroup = new THREE.Group();
        pracGroup.add(pracCube.mesh);
        pracGroup.add(pracCube.tmesh);
        for (key in studies) {
          study = studies[key];
          x = col.x + sp.sx[study.dir];
          y = row.y * sp.modelRatio + sp.sy[study.dir];
          z = plane.z;
          s = sp.cubeSize / 3;
          studyCube = new Rect(plane.name, row.name, col.name, study.name, [x, y, z], [s, s], study.hsv, 1.0);
          pracGroup.add(studyCube.mesh);
        }
        group.add(pracGroup);
      }
    }
  }
  convey(build, sp, group);
  flow(build, sp, group);
  conduit(build, sp, group);
  group.material = new THREE.MeshLambertMaterial({
    color: 0x888888,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });
  group.rotation.set(0, 0, 0);
  group.position.set(0, 0, 0);
  group.scale.set(1, 1, 1);
  scene.add(group);
  return group;
};

convey = function(build, sp, group) {
  var beg, col, d, end, h, hsv, j, k, l, len, len1, len2, name, plane, practice, rect, ref, ref1, ref2, row, sh, sx, sy;
  hsv = [0, 50, 50];
  h = sp.cubeHalf;
  d = sp.cubeSpacing / 2;
  sx = sp.cubeSpacing;
  sy = sp.studySize;
  sh = sp.studySize / 2;
  ref = [
    {
      name: 'Information',
      z: sp.c1
    },
    {
      name: 'Knowledge',
      z: sp.c2
    },
    {
      name: 'Wisdom',
      z: sp.c3
    }
  ];
  for (j = 0, len = ref.length; j < len; j++) {
    plane = ref[j];
    ref1 = [
      {
        name: 'Learn',
        y: sp.c1 + h - d
      },
      {
        name: 'Do',
        y: sp.c2 + h - d - sh
      },
      {
        name: 'Share',
        y: sp.c3 + h - d - sy
      }
    ];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      row = ref1[k];
      ref2 = [
        {
          name: 'Embrace',
          x: sp.c3 + h + d
        },
        {
          name: 'Innovate',
          x: sp.c2 + h + d
        }
      ];
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        col = ref2[l];
        practice = build.getPractice(plane.name, row.name, col.name);
        [beg, end] = build.connectName(practice, 'east');
        name = beg.name + ' ' + end.name;
        rect = new Rect(plane.name, row.name, col.name, name, [col.x, row.y, plane.z], [sx, sy], hsv, 0.7);
        group.add(rect.mesh);
      }
    }
  }
};

flow = function(build, sp, group) {
  var beg, col, cs, end, hsv, j, k, l, len, len1, len2, name, plane, practice, rect, ref, ref1, ref2, row, s4, ss, sx, sy;
  hsv = [0, 50, 50];
  cs = sp.cubeSize / 2;
  ss = sp.cubeSpacing / 2;
  s4 = sp.studySize / 4;
  sx = sp.studySize;
  sy = sp.cubeSpacing + sp.studySize / 2;
  ref = [
    {
      name: 'Information',
      z: sp.c1
    },
    {
      name: 'Knowledge',
      z: sp.c2
    },
    {
      name: 'Wisdom',
      z: sp.c3
    }
  ];
  for (j = 0, len = ref.length; j < len; j++) {
    plane = ref[j];
    ref1 = [
      {
        name: 'Learn',
        y: sp.c1 - cs - ss + s4
      },
      {
        name: 'Do',
        y: sp.c2 - cs - ss - s4
      }
    ];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      row = ref1[k];
      ref2 = [
        {
          name: 'Embrace',
          x: sp.c3
        },
        {
          name: 'Innovate',
          x: sp.c2
        },
        {
          name: 'Encourage',
          x: sp.c1
        }
      ];
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        col = ref2[l];
        practice = build.getPractice(plane.name, row.name, col.name);
        [beg, end] = build.connectName(practice, 'east');
        name = beg.name + ' ' + end.name;
        rect = new Rect(plane.name, row.name, col.name, name, [col.x, row.y, plane.z], [sx, sy], hsv, 0.7);
        group.add(rect.mesh);
      }
    }
  }
};

conduit = function(build, sp, group) {
  var beg, ch, col, dh, end, hsv, j, k, l, len, len1, len2, name, plane, practice, rect, ref, ref1, ref2, row, sh, sx, sy;
  hsv = [0, 50, 50];
  sh = sp.cubeHalf;
  ch = sp.cubeSpacing / 2;
  dh = sp.studySize / 2;
  sx = sp.studySize;
  sy = sp.cubeSpacing;
  ref = [
    {
      name: 'Information',
      z: sp.c1 - sh - ch
    },
    {
      name: 'Knowledge',
      z: sp.c2 - sh - ch
    }
  ];
  for (j = 0, len = ref.length; j < len; j++) {
    plane = ref[j];
    ref1 = [
      {
        name: 'Learn',
        y: sp.c1 + dh
      },
      {
        name: 'Do',
        y: sp.c2
      },
      {
        name: 'Share',
        y: sp.c3 - dh
      }
    ];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      row = ref1[k];
      ref2 = [
        {
          name: 'Embrace',
          x: sp.c3
        },
        {
          name: 'Innovate',
          x: sp.c2
        },
        {
          name: 'Encourage',
          x: sp.c1
        }
      ];
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        col = ref2[l];
        practice = build.getPractice(plane.name, row.name, col.name);
        [beg, end] = build.connectName(practice, 'east');
        name = beg.name + ' ' + end.name;
        rect = new Rect(plane.name, row.name, col.name, name, [0, 0, 0], [sx, sy], hsv, 0.7);
        rect.mesh.rotation.x = Math.PI / 2;
        rect.mesh.position.x = col.x;
        rect.mesh.position.y = row.y;
        rect.mesh.position.z = plane.z;
        group.add(rect.mesh);
      }
    }
  }
};

faces = function() {
  var ang, back, color, east, front, geometry2, material, material2, mesh, mesh2, north, south, west;
  color = 0x888888;
  ang = Math.PI / 2;
  material = new THREE.MeshLambertMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide
  });
  front = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  back = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  west = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material).rotateY(ang);
  east = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material).rotateY(ang);
  north = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material).rotateX(ang);
  south = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material).rotateX(ang);
  front.position.z = 1;
  back.position.z = -1;
  west.position.x = -1;
  east.position.x = 1;
  north.position.y = 1;
  south.position.y = -1;
  geometry2 = new THREE.BoxGeometry(1, 1, 1);
  material2 = new THREE.MeshLambertMaterial({
    color: color,
    transparent: true
  });
  mesh2 = new THREE.Mesh(geometry2, material2);
  mesh = new THREE.Group().add(front).add(back).add(west).add(east).add(north).add(south).add(mesh2);
  mesh.material = material;
  scene.add(mesh);
};

ground = function() {
  var planeGeometry, planeMaterial, planeMesh;
  planeGeometry = new THREE.BoxGeometry(10, 10, 0.1);
  planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });
  planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  planeMesh.position.set(0, -3, 0);
  planeMesh.rotation.set(0, 0, 0);
  planeMesh.rotation.x = de2ra(90);
  planeMesh.receiveShadow = true;
  scene.add(planeMesh);
};

lights = function() {
  var object3d, spotLight;
  object3d = new THREE.DirectionalLight('white', 0.15);
  object3d.position.set(6, 3, 9);
  object3d.name = 'Back light';
  scene.add(object3d);
  object3d = new THREE.DirectionalLight('white', 0.35);
  object3d.position.set(-6, -3, 0);
  object3d.name = 'Key light';
  scene.add(object3d);
  object3d = new THREE.DirectionalLight('white', 0.55);
  object3d.position.set(9, 9, 6);
  object3d.name = 'Fill light';
  scene.add(object3d);
  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(3, 30, 3);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 45;
  scene.add(spotLight);
};

ui = function(group) {
  var act, doDo, embrace, encourage, f1, f2, f3, f4, f5, f6, gui, information, innovate, knowledge, learn, share, traverse, wisdom;
  act = {
    Information: true,
    Knowledge: true,
    Wisdom: true,
    Learn: true,
    Do: true,
    Share: true,
    Embrace: true,
    Innovate: true,
    Encourage: true,
    Opacity: group.material.opacity,
    Color: group.material.color,
    RotationX: group.rotation.x,
    RotationY: group.rotation.y,
    RotationZ: group.rotation.z,
    PositionX: 0,
    PositionY: 0,
    PositionZ: 0,
    ScaleX: 1,
    ScaleY: 1,
    ScaleZ: 1
  };
  gui = new dat.GUI();
  traverse = function(prop, value, visible) {
    var reveal;
    if (visible == null) {
      console.error('reveal', {
        prop: prop,
        value: value,
        visible: visible
      });
    }
    reveal = (child) => {
      //console.log( 'traverse', { name:child.name, tprop:prop, cprop:child[prop], value:value, visible:child.visible } )
      if ((child[prop] != null) && child[prop] === value) {
        child.visible = visible;
        return console.log('reveal', {
          name: child.name,
          prop: prop,
          value: value,
          visible: child.visible
        });
      }
    };
    if (group != null) {
      group.traverse(reveal);
    }
  };
  information = () => {
    return traverse('plane', 'Information', act.Information);
  };
  knowledge = () => {
    return traverse('plane', 'Knowledge', act.Knowledge);
  };
  wisdom = () => {
    return traverse('plane', 'Wisdom', act.Wisdom);
  };
  learn = () => {
    return traverse('row', 'Learn', act.Learn);
  };
  doDo = () => {
    return traverse('row', 'Do', act.Do);
  };
  share = () => {
    return traverse('row', 'Share', act.Share);
  };
  embrace = () => {
    return traverse('col', 'Embrace', act.Embrace);
  };
  innovate = () => {
    return traverse('col', 'Innovate', act.Innovate);
  };
  encourage = () => {
    return traverse('col', 'Encourage', act.Encourage);
  };
  // gui.add(      act, 'Opacity', 0.1, 1.0 ).onChange( () -> group.material.opacity = act.Opacity )
  // gui.addColor( act, 'Color',   color    ).onChange( () -> group.material.color.setHex( dec2hex(act.Color) ) )
  f1 = gui.addFolder('Planes');
  f1.add(act, 'Information').onChange(information);
  f1.add(act, 'Knowledge').onChange(knowledge);
  f1.add(act, 'Wisdom').onChange(wisdom);
  f2 = gui.addFolder('Rows');
  f2.add(act, 'Learn').onChange(learn);
  f2.add(act, 'Do').onChange(doDo);
  f2.add(act, 'Share').onChange(share);
  f3 = gui.addFolder('Cols');
  f3.add(act, 'Embrace').onChange(embrace);
  f3.add(act, 'Innovate').onChange(innovate);
  f3.add(act, 'Encourage').onChange(encourage);
  f4 = gui.addFolder('Rotation');
  f4.add(act, 'RotationX', -180, 180).onChange(function() {
    return group.rotation.x = de2ra(act.RotationX);
  });
  f4.add(act, 'RotationY', -180, 180).onChange(function() {
    return group.rotation.y = de2ra(act.RotationY);
  });
  f4.add(act, 'RotationZ', -180, 180).onChange(function() {
    return group.rotation.z = de2ra(act.RotationZ);
  });
  f5 = gui.addFolder('Position');
  f5.add(act, 'PositionX', -500, 500).onChange(function() {
    return group.position.x = act.PositionX;
  });
  f5.add(act, 'PositionY', -500, 500).onChange(function() {
    return group.position.y = act.PositionY;
  });
  f5.add(act, 'PositionZ', -500, 500).onChange(function() {
    return group.position.z = act.PositionZ;
  });
  f6 = gui.addFolder('Scale');
  f6.add(act, 'ScaleX', 0.1, 5).onChange(function() {
    return group.scale.x = act.ScaleX;
  });
  f6.add(act, 'ScaleY', 0.1, 5).onChange(function() {
    return group.scale.y = act.ScaleY;
  });
  f6.add(act, 'ScaleZ', 0.1, 5).onChange(function() {
    return group.scale.z = act.ScaleZ;
  });
};

dec2hex = function(i) {
  var result;
  result = "0x000000";
  if (i >= 0 && i <= 15) {
    result = "0x00000" + i.toString(16);
  } else if (i >= 16 && i <= 255) {
    result = "0x0000" + i.toString(16);
  } else if (i >= 256 && i <= 4095) {
    result = "0x000" + i.toString(16);
  } else if (i >= 4096 && i <= 65535) {
    result = "0x00" + i.toString(16);
  } else if (i >= 65535 && i <= 1048575) {
    result = "0x0" + i.toString(16);
  } else if (i >= 1048575) {
    result = "0x" + i.toString(16);
  }
  return result;
};

animate = function() {
  requestAnimationFrame(animate);
  controls.update();
  renderScene();
};

renderScene = function() {
  renderer.render(scene, camera);
};

geom = function() {
  var geometry, geometry2, material, material2, mesh, mesh2;
  geometry = new THREE.BoxGeometry(2, 2, 2);
  material = new THREE.MeshLambertMaterial({
    color: color,
    transparent: true
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.rotation.set(0, 0, 0);
  mesh.rotation.y = de2ra(-90);
  mesh.scale.set(1, 1, 1);
  mesh.doubleSided = true;
  mesh.castShadow = true;
  scene.add(mesh);
  geometry2 = new THREE.BoxGeometry(1, 1, 1);
  material2 = new THREE.MeshLambertMaterial({
    color: color,
    transparent: true
  });
  mesh2 = new THREE.Mesh(geometry2, material2);
  scene.add(mesh2);
};
