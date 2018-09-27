import Util  from '../util/Util.js';
import Vis   from '../vis/Vis.js';
import Cube  from '../hum/Cube.js';
import Rect  from '../hum/Rect.js';
import Build from '../hum/Build.js';
import Act   from '../hum/Act.js';
import Gui   from '../hum/Gui.js';
var HEIGHT, WIDTH, act, animate, camera, color, controls, de2ra, dec2hex, faces, geom, ground, gui, init, lights, material, mesh, onWindowResize, renderScene, renderer, scene, threejs, ui;

scene = void 0;

camera = void 0;

renderer = void 0;

threejs = void 0;

WIDTH = 0;

HEIGHT = 0;

mesh = void 0;

color = 0xAA55DD;

material = void 0;

controls = void 0;

gui = void 0;

act = void 0;

Util.ready(function() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  init();
  animate();
});

de2ra = function(degree) {
  return degree * (Math.PI / 180);
};

onWindowResize = function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

init = function() {
  var axes;
  threejs = document.getElementById('Ikw');
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x000000, 1); // 0x333F47, 1
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  threejs.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 1000);
  camera.position.set(0, 6, 6);
  camera.lookAt(scene.position);
  scene.add(camera);
  axes = new THREE.AxesHelper(2);
  scene.add(axes);
  faces();
  ground();
  lights();
  ui();
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
};

geom = function() {
  var geometry, geometry2, material2, mesh2;
  geometry = new THREE.BoxGeometry(2, 2, 2);
  material = new THREE.MeshLambertMaterial({
    ambient: color,
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
    ambient: color,
    color: color,
    transparent: true
  });
  mesh2 = new THREE.Mesh(geometry2, material2);
  scene.add(mesh2);
};

faces = function() {
  var ang, back, east, front, geometry2, material2, mesh2, north, south, west;
  color = 0x888888;
  ang = Math.PI / 2;
  material = new THREE.MeshLambertMaterial({
    ambient: color,
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
    ambient: color,
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
    ambient: 0x000000,
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
  spotLight.shadowMapWidth = 2048;
  spotLight.shadowMapHeight = 2048;
  spotLight.shadowCameraNear = 1;
  spotLight.shadowCameraFar = 4000;
  spotLight.shadowCameraFov = 45;
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
