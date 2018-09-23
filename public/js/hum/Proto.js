import Util       from '../util/Util.js';
import Vis        from '../vis/Vis.js';
var animate, aspectRatio, baseSize, camera, canvasDepth, canvasHeight, canvasWidth, container, controls, cubeMargin, cubePos1, cubePos2, cubePos3, cubeScale, cubeSize, cubeSpacing, highlightBox, init, modelRatio, mouse, noop, offset, onMouseDown, onMouseMove, onWindowResize, pick, pickingData, pickingScene, pickingTexture, render, renderer, resizeScreen, scene, screenDepth, screenHeight, screenWidth, sd, ss, stats, studySize, sx, sy;

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

cubeSize = 144;

cubeScale = cubeSize / 4;

cubeSpacing = cubeSize * 2 / 3;

cubeMargin = cubeSpacing / 2;

baseSize = (cubeSize + cubeSpacing) * 3;

cubePos1 = -cubeSize - cubeSpacing;

cubePos2 = 0;

cubePos3 = cubeSize + cubeSpacing;

studySize = cubeSize / 3;

ss = studySize;

sd = ss * 1.5;

sx = [0, -sd, 0, sd, 0];

sy = [0, 0, -sd, 0, sd];

canvasWidth = baseSize;

canvasHeight = baseSize;

canvasDepth = baseSize;

screenWidth = 0;

screenHeight = 0;

screenDepth = 0;

aspectRatio = 1;

modelRatio = 1;

init = function() {
  var applyVertexColors, axes, col, color, defaultMaterial, dir, geometriesDrawn, geometriesPicking, geometry, i, j, k, l, len, len1, len2, len3, light, m, matrix, objects, pickingMaterial, plane, position, quaternion, ref, ref1, ref2, ref3, rotation, row, scale;
  resizeScreen();
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
  camera = new THREE.PerspectiveCamera(70, aspectRatio, 1, 10000);
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
  pickingTexture = new THREE.WebGLRenderTarget(screenWidth, screenHeight);
  pickingTexture.texture.minFilter = THREE.LinearFilter;
  scene.add(new THREE.AmbientLight(0x555555));
  light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 500, 2000);
  scene.add(light);
  axes = new THREE.AxesHelper(1000);
  scene.add(axes);
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
  ref = [
    {
      name: 'Information',
      z: cubePos1
    },
    {
      name: 'Knowledge',
      z: cubePos2
    },
    {
      name: 'Wisdom',
      z: cubePos3
    }
  ];
  for (j = 0, len = ref.length; j < len; j++) {
    plane = ref[j];
    ref1 = [
      {
        name: 'Learn',
        y: cubePos1
      },
      {
        name: 'Do',
        y: cubePos2
      },
      {
        name: 'Share',
        y: cubePos3
      }
    ];
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      row = ref1[k];
      ref2 = [
        {
          name: 'Embrace',
          x: cubePos1
        },
        {
          name: 'Innovate',
          x: cubePos2
        },
        {
          name: 'Encourage',
          x: cubePos3
        }
      ];
      for (l = 0, len2 = ref2.length; l < len2; l++) {
        col = ref2[l];
        ref3 = [0, 1, 2, 3, 4];
        for (m = 0, len3 = ref3.length; m < len3; m++) {
          dir = ref3[m];
          geometry = new THREE.BoxBufferGeometry;
          position = new THREE.Vector3;
          position.x = col.x + sx[dir];
          position.y = row.y * modelRatio + sy[dir];
          position.z = plane.z;
          rotation = new THREE.Euler;
          rotation.x = 0;
          rotation.y = 0;
          rotation.z = 0;
          scale = new THREE.Vector3;
          scale.x = cubeSize / 3;
          scale.y = cubeSize * modelRatio / 3;
          scale.z = cubeSize / 3;
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
          console.log('cubeData', {
            position: position,
            scale: scale
          });
          i++;
        }
      }
    }
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
  renderer.setSize(screenWidth, screenHeight);
  container.appendChild(renderer.domElement);
  stats = new Stats;
  container.appendChild(stats.dom);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('mousedown', onMouseDown);
};

onMouseMove = function(e) {
  mouse.x = e.clientX - screenWidth / 2;
  mouse.y = (e.clientY - screenHeight / 2) * aspectRatio;
};

onMouseDown = function(e) {
  onMouseMove(e);
  console.log('onMouseDown', {
    xm: mouse.x,
    ym: mouse.y,
    xs: e.clientX,
    ys: e.clientY
  });
};

animate = function() {
  requestAnimationFrame(animate);
  render();
  stats.update();
};

resizeScreen = function() {
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  screenDepth = baseSize;
  aspectRatio = screenWidth / screenHeight;
  return modelRatio = aspectRatio / 2;
};

onWindowResize = function() {
  resizeScreen();
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();
  return renderer.setSize(screenWidth, screenHeight);
};

pick = function() {
  var data, id, pixelBuffer;
  //render the picking scene off-screen
  renderer.render(pickingScene, camera, pickingTexture);
  //create buffer for reading single pixel
  pixelBuffer = new Uint8Array(4);
  //read the pixel under the mouse from the texture
  //renderer.readRenderTargetPixels pickingTexture, mouse.x, screenWidth - (mouse.y), 1, 1, pixelBuffer
  renderer.readRenderTargetPixels(pickingTexture, mouse.x, baseSize - mouse.y, 1, 1, pixelBuffer);
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
