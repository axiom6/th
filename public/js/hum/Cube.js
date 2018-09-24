import Util     from '../util/Util.js';
import Vis      from '../vis/Vis.js';
var Cube;

Cube = (function() {
  class Cube {
    constructor(title, xyz, ang, whd, hsv) {
      var box, col, len, mat, pos, rgb, rot;
      this.title = title;
      this.xyz = xyz;
      this.ang = ang;
      this.whd = whd;
      this.hsv = hsv;
      box = new THREE.BoxBufferGeometry();
      pos = new THREE.Vector3(this.xyz[0], this.xyz[1], this.xyz[2]);
      rot = new THREE.Euler(this.ang[0], this.ang[1], this.ang[2], 'XYZ');
      len = new THREE.Vector3(this.whd[0], this.whd[1], this.whd[2]);
      rgb = Vis.toRgbHsv(this.hsv[0], this.hsv[1], this.hsv[2]);
      col = new THREE.Color(this.colorRgb(rgb));
      mat = new THREE.MeshBasicMaterial({
        color: col,
        opacity: 0.5,
        transparent: true
      });
      Cube.quaternion.setFromEuler(rot, false);
      Cube.matrix.compose(pos, Cube.quaternion, len);
      box.applyMatrix(Cube.matrix);
      this.mesh = new THREE.Mesh(box, mat);
    }

    //console.log( 'Cube', xyz )
    colorRgb(rgb) {
      return `rgb(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)})`;
    }

  };

  Cube.Faces = ['Front', 'West', 'North', 'East', 'South', 'Back'];

  Cube.matrix = new THREE.Matrix4();

  Cube.quaternion = new THREE.Quaternion();

  Cube.color = new THREE.Color();

  return Cube;

}).call(this);

export default Cube;
