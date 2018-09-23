import Util  from '../util/Util.js';
import Vis   from '../vis/Vis.js';
import Color from '../d3d/Color.js';
import Base  from '../ui/Base.js';
var Link,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

Link = (function() {
  class Link extends Base {
    constructor(stream, ui, d3d) {
      super(stream, ui, 'Link');
      this.ready = this.ready.bind(this);
      this.strokeOpp = this.strokeOpp.bind(this);
      this.d3d = d3d;
    }

    ready(cname) {
      var geo;
      boundMethodCheck(this, Link);
      Util.noop(cname);
      geo = this.pane.geo;
      this.graph = this.d3d.createGraph(this.pane);
      this.g = this.graph.g;
      this.w = geo.w;
      this.h = geo.h;
      this.cssLink = 'link';
      this.thick = 1;
      this.da = 5;
      this.ornament(150);
      return this.graph.$svg;
    }

    link(x1, y1, x2, y2, n, fill) {
      var a1, a2, r;
      r = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)) / 2;
      a1 = Vis.angleSvg(x2 - x1, y2 - y1);
      a2 = Vis.angleSvg(x1 - x2, y1 - y2);
      this.linkBeg(x1, y1, a1, r, n, fill);
      this.linkEnd(x2, y2, a2, r, n, fill);
    }

    linkBeg(x1, y1, a1, r1, n, fill) {
      var b1, e1, n2;
      n2 = Math.floor(n / 2);
      b1 = a1 - this.da * n2;
      e1 = a1 + this.da * n2 + 1;
      if (a1 === 0) {
        b1 += 360;
      }
      if (a1 === 0) {
        e1 += 360;
      }
      this.radiate(this.g, x1, y1, r1, b1, e1, this.da, false, this.rgb(fill));
    }

    linkEnd(x2, y2, a2, r2, n, fill) {
      var b2, e2, n2;
      n2 = Math.floor(n / 2);
      b2 = a2 - this.da * n2;
      e2 = a2 + this.da * n2 + 1;
      if (a2 === 0) {
        b2 += 360;
      }
      if (a2 === 0) {
        e2 += 360;
      }
      this.radiate(this.g, x2, y2, r2, b2, e2, this.da, false, this.rgb(fill));
    }

    link2(x1, y1, x2, y2, n, fill) {
      var a1, a2, b1, b2, e1, e2, n2, r;
      r = Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1)) / 2;
      n2 = Math.floor(n / 2);
      a1 = Vis.angleSvg(x2 - x1, y2 - y1);
      b1 = a1 - this.da * n2;
      e1 = a1 + this.da * n2 + 1;
      a2 = Vis.angleSvg(x1 - x2, y1 - y2);
      b2 = a2 - this.da * n2;
      e2 = a2 + this.da * n2 + 1;
      //console.log( 'Link.link', { r:Util.toFixed(r), a1:Util.toFixed(a1), a2:Util.toFixed(a2), n:n, n2:n2, b1:b1, e1:e1, b2:b2, e2:e2 } )
      this.radiate(this.g, x1, y1, r, b1, e1, this.da, false, this.rgb(fill));
      this.radiate(this.g, x2, y2, r, b2, e2, this.da, false, this.rgb(fill));
    }

    rgb(fill) {
      return Color.Prac[fill].rgba;
    }

    strokeOpp(ang) {
      var hue;
      boundMethodCheck(this, Link);
      hue = 180 - ang;
      if (hue < 0) {
        hue = 360 + hue;
      }
      return [
        Vis.hslCss({
          h: hue,
          s: 0.5,
          l: 0.8
        }),
        hue
      ];
    }

    inEast(ang) {
      return (0 <= ang && ang <= 45) || (315 <= ang && ang <= 360);
    }

    inNorth(ang) {
      return 45 < ang && ang < 134;
    }

    inWest(ang) {
      return 135 <= ang && ang <= 225;
    }

    inSouth(ang) {
      return 225 < ang && ang < 315;
    }

    hue090(ang) {
      return 360 - ang;
    }

    hue180(ang) {
      if (ang <= 180) {
        return 180 - ang;
      } else {
        return 540 - ang;
      }
    }

    hue270(ang) {
      return 360 - ang;
    }

    hue360(ang) {
      return 540 - ang;
    }

    ornament(r) {
      this.radiate(this.g, this.w * 0.50, this.h * 0.50, r, 0, 360, 5, false);
      this.radiate(this.g, this.w * 0.50 + 2 * r, this.h * 0.50, r, 135, 226, 5, false, this.hue180);
      this.radiate(this.g, this.w * 0.50, this.h * 0.50 - 2 * r, r, 225, 315, 5, true, this.hue270);
      this.radiate(this.g, this.w * 0.50 - 2 * r, this.h * 0.50, r, 315, 406, 5, false, this.hue360);
      this.radiate(this.g, this.w * 0.50, this.h * 0.50 + 2 * r, r, 45, 135, 5, true, this.hue090);
    }

    line(x0, y0, x1, y1) {
      return `M${x0},${y0}L${x1},${y1}`;
    }

    quad(x0, y0, x1, y1, x2, y2) {
      return `M${x0},${y0}Q${x1},${y1} ${x2},${y2}`;
    }

    cubic(x0, y0, x1, y1, x2, y2, x3, y3) {
      return `M${x0},${y0}C${x1},${y1} ${x2},${y2} ${x3},${y3}`;
    }

    circle(g, r, x, y, stroke) {
      g.append("svg:circle").attr("r", r).attr("r", r).attr("cx", x).attr("cy", y).attr("fill", stroke).attr("stroke", 'none');
    }

    path(g, stroke, ang, hue, d) {
      g.append('svg:path').attr('d', d).attr('stroke', stroke).attr('fill', 'none').attr('class', this.cssLink).attr('stroke-width', this.thick).attr('title', ang + ' ' + hue);
    }

    radiate(g, x0, y0, r, beg, end, da, skipBeg = false, toHue = function(ang) {
        return ang;
      }) {
      var a, ang, hue, i, pc, ref, ref1, ref2, stroke, x, x1, x2, y1, y2, yy;
      pc = .5;
      for (a = i = ref = beg, ref1 = end, ref2 = da; ref2 !== 0 && (ref2 > 0 ? i < ref1 : i > ref1); a = i += ref2) {
        if (a === beg && skipBeg) {
          continue;
        }
        ang = a > 360 ? a - 360 : a;
        [x, yy] = this.xy(ang, x0, y0, r);
        if (this.inEast(ang) || this.inWest(ang)) {
          x1 = x0 * (1 - pc) + x * pc;
          x2 = x0 * pc + x * (1 - pc);
          y1 = y0;
          y2 = yy;
        } else {
          x1 = x0;
          x2 = x;
          y1 = y0 * (1 - pc) + yy * pc;
          y2 = y0 * pc + yy * (1 - pc);
        }
        hue = 0;
        stroke = toHue;
        if (Util.isFunc(toHue)) {
          hue = toHue(ang);
          stroke = Vis.hslCss({
            h: hue,
            s: 0.5,
            l: 0.8
          });
        }
        this.path(g, stroke, ang, hue, this.cubic(x0, y0, x1, y1, x2, y2, x, yy));
      }
    }

    xy(ang, x0, y0, r) {
      var cos, sin, x, y;
      cos = Vis.cosSvg(ang);
      sin = Vis.sinSvg(ang);
      if (this.inEast(ang)) {
        cos = 1;
      }
      if (this.inWest(ang)) {
        cos = -1;
      }
      if (this.inNorth(ang)) {
        sin = -1;
      }
      if (this.inSouth(ang)) {
        sin = 1;
      }
      x = x0 + r * cos;
      y = y0 + r * sin;
      return [x, y];
    }

    tree(g, x0, y0, pts, stroke) {
      var i, len, x, x1, x2, y1, y2, yy;
      for (i = 0, len = pts.length; i < len; i++) {
        [x, yy] = pts[i];
        x1 = x - 30;
        y1 = y0;
        x2 = x0 - 30;
        y2 = yy;
        this.path(g, this.cubic(x0, y0, x1, y1, x2, y2, x, yy), stroke);
        this.circle(g, 2, x0, y0, stroke);
        this.circle(g, 2, x1, y1, stroke);
        this.circle(g, 2, x2, y2, stroke);
        this.circle(g, 2, x, yy, stroke);
      }
    }

    //console.log( { x0:x0, y0:y0, x1:x1, y1:y1, x2:x2, y2:y2, x3:x, y3:yy } )
    diag(g, x0, y0, pts, stroke) {
      var ang, cos, i, len, pc, sin, x, x1, x2, y1, y2, yy;
      pc = .5;
      for (i = 0, len = pts.length; i < len; i++) {
        [x, yy] = pts[i];
        ang = Vis.angle(x - x0, y - y0);
        cos = Vis.cos(ang);
        sin = Vis.sin(ang);
        Util.noop(cos, sin);
        x1 = x0 * (1 - pc) + x * pc;
        x2 = x0 * pc + x * (1 - pc);
        y1 = y0;
        y2 = yy;
        this.path(g, this.cubic(x0, y0, x1, y1, x2, y2, x, yy), stroke);
        this.circle(g, 2, x0, y0, stroke);
        this.circle(g, 2, x1, y1, stroke);
        this.circle(g, 2, x2, y2, stroke);
        this.circle(g, 2, x, yy, stroke);
      }
    }

  };

  Link.pts1 = [[200, 40], [200, 60], [200, 80], [200, 100], [200, 120], [200, 140], [200, 160]];

  return Link;

}).call(this);

//console.log( { x0:x0, y0:y0, x1:x1, y1:y1, x2:x2, y2:y2, x3:x, y3:yy } )
export default Link;
