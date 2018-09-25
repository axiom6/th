import Util     from '../util/Util.js';
import Vis      from '../vis/Vis.js';
var Rect;

Rect = class Rect {
  constructor(plane, row, col1, title, xyz, whd, hsv, opacity) {
    var col, mat, rec, rgb;
    this.plane = plane;
    this.row = row;
    this.col = col1;
    this.title = title;
    this.xyz = xyz;
    this.whd = whd;
    this.hsv = hsv;
    this.opacity = opacity;
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
  }

  colorRgb(rgb) {
    return `rgb(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)})`;
  }

};

export default Rect;
