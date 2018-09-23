import Util       from '../util/Util.js';
import Vis        from '../vis/Vis.js';
var animate, camera, container, controls, highlightBox, init, mouse, noop, offset, onMouseMove, pick, pickingData, pickingScene, pickingTexture, render, renderer, scene, stats;

container = void 0;

stats = void 0;

camera = void 0;

controls = void 0;

scene = void 0;

renderer = void 0;

pickingData = [];

pickingTexture = void 0;

pickingScene = void 0;

highlightBox = void 0;

mouse = new THREE.Vector2;

offset = new THREE.Vector3(10, 10, 10);

init = function() {
  var applyVertexColors, color, defaultMaterial, geometriesDrawn, geometriesPicking, geometry, i, light, matrix, objects, pickingMaterial, position, quaternion, rotation, scale;
  applyVertexColors = function(geometry, color) {
    var colors, i, position;
    position = geometry.attributes.position;
    colors = [];
    i = 0;
    while (i < position.count) {
      colors.push(color.r, color.g, color.b);
      i++;
    }
    geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  };
  container = document.getElementById('container');
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;
  controls = new THREE.TrackballControls(camera);
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 1.2;
  controls.panSpeed = 0.8;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = true;
  controls.dynamicDampingFactor = 0.3;
  scene = new THREE.Scene;
  scene.background = new THREE.Color(0xffffff);
  pickingScene = new THREE.Scene;
  pickingTexture = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  pickingTexture.texture.minFilter = THREE.LinearFilter;
  scene.add(new THREE.AmbientLight(0x555555));
  light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 500, 2000);
  scene.add(light);
  pickingMaterial = new THREE.MeshBasicMaterial({
    vertexColors: THREE.VertexColors
  });
  defaultMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    flatShading: true,
    vertexColors: THREE.VertexColors,
    shininess: 0
  });
  geometriesDrawn = [];
  geometriesPicking = [];
  matrix = new THREE.Matrix4;
  quaternion = new THREE.Quaternion;
  color = new THREE.Color;
  i = 0;
  while (i < 5000) {
    geometry = new THREE.BoxBufferGeometry;
    position = new THREE.Vector3;
    position.x = Math.random() * 10000 - 5000;
    position.y = Math.random() * 6000 - 3000;
    position.z = Math.random() * 8000 - 4000;
    rotation = new THREE.Euler;
    rotation.x = Math.random() * 2 * Math.PI;
    rotation.y = Math.random() * 2 * Math.PI;
    rotation.z = Math.random() * 2 * Math.PI;
    scale = new THREE.Vector3;
    scale.x = Math.random() * 200 + 100;
    scale.y = Math.random() * 200 + 100;
    scale.z = Math.random() * 200 + 100;
    quaternion.setFromEuler(rotation, false);
    matrix.compose(position, quaternion, scale);
    geometry.applyMatrix(matrix);
    // give the geometry's vertices a random color, to be displayed
    applyVertexColors(geometry, color.setHex(Math.random() * 0xffffff));
    geometriesDrawn.push(geometry);
    geometry = geometry.clone();
    // give the geometry's vertices a color corresponding to the "id"
    applyVertexColors(geometry, color.setHex(i));
    geometriesPicking.push(geometry);
    pickingData[i] = {
      position: position,
      rotation: rotation,
      scale: scale
    };
    i++;
  }
  objects = new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(geometriesDrawn), defaultMaterial);
  scene.add(objects);
  pickingScene.add(new THREE.Mesh(THREE.BufferGeometryUtils.mergeBufferGeometries(geometriesPicking), pickingMaterial));
  highlightBox = new THREE.Mesh(new THREE.BoxBufferGeometry, new THREE.MeshLambertMaterial({
    color: 0xffff00
  }));
  scene.add(highlightBox);
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window['devicePixelRatio']);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  stats = new Stats;
  container.appendChild(stats.dom);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
};


onMouseMove = function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

animate = function() {
  requestAnimationFrame(animate);
  render();
  stats.update();
};

pick = function() {
  var data, id, pixelBuffer;
  //render the picking scene off-screen
  renderer.render(pickingScene, camera, pickingTexture);
  //create buffer for reading single pixel
  pixelBuffer = new Uint8Array(4);
  //read the pixel under the mouse from the texture
  renderer.readRenderTargetPixels(pickingTexture, mouse.x, pickingTexture.height - mouse.y, 1, 1, pixelBuffer);
  //interpret the pixel as an ID
  id = pixelBuffer[0] << 16 | pixelBuffer[1] << 8 | pixelBuffer[2];
  data = pickingData[id];
  if (data) {
    //move our highlightBox so that it surrounds the picked object
    if (data.position && data.rotation && data.scale) {
      highlightBox.position.copy(data.position);
      highlightBox.rotation.copy(data.rotation);
      highlightBox.scale.copy(data.scale).add(offset);
      highlightBox.visible = true;
    }
  } else {
    highlightBox.visible = false;
  }
};

render = function() {
  controls.update();
  pick();
  renderer.render(scene, camera);
};

noop = function(arg) {
  if (arg === false) {
    console.log('noop', arg);
  }
};

Util.ready(function() {
  init();
  return animate();
});
