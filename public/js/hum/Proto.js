import Util  from '../util/Util.js';
import Vis   from '../vis/Vis.js';
import Cube  from '../hum/Cube.js';
var animate, applyVertexColors, aspectRatio, baseSize, camera, canvasDepth, canvasHeight, canvasWidth, container, controls, cubeMargin, cubePos1, cubePos2, cubePos3, cubeScale, cubeSize, cubeSpacing, init, modelRatio, mouse, noop, offset, onMouseDown, onMouseMove, onMouseMove2, onWindowResize, render, renderer, resizeScreen, scene, screenDepth, screenHeight, screenWidth, sd, ss, stats, studySize, sx, sy;

container = void 0;

stats = void 0;

camera = void 0;

controls = void 0;

scene = void 0;

renderer = void 0;

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

sd = ss;

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

init = function() {
  var axes, col, j, k, l, len, len1, len2, light, plane, pracCube, ref, ref1, ref2, row;
  resizeScreen();
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
  scene.background = new THREE.Color(0x333333);
  scene.add(new THREE.AmbientLight(0x555555));
  light = new THREE.SpotLight(0xffffff, 1.5);
  light.position.set(0, 500, 2000);
  scene.add(light);
  axes = new THREE.AxesHelper(1000);
  scene.add(axes);
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
        pracCube = new Cube("Title", [col.x, row.y * modelRatio, plane.z], [0, 0, 0], [cubeSize, cubeSize, cubeSize], [90, 90, 90]);
        scene.add(pracCube.mesh);
      }
    }
  }
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window['devicePixelRatio']);
  renderer.setSize(screenWidth, screenHeight);
  container.appendChild(renderer.domElement);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('mousedown', onMouseDown);
};

onMouseMove = function(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
};

onMouseMove2 = function(e) {
  mouse.x = e.clientX; // - screenWidth  / 2
  mouse.y = e.clientY * aspectRatio;
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
};

//stats.update()
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

render = function() {
  controls.update();
  //pick()
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
