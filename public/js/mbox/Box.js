import Util     from '../util/Util.js';
import Vis      from '../vis/Vis.js';
import MBox     from '../mbox/MBox.js';
import Coord    from '../mbox/Coord.js';
import Color    from '../mbox/Color.js';
import IKW      from '../mbox/IKW.js';
import MRegress from '../mbox/Regress.js';
var Box;

Box = class Box {
  static init() {
    return Util.ready(function() {
      return Box.doApp(MBox);
    });
  }

  static doApp(MBox) {
    var name, parse;
    parse = Util.parseURI(window.location);
    name = Util.isStr(parse.fragment) ? parse.fragment.substring(1) : '';
    switch (name) {
      case 'IKW':
        Box.doIKW(MBox);
        break;
      case 'Color':
        Box.doColor(MBox);
        break;
      case 'Rgbs':
        Box.doRgbs(MBox);
        break;
      case 'Polar':
        Box.doPolar(MBox);
        break;
      case 'Vecs':
        Box.doVecs(MBox, 'hsv');
        break;
      case 'Sphere':
        Box.doSphere(MBox);
        break;
      case 'Regress':
        Box.doRegress(MBox);
        break;
      default:
        Box.doIKW(MBox);
    }
  }

  static doRgbs(MBox) {
    var coord, mbox, view;
    mbox = new MBox();
    coord = new Coord(mbox, 11, 11, 11);
    view = coord.cartesian();
    return coord.cartArray(view);
  }

  static doColor(MBox) {
    var coord, mbox, view;
    mbox = new MBox();
    coord = new Coord(mbox, 8, 20, 20);
    view = coord.polar();
    coord.cylVolume(view, Vis.toRgbHsv);
    return coord.cylSurface(view, Vis.toRgbHsv, mbox.sin06F);
  }

  static doIKW(MBox) {
    var color, coord, ikw, mbox, view;
    mbox = new MBox();
    coord = new Coord(mbox, 3, 3, 3);
    color = new Color(mbox);
    ikw = new IKW(mbox, coord, color, 3, 3, 3);
    view = ikw.museCartesian();
    return ikw.viewArrays(view);
  }

  static doRegress(MBox) {
    var mbox, regress;
    mbox = new MBox();
    regress = new MRegress(mbox);
    return regress.viewLinearRegress();
  }

  static doSphere(MBox) {
    var coord, mbox, view;
    mbox = new MBox();
    coord = new Coord(mbox, 12, 60, 10);
    //color = new Color( mbox )
    view = coord.sphere();
    return coord.sphVolume(view, Vis.toRgbSphere);
  }

  static doHcs(MBox) {
    var color, coord, mbox, view;
    mbox = new MBox();
    coord = new Coord(mbox, 12, 10, 10);
    color = new Color(mbox);
    view = coord.polar();
    color.genWithHcs(coord, view);
    return coord.cylSurface(view, Vis.toRgbHcs, mbox.sin06F);
  }

  static doVecs(MBox, see) {
    var color, coord, mbox, view;
    mbox = new MBox();
    coord = new Coord(mbox, 12, 9, 9);
    color = new Color(mbox);
    view = coord.polar();
    return color.genWithVecsRgb(coord, view, see);
  }

  static doPolar(MBox) {
    var color, coord, mbox, view;
    mbox = new MBox();
    coord = new Coord(mbox, 12, 9, 9);
    color = new Color(mbox);
    view = coord.polar();
    return color.genPolarRgbs(coord, view, false);
  }

  static doScaleRgb(MBox) {
    var color, coord, mbox, view;
    mbox = new MBox();
    coord = new Coord(mbox, 12, 9, 9);
    color = new Color(mbox);
    view = coord.polar();
    return color.genPolarRgbs(coord, view, true);
  }

  static doRgbHcs() {
    var c, hue, i, j, len, len1, ref, ref1, results, s;
    s = 100;
    c = 100;
    ref = [0, 60, 120, 180, 240, 300];
    for (i = 0, len = ref.length; i < len; i++) {
      hue = ref[i];
      console.log('RgbHcs', {
        hue: hue,
        c: c,
        s: s
      }, Vis.toRgbHcs(hue, c, s));
      console.log('RgbHsv', {
        hue: hue,
        c: c,
        s: s
      }, Vis.toRgbHsv(hue, c, s));
    }
    ref1 = [0, 60, 120, 180, 240, 300];
    results = [];
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      hue = ref1[j];
      results.push((function() {
        var k, len2, ref2, results1;
        ref2 = [0, 20, 40, 60, 80, 100];
        results1 = [];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          c = ref2[k];
          console.log('RgbHcs', {
            hue: hue,
            c: c,
            s: s
          }, Vis.toRgbHcs(hue, c, s));
          results1.push(console.log('RgbHsv', {
            hue: hue,
            c: c,
            s: s
          }, Vis.toRgbHsv(hue, c, s)));
        }
        return results1;
      })());
    }
    return results;
  }

};

Box.init();

export default Box;
