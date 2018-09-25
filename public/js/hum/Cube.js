import Util  from '../util/Util.js';
import Vis   from '../vis/Vis.js';
import Build from '../hum/Build.js';
var Cube;

Cube = (function() {
  class Cube {
    constructor(title, xyz, whd, hsv, opacity) {
      var box, col, face, mat, mats, obj, rgb, side, text;
      this.title = title;
      this.xyz = xyz;
      this.whd = whd;
      this.hsv = hsv;
      this.opacity = opacity;
      box = new THREE.BoxBufferGeometry();
      Cube.matrix.makeScale(this.whd[0], this.whd[1], this.whd[2]);
      box.applyMatrix(Cube.matrix);
      Cube.matrix.makeTranslation(this.xyz[0], this.xyz[1], this.xyz[2]);
      box.applyMatrix(Cube.matrix);
      rgb = Vis.toRgbHsv(this.hsv[0], this.hsv[1], this.hsv[2]);
      col = new THREE.Color(this.colorRgb(rgb));
      mat = new THREE.MeshPhongMaterial({
        color: col,
        opacity: this.opacity,
        transparent: true,
        side: THREE.BackSide // blemding:THREE.AdditiveBlending
      });
      this.mesh = new THREE.Mesh(box, mat);
      // font: "helvetiker",
      obj = {
        font: Cube.Font,
        size: 12,
        height: 6,
        curveSegments: 2 // "helvetiker"
      };
      text = new THREE.TextBufferGeometry(this.title, obj);
      face = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
      side = new THREE.MeshBasicMaterial({
        color: 0xffffff
      });
      mats = [face, side];
      text.applyMatrix(Cube.matrix);
      this.tmesh = new THREE.Mesh(text, mats);
    }

    colorRgb(rgb) {
      return `rgb(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)})`;
    }

  };

  Cube.JSON = Build.syncJSON('webfonts/helvetiker_regular.typeface.json');

  Cube.Font = new THREE.Font(Cube.JSON);

  Cube.matrix = new THREE.Matrix4();

  return Cube;

}).call(this);

//mat = new THREE.MeshPhongMaterial( { color:col, opacity:@opacity, transparent:true, side:THREE.BackSide, blemding:THREE.AdditiveBlending } )
//mat = new THREE.MeshBasicMaterial( { color:col, opacity:@opacity, transparent:true } ) # blemding:THREE.AdditiveBlending
export default Cube;
