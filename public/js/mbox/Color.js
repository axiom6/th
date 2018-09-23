import Util     from '../util/Util.js';
import Vis      from '../vis/Vis.js';
import MBox     from '../mbox/MBox.js';
var Color;

Color = class Color {
  constructor(mbox) {
    this.toRygbFromHue = this.toRygbFromHue.bind(this);
    this.toRgbFromHue = this.toRgbFromHue.bind(this);
    this.genWithVecs = this.genWithVecs.bind(this);
    this.genWithVecsRgb = this.genWithVecsRgb.bind(this);
    this.genPolarRgbs = this.genPolarRgbs.bind(this);
    //genPolarSurf(   view, hcss, rgbs )
    this.genPolarSurf = this.genPolarSurf.bind(this);
    this.mbox = mbox;
    this.spaces = ['hci', 'rgb', 'hsi', 'hsl', 'hsv', 'lab', 'lch', 'hcl', 'cmyk', 'gl'];
  }

  addARgb(a, r, g, b) {
    return [r + a, g + a, b + a];
  }

  mulSRgb(s, r, g, b) {
    return [r * s, g * s, b * s];
  }

  addARygb(a, r, y, g, b) {
    return [r + a, y + a, g + a, b + a];
  }

  mulSRygb(s, r, y, g, b) {
    return [r * s, y * s, g * s, b * s];
  }

  addRygbs(rygb1, rygb2) {
    var i, j, rygb3;
    rygb3 = [0, 0, 0, 0];
    for (i = j = 0; j < 4; i = ++j) {
      rygb3[i] = rygb1[i] + rygb2[i];
    }
    return rygb3;
  }

  toRygbFromHue(hue) {
    var b, cos, g, r, rygb, sin, y;
    cos = Math.abs(Vis.cos(hue));
    sin = Math.abs(Vis.sin(hue));
    [r, y, g, b] = [cos, sin, cos, sin];
    rygb = [0, 0, 0, 0];
    if (0 <= hue && hue < 90) {
      rygb = [r, y, 0, 0];
    } else if (90 <= hue && hue < 180) {
      rygb = [0, y, g, 0];
    } else if (180 <= hue && hue < 270) {
      rygb = [0, 0, g, b];
    } else if (270 <= hue && hue < 360) {
      rygb = [r, 0, 0, b];
    }
    return rygb;
  }

  toRgbFromHue(hue) {
    var B, G, R, cos, rgb;
    cos = function(h) {
      return Math.abs(Vis.cos(h * 90 / 120));
    };
    [R, G, B] = [cos(hue), cos(hue - 120), cos(hue - 240), 1];
    rgb = [0, 0, 0];
    if (0 <= hue && hue < 120) {
      rgb = [R, G, 0];
    } else if (120 <= hue && hue < 240) {
      rgb = [0, G, B];
    } else if (240 <= hue && hue < 360) {
      rgb = [R, 0, B];
    }
    return rgb;
  }

  genWithVecs(coord, view) {
    var hcss, rgbs;
    [hcss, rgbs] = this.genVecs();
    return coord.cylLookup(view, hcss, rgbs);
  }

  genWithVecsRgb(coord, view, see) {
    var hcss, rgbs;
    [hcss, rgbs] = this.genVecsRgb(see);
    return coord.cylLookup(view, hcss, rgbs);
  }

  genPolarRgbs(coord, view, scale) {
    var hcss, rgbs;
    [hcss, rgbs] = this.genPolarRgb(scale);
    console.log('genPolarRgbs', hcss.length, rgbs.length);
    return coord.cylLookup(view, hcss, rgbs);
  }

  genPolarSurf(view, hcss, rgbs) {
    var colors, i, j, k, len, points, pts, ref, ref1, results, rgs, s, sh;
    ref = [90];
    //[0,10,20,30,40,50,60,70,80,90]
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      s = ref[j];
      //view.play( { delay:1, speed:1000 } )
      points = [];
      colors = [];
      for (i = k = 0, ref1 = hcss.length; (0 <= ref1 ? k < ref1 : k > ref1); i = 0 <= ref1 ? ++k : --k) {
        sh = hcss[i][2];
        if (s <= sh && sh < s + 10) {
          points.push(hcss[i]);
          colors.push(rgbs[i]);
        }
      }
      pts = view.area({
        data: points,
        width: points.length,
        height: 1,
        axes: [1, 2],
        channels: 3
      });
      rgs = view.area({
        data: colors,
        width: colors.length,
        height: 1,
        axes: [1, 2],
        channels: 3
      });
      results.push(view.surface({
        points: pts,
        colors: rgs,
        color: 0xffffff,
        shaded: false,
        opacity: 1.0,
        lineX: true,
        lineY: true,
        width: 5
      }));
    }
    return results;
  }

  toHue(C1, N) { // ,C2
    var hue, n;
    n = 100 - N;
    hue = n;
    if (C1 === 'Y') {
      hue = n;
    } else if (C1 === 'G') {
      hue = n + 100;
    } else if (C1 === 'B') {
      hue = n + 200;
    } else if (C1 === 'R') {
      hue = n + 300;
    } else if (C1 === ' ') {
      hue = 0;
    }
    hue = hue * 0.9;
    if (hue === 360) {
      hue = 0;
    }
    return hue;
  }

  scsPts(colors) {
    var color, key, pts;
    pts = [];
    for (key in colors) {
      color = colors[key];
      pts.push([Vis.toRadian(color.hue - 2), color.c, 100 - color.s, 1]);
      pts.push([Vis.toRadian(color.hue + 2), color.c, 100 - color.s, 1]);
    }
    return pts;
  }

  scsRgbs(colors) {
    var color, key, rgbs, s;
    rgbs = [];
    s = 1 / 255;
    for (key in colors) {
      color = colors[key];
      rgbs.push([color.r * s, color.g * s, color.b * s, 1]);
      rgbs.push([color.R * s, color.G * s, color.B * s, 1]);
    }
    return rgbs;
  }

  genVecsCompare() {
    var c, hcss, hue, j, k, l, len, len1, ref, ref1, rgbs, s;
    hcss = [];
    rgbs = [];
    for (hue = j = 0; j < 360; hue = j += 15) {
      ref = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      for (k = 0, len = ref.length; k < len; k++) {
        c = ref[k];
        ref1 = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          s = ref1[l];
          hcss.push([Vis.toRadian(hue - 3), c, s, 1]);
          hcss.push([Vis.toRadian(hue), c, s, 1]);
          hcss.push([Vis.toRadian(hue + 3), c, s, 1]);
          rgbs.push(Vis.toRgbHcs(hue, c, s, true));
          rgbs.push(Vis.toRgbHcs2(hue, c, s, true));
          rgbs.push(Vis.toRgbHsv(hue, c, s, true));
        }
      }
    }
    return [hcss, rgbs];
  }

  genVecs() {
    var c, hcss, hue, j, k, l, len, len1, ref, ref1, rgbs, s;
    hcss = [];
    rgbs = [];
    for (hue = j = 0; j < 360; hue = j += 15) {
      ref = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      for (k = 0, len = ref.length; k < len; k++) {
        c = ref[k];
        ref1 = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          s = ref1[l];
          hcss.push([Vis.toRadian(hue), c, s, 1]);
          rgbs.push(Vis.toRgbHsv(hue, c, s, true));
        }
      }
    }
    return [hcss, rgbs];
  }

  genVecsRgb(see) {
    var b, c, g, h, hcss, hue, j, k, l, len, len1, m, o, p, r, ref, ref1, rgbs, s, sf, ss;
    hcss = [];
    rgbs = [];
    sf = 1 / 255;
    if (see === 'two' || see === 'rgb') {
      for (r = j = 0; j <= 255; r = j += 15) {
        for (g = k = 0; k <= 255; g = k += 15) {
          for (b = l = 0; l <= 255; b = l += 15) {
            [h, c, s] = Vis.toHcsRgb(r, g, b);
            if (h % 15 <= 2 || h % 15 >= 13) {
              ss = Vis.sScale(h, c, s);
              hcss.push([Vis.toRadian(h - 2, false), c, ss, 1]);
              rgbs.push([r * sf, g * sf, b * sf, 1]);
            }
          }
        }
      }
    }
    if (see === 'two' || see === 'hsv') {
      for (hue = m = 0; m < 360; hue = m += 15) {
        ref = [0, 16, 32, 48, 64, 80, 100];
        for (o = 0, len = ref.length; o < len; o++) {
          c = ref[o];
          ref1 = [0, 16, 32, 48, 64, 80, 100];
          for (p = 0, len1 = ref1.length; p < len1; p++) {
            s = ref1[p];
            hcss.push([Vis.toRadian(hue + 2), c, s, 1]);
            rgbs.push(Vis.toRgbHsvSigmoidal(hue, c, s, false));
          }
        }
      }
    }
    return [hcss, rgbs];
  }

  // console.log( 'gpr', { r:r, g:g, b:b, hue:hue, c:Math.round(c), s:Math.round(s) } ) if c is 0
  // hRygb = h # @hueRygb( hue )
  genPolarRgb(scale = false) {
    var b, c, g, h, hcss, j, k, l, r, rgbs, s, sf, ss;
    hcss = [];
    rgbs = [];
    sf = 1 / 255;
    for (r = j = 0; j <= 255; r = j += 15) {
      for (g = k = 0; k <= 255; g = k += 15) {
        for (b = l = 0; l <= 255; b = l += 15) {
          [h, c, s] = Vis.toHcsRgb(r, g, b);
          ss = scale ? Vis.sScale(h, c, s) : s;
          hcss.push([Vis.toRadian(h, false), c, ss, 1]);
          rgbs.push([r * sf, g * sf, b * sf, 1]);
        }
      }
    }
    return [hcss, rgbs];
  }

  // Hue in RYGB
  vecs(hue) {
    var c, s, v1, v2, y;
    v1 = [1, 1, 1];
    v2 = [1, 1, 1];
    c = Math.abs(Vis.cos(hue));
    s = Math.abs(Vis.sin(hue));
    y = Math.max(c, s);
    if (0 <= hue && hue < 90) {
      v2 = [y, s, 0];
    } else if (90 <= hue && hue < 180) {
      v2 = [c, y, 0];
    } else if (180 <= hue && hue < 270) {
      v2 = [0, c, s];
    } else if (270 <= hue && hue < 360) {
      v2 = [c, 0, s];
    }
    return [v1, v2];
  }

  csvec(c, s, v1, v2) {
    var c1, c2, i, j, v3;
    c1 = 0.0001 * s * (100 - c);
    c2 = 0.0001 * s * c;
    v3 = [0, 0, 0, 1];
    for (i = j = 0; j < 3; i = ++j) {
      v3[i] = v1[i] * c1 + v2[i] * c2;
    }
    return v3;
  }

  rgbPc(r, g, b, R, G, B) {
    var bd, gd, pc, rd;
    pc = function(f) {
      return Util.toInt(f * 100);
    };
    rd = r !== 0 ? r : -R;
    gd = g !== 0 ? g : -G;
    bd = b !== 0 ? b : -B;
    return [pc(R / rd), pc(G / gd), pc(B / bd)];
  }

};

export default Color;
