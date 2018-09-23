import Util     from '../util/Util.js';
import Vis      from '../vis/Vis.js';
import MBox     from '../mbox/MBox.js';
var Coord;

Coord = class Coord {
  constructor(mbox, width1, height, depth = 10) {
    this.cylLookup = this.cylLookup.bind(this);
    this.mbox = mbox;
    this.width = width1;
    this.height = height;
    this.depth = depth;
    this.mathbox = this.mbox.mathbox;
    this.npoints = 24 * this.width;
  }

  // [[-100,100],[0,100],[-100,100]]
  cartesian(range = [[0, 1], [0, 1], [0, 1]], scale = [2, 1, 2], divide = [10, 10]) {
    var view;
    this.mathbox.camera({
      position: [2.4, 2.4, 2.4],
      proxy: true
    });
    view = this.mathbox.cartesian({
      range: range,
      scale: scale
    });
    this.axesXYZ(view, 8, 0xFFFFFF);
    this.gridXYZ(view, 4, 0xFFFFFF, divide[0], 0.7, '10');
    this.tickXYZ(view, 64, 0xFFFFFF, divide[1], 2);
    return view;
  }

  polar(range = [[0, 2 * π], [0, 100], [0, 100]], scale = [2, 1.5, 0.75]) {
    var view;
    this.mathbox.camera({
      position: [0, 0, 4],
      proxy: true // 2*π
    });
    view = this.mathbox.polar({
      range: range,
      scale: scale
    });
    //@tick(  view, 64, 0xFFFFFF, 12, 3, 1 )
    view.transform({
      position: [0, 100, 0]
    }).grid({
      unitX: π / 12,
      baseX: 2,
      zWrite: false,
      detailX: 81,
      divideX: 12,
      divideY: 10,
      axes: 'xz',
      blending: 'add',
      color: 0x00F0B0,
      width: this.width,
      opacity: 1
    });
    this.radPolar(view);
    return view;
  }

  sphere(range = [[0, 2 * π], [0, 2 * π], [0, 1]], scale = [1, 1, 1]) {
    var view;
    this.mathbox.camera({
      position: [0, 0, 4],
      proxy: true // 2*π
    });
    view = this.mathbox.spherical({
      range: range,
      scale: scale
    });
    return view;
  }

  axesXYZ(view, width, color) {
    return view.axis({
      axis: 1,
      width: width,
      color: color,
      end: false
    }).axis({
      axis: 2,
      width: width,
      color: color,
      end: false
    }).axis({
      axis: 3,
      width: width,
      color: color,
      end: false
    });
  }

  gridXYZ(view, width, color, divide, opacity, id) {
    return view.grid({
      axes: [1, 2],
      width: width,
      color: color,
      divideX: divide,
      divideY: divide,
      opacity: opacity,
      id: `gridXY${id}`
    }).grid({
      axes: [2, 3],
      width: width,
      color: color,
      divideX: divide,
      divideY: divide,
      opacity: opacity,
      id: `gridYZ${id}`
    }).grid({
      axes: [3, 1],
      width: width,
      color: color,
      divideX: divide,
      divideY: divide,
      opacity: opacity,
      id: `gridZX${id}`
    });
  }

  tickXYZ(view, size, color, divide, digits) {
    this.tick(view, size, color, divide, digits, 1);
    this.tick(view, size, color, divide, digits, 2);
    return this.tick(view, size, color, divide, digits, 3);
  }

  tick(view, size, color, divide, digits, axis) {
    var offset;
    offset = axis === 2 ? [0, 0.06] : [0.0];
    return view.scale({
      axis: axis,
      divide: divide
    }).ticks({
      zBias: axis,
      width: 5,
      size: size * 0.25,
      color: color
    }).format({
      digits: digits,
      font: "Arial"
    }).label({
      size: size,
      depth: 1,
      color: color,
      outline: 1,
      offset: offset
    });
  }

  radPolar(view) {
    var points;
    points = view.area(this.angPolar());
    return view.vector({
      points: points,
      color: 'white',
      width: 10
    });
  }

  angPolar() {
    var obj;
    obj = {
      id: "angPolar",
      axes: [1, 2],
      width: 13,
      height: 1,
      items: 2,
      channels: 3
    };
    obj.expr = (emit, a, r) => {
      Util.noop(r);
      emit(0, 0, 1);
      emit(a, 1, 1);
    };
    return obj;
  }

  cartData(range = [[0, 1], [0, 1], [0, 1]]) {
    var array, dx, dy, dz, k, l, m, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, x, y, z;
    array = [];
    dx = (range[0][1] - range[0][0]) / (this.width - 1);
    dy = (range[1][1] - range[1][0]) / (this.height - 1);
    dz = (range[2][1] - range[2][0]) / (this.depth - 1);
    for (x = k = ref = range[0][0], ref1 = range[0][1], ref2 = dx; ref2 !== 0 && (ref2 > 0 ? k <= ref1 : k >= ref1); x = k += ref2) {
      for (y = l = ref3 = range[1][0], ref4 = range[1][1], ref5 = dy; ref5 !== 0 && (ref5 > 0 ? l <= ref4 : l >= ref4); y = l += ref5) {
        for (z = m = ref6 = range[2][0], ref7 = range[2][1], ref8 = dz; ref8 !== 0 && (ref8 > 0 ? m <= ref7 : m >= ref7); z = m += ref8) {
          array.push([x, y, z, 1]);
        }
      }
    }
    return {
      data: array,
      items: 1,
      channels: 4,
      live: false,
      id: 'cartData',
      width: this.width * this.height * this.depth
    };
  }

  cartPoints(id = "cartPoints") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      items: 1,
      channels: 4
    };
    obj.expr = (emit, x, y, z) => {
      return emit(x, y, z, 1);
    };
    return obj;
  }

  cartColors(toRgb, id = "cartColors") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      channels: 4 
    };
    obj.expr = (emit, x, y, z) => {
      var b, g, r;
      [r, g, b] = toRgb(x, y, z);
      return emit(r, g, b, 1);
    };
    return obj;
  }

  point(size = 40, pid = "points", cid = "colors") {
    return {
      points: '#' + pid,
      colors: '#' + cid,
      color: 0xffffff,
      size: size
    };
  }

  cartVolume(view, toRgb) {
    view.volume(this.cartPoints());
    view.volume(this.cartColors(toRgb));
    return view.point(this.point(40, "cartPoints", "cartColors"));
  }

  cartArray(view) {
    view.array(this.cartData());
    return view.point(this.point(40, "cartData", "cartData"));
  }

  cartSurfPoints(toZ, id = "cartSurfPoints") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      axes: [1, 3],
      channels: 3
    };
    obj.expr = (emit, x, y) => {
      return emit(x, toZ(x, y), y);
    };
    return obj;
  }

  cartSurfColors(toRgb, id = "cartSurfColors") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      channels: 4,
      axes: [
        1,
        2 
      ]
    };
    obj.expr = (emit, x, y) => {
      var b, g, r;
      [r, g, b] = toRgb(x, y);
      return emit(r, g, b, 1);
    };
    return obj;
  }

  cartSurface(view, toDep, toRgb) {
    var colors, points;
    points = view.area(this.cartSurfPoints(toDep));
    colors = view.area(this.cartSurfColors(toRgb));
    return view.surface({
      points: points,
      colors: colors,
      color: 0xffffff,
      shaded: false,
      opacity: 1.0,
      lineX: true,
      lineY: true,
      width: 5
    });
  }

  cylData(range = [[0, 2 * π], [0, 100], [0, 100]]) {
    var array, c, dx, dy, dz, h, k, l, m, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, s;
    array = [];
    dx = (range[0][1] - range[0][0]) / this.width;
    dy = (range[1][1] - range[1][0]) / this.height;
    dz = (range[2][1] - range[2][0]) / this.depth;
    for (h = k = ref = range[0][0], ref1 = range[0][1], ref2 = dx; ref2 !== 0 && (ref2 > 0 ? k <= ref1 : k >= ref1); h = k += ref2) {
      for (c = l = ref3 = range[1][0], ref4 = range[1][1], ref5 = dy; ref5 !== 0 && (ref5 > 0 ? l <= ref4 : l >= ref4); c = l += ref5) {
        for (s = m = ref6 = range[2][0], ref7 = range[2][1], ref8 = dz; ref8 !== 0 && (ref8 > 0 ? m <= ref7 : m >= ref7); s = m += ref8) {
          array.push([h, c, s]);
        }
      }
    }
    return {
      data: array,
      items: 1,
      channels: 4,
      live: false,
      id: 'hcss',
      width: this.width * this.height * this.depth
    };
  }

  // Cylindrical ang, rad, dep
  cylPoints(id = "cylPoints") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      items: 1,
      channels: 4
    };
    obj.expr = (emit, ang, rad, dep, i) => {
      var radian;
      radian = this.mbox.toRad(i, this.width);
      return emit(radian, rad, dep, 1);
    };
    return obj;
  }

  // Cylindrical ang, rad, dep  
  cylColors(toRgb, id = "cylColors") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      channels: 4 
    };
    obj.expr = (emit, ang, rad, dep, i) => {
      var b, g, hue, r;
      hue = this.mbox.toHue(i, this.width);
      [r, g, b] = toRgb(hue, rad, dep); // HCS
      return emit(r, g, b, 1);
    };
    return obj;
  }

  cylVolume(view, toRgb) {
    view.volume(this.cylPoints());
    view.volume(this.cylColors(toRgb));
    return view.point(this.point(40, "cylPoints", "cylColors"));
  }

  cylLookup(view, hcss, rgbs) {
    view.array({
      data: hcss,
      id: "hcss",
      items: 1,
      channels: 4,
      live: false,
      width: hcss.length
    });
    view.array({
      data: rgbs,
      id: "rgbs",
      items: 1,
      channels: 4,
      live: false,
      width: rgbs.length
    });
    return view.point({
      points: '#' + "hcss",
      colors: '#' + "rgbs",
      color: 0xffffff,
      size: 40
    });
  }

  cylSurfPoints(toDep, id = "cylSurfPoints") {
    var obj;
    obj = {
      id: id,
      width: this.npoints + 1,
      height: this.height,
      axes: [1, 2],
      channels: 3 // Need @npoints+1 to complete rotation
    };
    obj.expr = (emit, ang, rad, i) => {
      var radian;
      radian = this.mbox.toRad(i, this.npoints);
      return emit(radian, rad, 100 * toDep(radian, rad));
    };
    return obj;
  }

  cylSurfColors(toDep, toRgb, id = "cylSurfColors") {
    var obj;
    obj = {
      id: id,
      width: this.npoints + 1,
      height: this.height,
      channels: 4,
      axes: [
        1,
        2 // Need @npoints+1 to complete rotation
      ]
    };
    obj.expr = (emit, ang, rad, i) => {
      var b, g, hue, r, radian;
      hue = this.mbox.toHue(i, this.npoints);
      radian = this.mbox.toRad(i, this.npoints);
      [r, g, b] = toRgb(hue, rad, toDep(radian, rad) * 100);
      return emit(r, g, b, 1);
    };
    return obj;
  }

  cylSurface(view, toRgb, toDep) {
    var colors, points;
    points = view.area(this.cylSurfPoints(toDep));
    colors = view.area(this.cylSurfColors(toDep, toRgb));
    return view.surface({
      points: points,
      colors: colors,
      color: 0xffffff,
      shaded: false,
      opacity: 1.0,
      lineX: true,
      lineY: true,
      width: 5
    });
  }

  // Spherical Points
  sphPoints(id = "sphPoints") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      items: 1,
      channels: 4
    };
    obj.expr = (emit, ang1, ang2, rad, i, j) => {
      return emit(i * π * 2 / this.width, j * π * 2 / this.height, rad, 1); //if j*π*2/@height <= π
    };
    return obj;
  }

  sphColors(toRgb, id = "sphColors") {
    var obj;
    obj = {
      id: id,
      width: this.width,
      height: this.height,
      depth: this.depth,
      channels: 4 
    };
    obj.expr = (emit, ang1, ang2, rad, i, j) => {
      var b, g, r;
      [r, g, b] = toRgb(i * 360 / this.width, j * 360 / this.height, rad);
      return emit(r, g, b, 1);
    };
    return obj;
  }

  sphVolume(view, toRgb) {
    view.volume(this.sphPoints());
    view.volume(this.sphColors(toRgb));
    return view.point(this.point(40, "sphPoints", "sphColors"));
  }

  domeColors() {
    var obj;
    obj = {
      id: 'domeColors',
      width: this.width,
      height: this.height,
      depth: this.depth,
      channels: 4 
    };
    obj.expr = (emit, ang1, ang2, rad, i, j) => {
      var b, g, r;
      if (j * 360 / this.height <= 180) {
        [r, g, b] = Vis.toRgbHsv(i * 360 / this.width, j * 360 / this.height, rad);
        return emit(r, g, b, 1);
      } else {
        return emit(0, 0, 0, 0);
      }
    };
    return obj;
  }

};

export default Coord;
