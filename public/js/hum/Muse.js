import Util  from '../util/Util.js';
import Data  from '../util/Data.js';
import Vis   from '../vis/Vis.js';
import Cube  from '../hum/Cube.js';
import Rect  from '../hum/Rect.js';
import Build from '../hum/Build.js';
import Act   from '../hum/Act.js';
import Gui   from '../hum/Gui.js';
var Muse;

Muse = (function() {
  class Muse {
    static init(batch) {
      return Util.ready(function() {
        var muse;
        muse = new Muse(batch);
        muse.animate();
      });
    }

    constructor(batch1) {
      this.resizeScreen = this.resizeScreen.bind(this);
      this.animate = this.animate.bind(this);
      this.batch = batch1;
      // console.log( @batch.Info.data )
      [this.screenWidth, this.screenHeight, this.aspectRatio] = this.resizeScreen();
      this.ikwElem = document.getElementById('Ikw');
      this.scene = new THREE.Scene();
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setSize(this.screenWidth, this.screenHeight);
      this.renderer.setClearColor(0x000000, 1); // 0x333F47, 1
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMapSoft = true;
      this.ikwElem.appendChild(this.renderer.domElement);
      this.camera = new THREE.PerspectiveCamera(45, this.aspectRatio, 1, 10000);
      this.camera.position.set(0, 6, 1200);
      this.camera.lookAt(this.scene.position);
      this.scene.add(this.camera);
      this.axes = new THREE.AxesHelper(2);
      this.scene.add(this.axes);
      // @fontJSON = Data.syncJSON( 'webfonts/helvetiker_regular.typeface.json' )
      this.fontPrac = new THREE.Font(this.batch.Font.data);
      //@faces()
      //@ground()
      this.group = this.ikw(this.batch);
      this.lights();
      [this.gui, this.act] = this.ui(this.group);
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      window.addEventListener('resize', this.resizeScreen, false);
    }

    deg2rad(degree) {
      return degree * (Math.PI / 180);
    }

    resizeScreen() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.aspectRatio = this.screenWidth / this.screenHeight;
      if ((this.camera != null) && (this.renderer != null)) {
        this.camera.aspect = this.aspectRatio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.screenWidth, this.screenHeight);
      }
      //console.log( "resizeScreen", { width:@screenWidth, height:@screenHeight } )
      return [this.screenWidth, this.screenHeight, this.aspectRatio];
    }

    space() {
      var sp;
      sp = {};
      sp.modelRatio = this.aspectRatio / 2;
      sp.cubeSize = 144;
      sp.cubeWidth = sp.cubeSize * 2.0;
      sp.cubeHeight = sp.cubeSize * sp.modelRatio;
      sp.cubeDepth = sp.cubeSize;
      sp.cubeHalf = sp.cubeSize / 2;
      sp.horzSpace = sp.cubeSize * 2 / 3;
      sp.vertSpace = sp.horzSpace * sp.modelRatio;
      sp.zzzzSpace = sp.horzSpace;
      sp.x1 = sp.cubeWidth + sp.horzSpace;
      sp.x2 = 0;
      sp.x3 = -sp.cubeWidth - sp.horzSpace;
      sp.y1 = sp.cubeHeight + sp.vertSpace;
      sp.y2 = 0;
      sp.y3 = -sp.cubeHeight - sp.vertSpace;
      sp.z1 = sp.cubeDepth + sp.zzzzSpace;
      sp.z2 = 0;
      sp.z3 = -sp.cubeDepth - sp.zzzzSpace;
      sp.studyWidth = sp.cubeWidth / 3;
      sp.studyHeight = sp.cubeHeight / 3;
      sp.sw = sp.studyWidth;
      sp.sh = sp.studyHeight;
      sp.sx = {
        center: 0,
        west: -sp.sw,
        north: 0,
        east: sp.sw,
        south: 0
      };
      sp.sy = {
        center: 0,
        west: 0,
        north: sp.sh,
        east: 0,
        south: -sp.sh
      };
      return sp;
    }

    ikw(batch) {
      var build, col, group, j, k, key, l, len, len1, len2, plane, pracCube, pracGroup, practice, ref, ref1, ref2, row, sp, studies, study, studyCube, x, y, z;
      sp = this.space();
      build = new Build(batch);
      group = new THREE.Group();
      ref = [
        {
          name: 'Information',
          z: sp.z1
        },
        {
          name: 'Knowledge',
          z: sp.z2
        },
        {
          name: 'Wisdom',
          z: sp.z3
        }
      ];
      for (j = 0, len = ref.length; j < len; j++) {
        plane = ref[j];
        ref1 = [
          {
            name: 'Learn',
            y: sp.y1
          },
          {
            name: 'Do',
            y: sp.y2
          },
          {
            name: 'Share',
            y: sp.y3
          }
        ];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          row = ref1[k];
          ref2 = [
            {
              name: 'Embrace',
              x: sp.x3
            },
            {
              name: 'Innovate',
              x: sp.x2
            },
            {
              name: 'Encourage',
              x: sp.x1
            }
          ];
          for (l = 0, len2 = ref2.length; l < len2; l++) {
            col = ref2[l];
            practice = build.getPractice(plane.name, row.name, col.name);
            studies = build.getStudies(plane.name, practice.name);
            pracCube = new Cube(plane.name, row.name, col.name, practice.name, [col.x, row.y, plane.z], [sp.cubeWidth, sp.cubeHeight, sp.cubeDepth], practice.hsv, 0.6, this.fontPrac);
            pracGroup = new THREE.Group();
            pracGroup.add(pracCube.mesh);
            for (key in studies) {
              study = studies[key];
              x = col.x + sp.sx[study.dir];
              y = row.y + sp.sy[study.dir];
              z = plane.z;
              studyCube = new Rect(plane.name, row.name, col.name, study.name, [x, y, z], [sp.sw, sp.sh], study.hsv, 1.0, this.fontPrac);
              pracGroup.add(studyCube.mesh);
            }
            group.add(pracGroup);
          }
        }
      }
      this.convey(build, sp, group);
      this.flow(build, sp, group);
      this.conduit(build, sp, group);
      group.material = new THREE.MeshLambertMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
      });
      group.rotation.set(0, 0, 0);
      group.position.set(0, 0, 0);
      group.scale.set(1, 1, 1);
      this.scene.add(group);
      return group;
    }

    convey(build, sp, group) {
      var beg, col, end, h, hsv, j, k, l, len, len1, len2, name, plane, practice, rect, ref, ref1, ref2, row, w, x;
      hsv = [0, 50, 50];
      w = sp.horzSpace;
      h = sp.studyHeight;
      x = (sp.cubeWidth + w) / 2;
      ref = [
        {
          name: 'Information',
          z: sp.z1
        },
        {
          name: 'Knowledge',
          z: sp.z2
        },
        {
          name: 'Wisdom',
          z: sp.z3
        }
      ];
      for (j = 0, len = ref.length; j < len; j++) {
        plane = ref[j];
        ref1 = [
          {
            name: 'Learn',
            y: sp.y1
          },
          {
            name: 'Do',
            y: sp.y2
          },
          {
            name: 'Share',
            y: sp.y3
          }
        ];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          row = ref1[k];
          ref2 = [
            {
              name: 'Embrace',
              x: sp.x3 + x
            },
            {
              name: 'Innovate',
              x: sp.x2 + x
            }
          ];
          for (l = 0, len2 = ref2.length; l < len2; l++) {
            col = ref2[l];
            practice = build.getPractice(plane.name, row.name, col.name);
            [beg, end] = build.connectName(practice, 'east');
            name = beg + '\n' + end;
            rect = new Rect(plane.name, row.name, col.name, name, [col.x, row.y, plane.z], [w, h], hsv, 0.7, this.fontPrac);
            group.add(rect.mesh);
          }
        }
      }
    }

    flow(build, sp, group) {
      var beg, col, end, h, hsv, j, k, l, len, len1, len2, name, plane, practice, rect, ref, ref1, ref2, row, w, y;
      hsv = [0, 50, 50];
      w = sp.studyWidth;
      h = sp.vertSpace;
      y = (sp.cubeHeight + h) / 2;
      ref = [
        {
          name: 'Information',
          z: sp.z1
        },
        {
          name: 'Knowledge',
          z: sp.z2
        },
        {
          name: 'Wisdom',
          z: sp.z3
        }
      ];
      for (j = 0, len = ref.length; j < len; j++) {
        plane = ref[j];
        ref1 = [
          {
            name: 'Learn',
            y: sp.y1 - y
          },
          {
            name: 'Do',
            y: sp.y2 - y
          }
        ];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          row = ref1[k];
          ref2 = [
            {
              name: 'Embrace',
              x: sp.x3
            },
            {
              name: 'Innovate',
              x: sp.x2
            },
            {
              name: 'Encourage',
              x: sp.x1
            }
          ];
          for (l = 0, len2 = ref2.length; l < len2; l++) {
            col = ref2[l];
            practice = build.getPractice(plane.name, row.name, col.name);
            [beg, end] = build.connectName(practice, 'south');
            name = beg + '\n' + end;
            rect = new Rect(plane.name, row.name, col.name, name, [col.x, row.y, plane.z], [w, h], hsv, 0.7, this.fontPrac);
            group.add(rect.mesh);
          }
        }
      }
    }

    conduit(build, sp, group) {
      var beg, col, end, h, hsv, j, k, l, len, len1, len2, name, plane, practice, rect, ref, ref1, ref2, row, w, z;
      hsv = [0, 50, 50];
      w = sp.studyWidth;
      h = sp.zzzzSpace;
      z = (sp.cubeDepth + h) / 2;
      ref = [
        {
          name: 'Information',
          z: sp.z1 - z
        },
        {
          name: 'Knowledge',
          z: sp.z2 - z
        }
      ];
      for (j = 0, len = ref.length; j < len; j++) {
        plane = ref[j];
        ref1 = [
          {
            name: 'Learn',
            y: sp.y1
          },
          {
            name: 'Do',
            y: sp.y2
          },
          {
            name: 'Share',
            y: sp.y3
          }
        ];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          row = ref1[k];
          ref2 = [
            {
              name: 'Embrace',
              x: sp.x3
            },
            {
              name: 'Innovate',
              x: sp.x2
            },
            {
              name: 'Encourage',
              x: sp.x1
            }
          ];
          for (l = 0, len2 = ref2.length; l < len2; l++) {
            col = ref2[l];
            practice = build.getPractice(plane.name, row.name, col.name);
            [beg, end] = build.connectName(practice, 'next');
            name = beg + '\n' + end;
            rect = new Rect(plane.name, row.name, col.name, name, [0, 0, 0], [w, h], hsv, 0.7, this.fontPrac);
            rect.mesh.rotation.x = -Math.PI / 2;
            rect.mesh.position.x = col.x;
            rect.mesh.position.y = row.y;
            rect.mesh.position.z = plane.z;
            group.add(rect.mesh);
          }
        }
      }
    }

    faces() {
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
      this.scene.add(mesh);
    }

    ground() {
      var planeGeometry, planeMaterial, planeMesh;
      planeGeometry = new THREE.BoxGeometry(10, 10, 0.1);
      planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      });
      planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      planeMesh.position.set(0, -3, 0);
      planeMesh.rotation.set(0, 0, 0);
      planeMesh.rotation.x = this.deg2rad(90);
      planeMesh.receiveShadow = true;
      this.scene.add(planeMesh);
    }

    lights() {
      var object3d, spotLight;
      object3d = new THREE.DirectionalLight('white', 0.15);
      object3d.position.set(6, 3, 9);
      object3d.name = 'Back light';
      this.scene.add(object3d);
      object3d = new THREE.DirectionalLight('white', 0.35);
      object3d.position.set(-6, -3, 0);
      object3d.name = 'Key light';
      this.scene.add(object3d);
      object3d = new THREE.DirectionalLight('white', 0.55);
      object3d.position.set(9, 9, 6);
      object3d.name = 'Fill light';
      this.scene.add(object3d);
      spotLight = new THREE.SpotLight(0xffffff);
      spotLight.position.set(3, 30, 3);
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 2048;
      spotLight.shadow.mapSize.height = 2048;
      spotLight.shadow.camera.near = 1;
      spotLight.shadow.camera.far = 4000;
      spotLight.shadow.camera.fov = 45;
      this.scene.add(spotLight);
    }

    ui(group) {
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
          // console.log( 'traverse', { name:child.name, tprop:prop, cprop:child[prop], value:value, visible:child.visible } )
          if ((child[prop] != null) && child[prop] === value) {
            return child.visible = visible;
          }
        };
        if (group != null) {
          // console.log( 'reveal',  { name:child.name, geom:child.geom, prop:prop, value:value, visible:child.visible } )
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
      f4.add(act, 'RotationX', -180, 180).onChange(() => {
        return group.rotation.x = this.deg2rad(act.RotationX);
      });
      f4.add(act, 'RotationY', -180, 180).onChange(() => {
        return group.rotation.y = this.deg2rad(act.RotationY);
      });
      f4.add(act, 'RotationZ', -180, 180).onChange(() => {
        return group.rotation.z = this.deg2rad(act.RotationZ);
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
      return [gui, act];
    }

    dec2hex(i) {
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
    }

    animate() {
      requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderScene();
    }

    renderScene() {
      this.renderer.render(this.scene, this.camera);
    }

    geom() {
      var geometry, geometry2, material, material2, mesh, mesh2;
      geometry = new THREE.BoxGeometry(2, 2, 2);
      material = new THREE.MeshLambertMaterial({
        color: color,
        transparent: true
      });
      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      mesh.rotation.set(0, 0, 0);
      mesh.rotation.y = this.deg2rad(-90);
      mesh.scale.set(1, 1, 1);
      mesh.doubleSided = true;
      mesh.castShadow = true;
      this.scene.add(mesh);
      geometry2 = new THREE.BoxGeometry(1, 1, 1);
      material2 = new THREE.MeshLambertMaterial({
        color: color,
        transparent: true
      });
      mesh2 = new THREE.Mesh(geometry2, material2);
      this.scene.add(mesh2);
    }

  };

  Data.local = "http://localhost:63342/th/public/";

  Data.hosted = "https://ui-48413.firebaseapp.com/";

  Muse.FontUrl = "webfonts/helvetiker_regular.typeface.json";

  Muse.Batch = {
    Muse: {
      url: 'json/Muse.json',
      data: null,
      type: 'Spec'
    },
    Info: {
      url: 'json/Info.json',
      data: null,
      type: 'Pack'
    },
    Know: {
      url: 'json/Know.json',
      data: null,
      type: 'Pack'
    },
    Wise: {
      url: 'json/Wise.json',
      data: null,
      type: 'Pack'
    },
    Tops: {
      url: 'json/Tops.json',
      data: null,
      type: 'Spec'
    },
    Font: {
      url: Muse.FontUrl,
      data: null,
      type: 'Spec'
    }
  };

  Data.batchRead(Muse.Batch, Muse.init);

  return Muse;

}).call(this);
