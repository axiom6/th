import Util     from '../util/Util.js';
import Vis      from '../vis/Vis.js';
import Radar    from '../d3d/Radar.js';
import Palettes from '../d3d/Palettes.js';
var Wheelc;

Wheelc = class Wheelc extends Radar {
  constructor(stream, ui, d3d, name) {
    super(stream, ui, d3d, name);
    this.quadrants = [
      {
        name1: "Red",
        key: '0',
        color: "hsl(  0,100%,50%)",
        beg: -15,
        end: 15
      },
      {
        name1: "Orange",
        key: '30',
        color: "hsl( 30,100%,50%)",
        beg: 15,
        end: 45
      },
      {
        name1: "Yellow",
        key: '60',
        color: "hsl( 60,100%,50%)",
        beg: 45,
        end: 75
      },
      {
        name1: "Lime",
        key: '90',
        color: "hsl( 90,100%,50%)",
        beg: 75,
        end: 105
      },
      {
        name1: "Green",
        key: '120',
        color: "hsl(120,100%,50%)",
        beg: 105,
        end: 135
      },
      {
        name1: "Teal",
        key: '150',
        color: "hsl(150,100%,50%)",
        beg: 135,
        end: 165
      },
      {
        name1: "Cyan",
        key: '180',
        color: "hsl(180,100%,50%)",
        beg: 165,
        end: 195
      },
      {
        name1: "Azure",
        key: '210',
        color: "hsl(210,100%,50%)",
        beg: 195,
        end: 225
      },
      {
        name1: "Blue",
        key: '240',
        color: "hsl(240,100%,50%)",
        beg: 225,
        end: 255
      },
      {
        name1: "Violet",
        key: '270',
        color: "hsl(270,100%,50%)",
        beg: 255,
        end: 285
      },
      {
        name1: "Magenta",
        key: '300',
        color: "hsl(300,100%,50%)",
        beg: 285,
        end: 315
      },
      {
        name1: "Pink",
        key: '330',
        color: "hsl(330,100%,50%)",
        beg: 315,
        end: 345
      }
    ];
    this.palettes = [
      {
        palette: Palettes.reds,
        name1: "Red",
        key: '0',
        beg: -15,
        end: 15
      },
      {
        palette: Palettes.browns,
        name1: "Brown",
        key: '20',
        beg: 15,
        end: 25
      },
      {
        palette: Palettes.tans,
        name1: "Tan",
        key: '30',
        beg: 25,
        end: 35
      },
      {
        palette: Palettes.oranges,
        name1: "Orange",
        key: '40',
        beg: 35,
        end: 45
      },
      {
        palette: Palettes.yellows,
        name1: "Yellow",
        key: '60',
        beg: 45,
        end: 75
      },
      {
        palette: Palettes.limes,
        name1: "Lime",
        key: '90',
        beg: 75,
        end: 105
      },
      {
        palette: Palettes.greens,
        name1: "Green",
        key: '120',
        beg: 105,
        end: 135
      },
      {
        palette: Palettes.teals,
        name1: "Teal",
        key: '150',
        beg: 135,
        end: 165
      },
      {
        palette: Palettes.cyans,
        name1: "Cyan",
        key: '180',
        beg: 165,
        end: 195
      },
      {
        palette: Palettes.azures,
        name1: "Azure",
        key: '210',
        beg: 195,
        end: 225
      },
      {
        palette: Palettes.blues,
        name1: "Blue",
        key: '240',
        beg: 225,
        end: 255
      },
      {
        palette: Palettes.violets,
        name1: "Violet",
        key: '270',
        beg: 255,
        end: 285
      },
      {
        palette: Palettes.magentas,
        name1: "Magenta",
        key: '300',
        beg: 285,
        end: 315
      },
      {
        palette: Palettes.pinks,
        name1: "Pink",
        key: '330',
        beg: 315,
        end: 330
      },
      {
        palette: Palettes.grays,
        name1: "Gray",
        key: '345',
        beg: 330,
        end: 345
      }
    ];
    this.assoc = this.assocQuad(this.quadrants);
  }

  ready(cname) {
    var $svg, dr;
    Util.noop(cname);
    $svg = super.ready();
    dr = (this.r100 - this.r40) / 30;
    this.quads(this.hueQuads(10), this.r80, this.r100);
    this.hsvWedges(5, dr, this.r40, this.r100);
    this.paletteWedges(5, dr, this.r40, this.r100);
    //@paletteLogs()
    return $svg;
  }

  hueQuads(inc) {
    var a, hue, i, ref;
    a = [];
    for (hue = i = 0, ref = inc; ref !== 0 && (ref > 0 ? i < 360 : i > 360); hue = i += ref) {
      a.push({
        name1: this.name1(hue),
        color: `hsla(${hue},100%,50%,1.0)`,
        beg: hue - inc / 2,
        end: hue + inc / 2
      });
    }
    return a;
  }

  hueWedges(dh, dr, r1, r2) {
    var g, hue, i, j, lite, r, ref, ref1, ref2, ref3;
    g = this.g.selectAll("g").append("svg:g");
    for (hue = i = 0, ref = dh; ref !== 0 && (ref > 0 ? i < 360 : i > 360); hue = i += ref) {
      for (r = j = ref1 = r1, ref2 = r2, ref3 = dr; ref3 !== 0 && (ref3 > 0 ? j < ref2 : j > ref2); r = j += ref3) {
        lite = 80 - (r - r1) / (r2 - r1) * 50;
        this.wedge(`hsla(${hue},100%,${lite}%,1.0)`, g, r, r + dr, hue - dh / 2, hue + dh / 2);
      }
    }
    this.grid(dh);
  }

  hsvWedges(dh, dr, r1, r2) {
    var g, hue, i, j, r, ref, ref1, ref2, ref3, sat;
    g = this.g.selectAll("g").append("svg:g");
    for (hue = i = 0, ref = dh; ref !== 0 && (ref > 0 ? i < 360 : i > 360); hue = i += ref) {
      for (r = j = ref1 = r1, ref2 = r2, ref3 = dr; ref3 !== 0 && (ref3 > 0 ? j < ref2 : j > ref2); r = j += ref3) {
        sat = 0.3 + (r - r1) / (r2 - r1) * 0.7;
        this.wedge(Vis.rgbCss(Vis.hsvToRgb({
          h: hue,
          s: sat,
          v: 1
        })), g, r, r + dr, hue - dh / 2, hue + dh / 2);
      }
    }
    this.grid(dh, dr, -dh / 2, 360 - dh / 2);
  }

  paletteWedges(dh, dr, r1, r2) {
    var c, g, i, j, len, len1, palette, r, ref, ref1;
    Util.noop(r2);
    g = this.g.selectAll("g").append("svg:g");
    ref = this.palettes;
    for (i = 0, len = ref.length; i < len; i++) {
      palette = ref[i];
      r = r1;
      ref1 = palette.palette;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        c = ref1[j];
        this.wedge(c.hex, g, r, r + dr, palette.beg, palette.end);
        r += dr;
      }
    }
  }

  paletteLogs() {
    var c, hex, hsl, hsv, i, j, len, len1, palette, ref, ref1;
    ref = this.palettes;
    for (i = 0, len = ref.length; i < len; i++) {
      palette = ref[i];
      ref1 = palette.palette;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        c = ref1[j];
        hex = '"' + c.hex + '"';
        hsv = '"' + Vis.hsvRgb(Vis.hexRgb(c.hex)) + '"';
        hsl = '"' + Vis.hslRgb(Vis.hexRgb(c.hex)) + '"';
        console.log('    ', {
          hex: hex,
          hsv: hsv,
          hsl: hsl,
          code: '"HTML"',
          name: '"' + c.name + '"'
        });
      }
    }
  }

  name1(hue) {
    var qa;
    qa = this.assoc[hue.toString()];
    if (qa != null) {
      return qa.name1;
    } else {
      return null;
    }
  }

  assocQuad(quadrants) {
    var assoc, i, len, q;
    assoc = [];
    for (i = 0, len = quadrants.length; i < len; i++) {
      q = quadrants[i];
      assoc[q.key] = q;
    }
    return assoc;
  }

};

export default Wheelc;
