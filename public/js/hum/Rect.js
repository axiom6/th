import Util     from '../util/Util.js';
import Vis      from '../vis/Vis.js';
var Rect;

Rect = (function() {
  class Rect {
    constructor(plane, row, col1, title, xyz, whd, hsv, opacity, font) {
      var col, dx, dy, face, mat, mats, obj, offsetY, rec, rgb, side, text;
      this.plane = plane;
      this.row = row;
      this.col = col1;
      this.title = title;
      this.xyz = xyz;
      this.whd = whd;
      this.hsv = hsv;
      this.opacity = opacity;
      this.font = font;
      rec = new THREE.PlaneGeometry(this.whd[0], this.whd[1]);
      rec.translate(this.xyz[0], this.xyz[1], this.xyz[2]);
      rgb = Vis.toRgbHsv(this.hsv[0], this.hsv[1], this.hsv[2]);
      col = new THREE.Color(this.colorRgb(rgb));
      mat = new THREE.MeshBasicMaterial({
        color: col,
        opacity: this.opacity,
        transparent: true,
        side: THREE.DoubleSide
      });
      this.mesh = new THREE.Mesh(rec, mat);
      this.mesh.name = this.title;
      this.mesh.geom = "Rect";
      this.mesh.plane = this.plane;
      this.mesh.row = this.row;
      this.mesh.col = this.col;
      obj = {
        font: this.font,
        size: 10,
        height: 5,
        curveSegments: 2
      };
      text = new THREE.TextBufferGeometry(this.title, obj);
      text.computeBoundingBox();
      face = new THREE.MeshBasicMaterial({
        color: 0x000000
      });
      side = new THREE.MeshBasicMaterial({
        color: 0x000000
      });
      mats = [face, side];
      offsetY = !Util.inString(this.title, '\n');
      dx = 0.5 * (text.boundingBox.max.x - text.boundingBox.min.x);
      dy = offsetY ? 0.5 * (text.boundingBox.max.y - text.boundingBox.min.y) : 0;
      Rect.matrix.makeTranslation(this.xyz[0] - dx, this.xyz[1] - dy, this.xyz[2]);
      text.applyMatrix(Rect.matrix);
      this.tmesh = new THREE.Mesh(text, mats);
      this.tmesh.name = this.title;
      this.tmesh.geom = "Text";
      this.tmesh.plane = this.plane;
      this.tmesh.row = this.row;
      this.tmesh.col = this.col;
      this.mesh.add(this.tmesh);
    }

    colorRgb(rgb) {
      return `rgb(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)})`;
    }

  };

  Rect.matrix = new THREE.Matrix4();

  return Rect;

}).call(this);

export default Rect;
