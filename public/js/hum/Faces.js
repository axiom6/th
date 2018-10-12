import Util  from '../util/Util.js';
import Vis   from '../vis/Vis.js';
import Build from '../hum/Build.js';
var Faces;

Faces = (function() {
  class Faces {
    constructor(plane, row, col, title, xyz, whd, hsv, opacity) {
      this.plane = plane;
      this.row = row;
      this.col = col;
      this.title = title;
      this.xyz = xyz;
      this.whd = whd;
      this.hsv = hsv;
      this.opacity = opacity;
    }

  };

  Cube.JSON = Build.syncJSON('webfonts/helvetiker_regular.typeface.json');

  Cube.Font = new THREE.Font(Cube.JSON);

  Faces.matrix = new THREE.Matrix4();

  return Faces;

}).call(this);
