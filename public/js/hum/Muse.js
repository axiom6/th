import Util  from '../util/Util.js';
import Vis   from '../vis/Vis.js';
import Cube  from '../hum/Cube.js';
import Rect  from '../hum/Rect.js';
import Build from '../hum/Build.js';
import Act   from '../hum/Act.js';
import Gui   from '../hum/Gui.js';
var act, animate, aspectRatio, camera, color, controls, de2ra, dec2hex, faces, fontPrac, geom, ground, gui, ikw, ikwElem, init, lights, material, mesh, renderScene, renderer, resizeScreen, scene, screenDepth, screenHeight, screenWidth, space, ui;

scene = void 0;

camera = void 0;

renderer = void 0;

ikwElem = void 0;

fontPrac = void 0;

screenWidth = 0;

screenHeight = 0;

screenDepth = 0;

aspectRatio = 1;

mesh = void 0;

color = 0xAA55DD;

material = void 0;

controls = void 0;

gui = void 0;

act = void 0;

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
  var axes, fontJSON;
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
  ikw();
  lights();
  ui();
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  window.addEventListener('resize', resizeScreen, false);
};

space = function() {
  var sp;
  sp = {};
  sp.cubeSize = 144;
  sp.cubeSpacing = sp.cubeSize * 2 / 3;
  sp.baseSize = (sp.cubeSize + sp.cubeSpacing) * 3;
  sp.cubePos1 = sp.cubeSize + sp.cubeSpacing;
  sp.cubePos2 = 0;
  sp.cubePos3 = -sp.cubeSize - sp.cubeSpacing;
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
  var build, col, cs, j, key, len, plane, pracCube, practice, ref, results, row, s, sp, studies, study, studyCube, x, y, z;
  sp = space();
  build = new Build();
  cs = sp.cubeSize;
  ref = [
    {
      name: 'Information',
      z: sp.cubePos1
    },
    {
      name: 'Knowledge',
      z: sp.cubePos2
    },
    {
      name: 'Wisdom',
      z: sp.cubePos3
    }
  ];
  results = [];
  for (j = 0, len = ref.length; j < len; j++) {
    plane = ref[j];
    results.push((function() {
      var k, len1, ref1, results1;
      ref1 = [
        {
          name: 'Learn',
          y: sp.cubePos1
        },
        {
          name: 'Do',
          y: sp.cubePos2
        },
        {
          name: 'Share',
          y: sp.cubePos3
        }
      ];
      results1 = [];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        row = ref1[k];
        results1.push((function() {
          var l, len2, ref2, results2;
          ref2 = [
            {
              name: 'Embrace',
              x: sp.cubePos3
            },
            {
              name: 'Innovate',
              x: sp.cubePos2
            },
            {
              name: 'Encourage',
              x: sp.cubePos1
            }
          ];
          results2 = [];
          for (l = 0, len2 = ref2.length; l < len2; l++) {
            col = ref2[l];
            practice = build.getPractice(plane.name, row.name, col.name);
            studies = build.getStudies(plane.name, practice.name);
            pracCube = new Cube(plane.name, row.name, col.name, practice.name, [col.x, row.y * sp.modelRatio, plane.z], [cs, cs, cs], practice.hsv, 0.6);
            scene.add(pracCube.mesh);
            scene.add(pracCube.tmesh);
            results2.push((function() {
              var results3;
              results3 = [];
              for (key in studies) {
                study = studies[key];
                x = col.x + sp.sx[study.dir];
                y = row.y * sp.modelRatio + sp.sy[study.dir];
                z = plane.z;
                s = sp.cubeSize / 3;
                studyCube = new Rect(plane.name, row.name, col.name, study.name, [x, y, z], [s, s, s], study.hsv, 1.0);
                results3.push(scene.add(studyCube.mesh));
              }
              return results3;
            })());
          }
          return results2;
        })());
      }
      return results1;
    })());
  }
  return results;
};

faces = function() {
  var ang, back, east, front, geometry2, material2, mesh2, north, south, west;
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

act = {
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  positionX: 0,
  positionY: 0,
  positionZ: 0,
  rotationX: 0,
  rotationY: 90,
  rotationZ: 0,
  boxColor: color,
  castShadow: true,
  boxOpacity: 0.6
};

ui = function() {
  var f1, f2, f3;
  gui = new dat.GUI();
  console.log('act', act, color);
  gui.add(act, 'boxOpacity', 0.1, 1.0).onChange(function() {
    return mesh.material.opacity = act.boxOpacity;
  });
  f1 = gui.addFolder('Scale');
  f1.add(act, 'scaleX', 0.1, 5).onChange(function() {
    return mesh.scale.x = act.scaleX;
  });
  f1.add(act, 'scaleY', 0.1, 5).onChange(function() {
    return mesh.scale.y = act.scaleY;
  });
  f1.add(act, 'scaleZ', 0.1, 5).onChange(function() {
    return mesh.scale.z = act.scaleZ;
  });
  f2 = gui.addFolder('Position');
  f2.add(act, 'positionX', -5, 5).onChange(function() {
    return mesh.position.x = act.positionX;
  });
  f2.add(act, 'positionY', -3, 5).onChange(function() {
    return mesh.position.y = act.positionY;
  });
  f2.add(act, 'positionZ', -5, 5).onChange(function() {
    return mesh.position.z = act.positionZ;
  });
  f3 = gui.addFolder('Rotation');
  f3.add(act, 'rotationX', -180, 180).onChange(function() {
    return mesh.rotation.x = de2ra(act.rotationX);
  });
  f3.add(act, 'rotationY', -180, 180).onChange(function() {
    return mesh.rotation.y = de2ra(act.rotationY);
  });
  f3.add(act, 'rotationZ', -180, 180).onChange(function() {
    return mesh.rotation.z = de2ra(act.rotationZ);
  });
  gui.addColor(act, 'boxColor', color).onChange(function() {
    return mesh.material.color.setHex(dec2hex(act.boxColor));
  });
  gui.add(act, 'castShadow', false).onChange(function() {
    return mesh.castShadow = act.castShadow;
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
  var geometry, geometry2, material2, mesh2;
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
