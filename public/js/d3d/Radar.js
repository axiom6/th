import Util from '../util/Util.js';
import UI   from '../ui/UI.js';
import Vis  from '../vis/Vis.js';
import Base from '../ui/Base.js';
var Radar,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

Radar = class Radar extends Base {
  constructor(stream, ui, d3d, name) {
    super(stream, ui, name);
    this.ready = this.ready.bind(this);
    this.doQuads = this.doQuads.bind(this);
    this.doTechs = this.doTechs.bind(this);
    this.attrG = this.attrG.bind(this);
    this.prompt = this.prompt.bind(this);
    this.grid = this.grid.bind(this);
    this.circle = this.circle.bind(this);
    // Concentric circles for delinating graded adoption criteria
    this.circles = this.circles.bind(this);
    this.quads = this.quads.bind(this);
    this.quadName = this.quadName.bind(this);
    this.degName = this.degName.bind(this);
    this.wedge = this.wedge.bind(this);
    // Background wedges to indicate technology quadrants
    this.wedges = this.wedges.bind(this);
    this.symType = this.symType.bind(this);
    
    // Plot tech points as either dots or triangles and add drag behavior. Add tech title tool tip
    this.pts = this.pts.bind(this);
    this.d3d = d3d;
    this.criterias = [ // Grade  Percentile
      {
        name: "Adopt",
        radius: this.r40 //   A     90-100%
      },
      {
        name: "Trial",
        radius: this.r60 //   B     80-89%
      },
      {
        name: "Access",
        radius: this.r80 //   C     70-79%
      },
      {
        name: "Hold",
        radius: this.r100 //   D     60-69%
      }
    ];
  }

  isRadar() {
    return this.name === 'Radar';
  }

  ready(cname) {
    var geo;
    boundMethodCheck(this, Radar);
    Util.noop(cname);
    geo = this.pane.geo;
    this.graph = this.d3d.createGraph(this.pane);
    this.g = this.graph.g;
    this.width = geo.w;
    this.height = geo.h;
    this.x0 = this.width / 2;
    this.y0 = this.height / 2;
    this.inner = 0;
    this.outer = (Math.min(this.width, this.height) - 100) / 2;
    this.r04 = this.outer * 0.04;
    this.r08 = this.outer * 0.08;
    this.r16 = this.outer * 0.16;
    this.r10 = this.outer * 0.1;
    this.r20 = this.outer * 0.2;
    this.r30 = this.outer * 0.3;
    this.r40 = this.outer * 0.4;
    this.r50 = this.outer * 0.5;
    this.r60 = this.outer * 0.6;
    this.r80 = this.outer * 0.8;
    this.r90 = this.outer * 0.9;
    this.r100 = this.outer * 1.0;
    this.s2 = Math.sin(Vis.rad(60));
    this.r2 = this.s2 * this.s2 * 60.0;
    this.p60 = -Math.sin(Vis.rad(60));
    this.attrG(this.g);
    if (this.isRadar()) {
      UI.readJSON('json/Quad.json', (quads) => {
        return this.doQuads(quads);
      });
    }
    if (this.isRadar()) {
      UI.readJSON('json/Tech.json', (techs) => {
        return this.doTechs(techs);
      });
    }
    return this.graph.$svg;
  }

  doQuads(quads) {
    boundMethodCheck(this, Radar);
    this.quads(Util.toArray(quads), this.r08, this.r100);
    this.circles(this.criterias);
  }

  doTechs(techs) {
    boundMethodCheck(this, Radar);
    this.pts(Util.toArray(techs));
  }

  attrG(g) {
    boundMethodCheck(this, Radar);
    return g.attr("style", `background${d3.rgb(250, 240, 200)}; overflow:visible;`);
  }

  prompt() {
    boundMethodCheck(this, Radar);
    return this.g.append("svg:text").text("Drag and drop the blue dots to target technologies as Adopt Trial Access or Hold").attr("x", 20).attr("y", 20).attr("font-family", "Arial").attr("font-size", "14px");
  }

  grid(da, dr, ba = 0, ea = 360, br = this.r40, er = this.r100) {
    var ang, cos, j, k, l, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, sin;
    boundMethodCheck(this, Radar);
    for (ang = j = ref = ba, ref1 = ea, ref2 = da; ref2 !== 0 && (ref2 > 0 ? j < ref1 : j > ref1); ang = j += ref2) {
      cos = Math.cos(this.rad(ang));
      sin = Math.sin(this.rad(ang));
      this.quadLine(this.r16 * cos, this.r16 * sin, this.r100 * cos, this.r100 * sin, "#CCCCCC");
    }
    for (r = k = ref3 = br, ref4 = er, ref5 = dr; ref5 !== 0 && (ref5 > 0 ? k < ref4 : k > ref4); r = k += ref5) {
      this.circle(r);
    }
    for (r = l = ref6 = this.r08, ref7 = this.r40, ref8 = this.r08; ref8 !== 0 && (ref8 > 0 ? l < ref7 : l > ref7); r = l += ref8) {
      this.circle(r);
    }
  }

  circle(r) {
    boundMethodCheck(this, Radar);
    this.g.append("svg:circle").attr("cx", this.x0).attr("cy", this.y0).attr("fill", "none").attr("stroke", "#CCCCCC").attr("stroke-width", 1).attr("r", r);
  }

  circles(criterias) {
    var g;
    boundMethodCheck(this, Radar);
    g = this.g.selectAll("g").data(criterias).enter().append("svg:g");
    g.append("svg:circle").attr("cx", this.x0).attr("cy", this.y0).attr("fill", "none").attr("stroke", "gray").attr("stroke-width", 1).attr("r", function(criteria) {
      return criteria.radius;
    });
    if (this.isRadar()) {
      g.append("svg:text").attr("x", this.x0).attr("y", (criteria) => {
        return this.y0 - criteria.radius;
      }).text((criteria) => {
        return criteria.name;
      }).attr("text-anchor", "middle").attr("dy", "1.2em").attr("font-size", "18pt").attr("font-family", "Arial");
    }
  }

  quads(quadrants, r1, r2) {
    var ang, beg, cos, dif, i, j, k, n, name1, name2s, ref, ref1, sin;
    boundMethodCheck(this, Radar);
    this.wedges(quadrants, this.inner, r2);
    // @grid((@r100-@r40)/15,5)
    n = quadrants.length * 2;
    dif = 360 / n;
    ang = 0;
    cos = 0;
    sin = 0;
    name2s = null;
    for (i = j = 0, ref = n; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      ang = i * dif;
      cos = Math.cos(this.rad(ang));
      sin = Math.sin(this.rad(ang));
      this.quadLine(r1 * cos, r1 * sin, r2 * cos, r2 * sin, "rgba(180,180,180,1.0)");
      // @degName( @r100+12, ang )
      name2s = quadrants[Math.floor(i / 2)]['name2s'];
      if ((name2s != null) && name2s.length === 2) {
        this.quadName(this.r100 + 12, ang + dif / 2, name2s[i % 2]);
      }
    }
    n = quadrants.length;
    dif = 360 / n;
    beg = this.isRadar() ? dif / 2 : 0;
    for (i = k = 0, ref1 = n; (0 <= ref1 ? k < ref1 : k > ref1); i = 0 <= ref1 ? ++k : --k) {
      name1 = quadrants[i].name1;
      if ((name1 != null) && name1.length > 0) {
        this.quadName(this.r100 + 12, beg + dif * i, name1);
      }
    }
  }

  quadName(r, ang, name) {
    var cx, cy, dy, rot;
    boundMethodCheck(this, Radar);
    cx = this.x0 + r * Math.cos(this.rad(ang));
    cy = this.y0 + r * Math.sin(this.rad(ang));
    rot = `rotate(${this.angleQuad(ang)},${cx},${cy})`;
    dy = (0 <= ang && ang <= 180) ? ".15em" : ".5em";
    this.g.append("svg:text").attr("x", cx).attr("y", cy).text(name).attr("transform", rot).attr("text-anchor", "middle").attr("dy", dy).attr("font-size", "18pt").attr("font-family", "Arial");
  }

  degName(r, ang) {
    var cx, cy, rotate;
    boundMethodCheck(this, Radar);
    cx = this.x0 + r * Math.cos(this.rad(ang));
    cy = this.y0 + r * Math.sin(this.rad(ang));
    rotate = `rotate(${this.angleQuad(ang)},${cx},${cy})`;
    this.g.append("svg:text").attr("x", cx).attr("y", cy).text(ang).attr("transform", rotate).attr("text-anchor", "middle").attr("dy", ".35em").attr("font-size", "12pt").attr("font-family", "Arial"); // .textUtilline("middle")
  }

  wedge(fill, g, r1, r2, a1, a2) {
    var arc;
    boundMethodCheck(this, Radar);
    arc = d3.arc().innerRadius(r1).outerRadius(r2).startAngle(this.radD3(a1)).endAngle(this.radD3(a2));
    g.append("svg:path").attr("d", arc).attr("fill", fill).attr("stroke", "none").attr("transform", `translate(${this.x0},${this.y0})`);
  }

  wedges(quadrants, r1, r2) {
    var wedge;
    boundMethodCheck(this, Radar);
    wedge = d3.arc().innerRadius(r1).outerRadius(r2).startAngle((d) => {
      return this.radD3(d.beg);
    }).endAngle((d) => {
      return this.radD3(d.end);
    });
    this.g.selectAll("path").data(quadrants).enter().append("svg:path").attr("d", wedge).attr("transform", `translate(${this.x0},${this.y0})`).attr("fill", (d) => {
      return d.color;
    }).attr("stroke", "none");
  }

  symType(tech) {
    boundMethodCheck(this, Radar);
    if ((tech.changed != null) && tech.changed === '+') {
      return "triangle-up";
    } else {
      return "circle";
    }
  }

  pts(techs) {
    var dot, g;
    boundMethodCheck(this, Radar);
    g = this.g.selectAll("g").data(techs).enter().append("svg:g");
    dot = g.append("svg:circle").attr("id", (tech) => {
      return this.techId(tech);
    }).attr("class", "dot").attr("cx", (tech) => {
      return this.x(tech);
    }).attr("cy", (tech) => {
      return this.y(tech);
    }).attr("title", (tech) => {
      return this.techTitle(tech);
    }).attr("r", 6).attr("fill", "orange").attr("stroke", "orange").attr("stroke-width", 1); // .attr("fill", (d) => if d.fix then "yellow" else "blue" )
    dot.call((tech) => {
      return tech.dot = dot;
    });
    /*
    dot.call(
      d3.behavior.drag()
        .on("dragstart", (tech) => @doDragStart(tech) )
        .on("drag",      (tech) => @doDrag(tech) )
        .on("dragend",   (tech) => @doDragEnd(tech)   )  )
    */
    g.append("svg:text").text((tech) => {
      return (tech.i ? tech.i + ' ' : '') + tech.name;
    }).attr("id", (tech) => {
      return this.techTx(tech);
    }).attr("text-anchor", (tech) => {
      if (this.leftQuads(tech)) {
        return "end";
      } else {
        return "start";
      }
    }).attr("x", (tech) => {
      if (this.leftQuads(tech)) {
        return this.x(tech) - 10;
      } else {
        return this.x(tech) + 10;
      }
    }).attr("y", (tech) => {
      return this.y(tech);
    }).attr("dy", ".35em").attr("font-family", "Arial").attr("font-size", "10px");
  }

  // Start drag by setting fill yellow
  doDragStart(tech) {
    //d3.select(tech.dot).attr("fill","yellow")
    d3.select("circle#" + this.techId(tech)).attr("fill", "yellow");
  }

  // Respond to mouse drag by updating the tech grade angle and status
  // Util.log("beg", @techTitle(tech) ); # d3.select(circle).attr("fill","yellow")
  doDrag(tech) {
    var x, y;
    if (d3.event == null) {
      return;
    }
    x = d3.event.x - this.x0;
    y = this.y0 - d3.event.y; // Reverse sign of y
    tech.angle = this.angle(x, y);
    tech.grade = this.grade(x, y);
    window.status = this.techTitle(tech);
    d3.select('circle#' + this.techId(tech)).attr("cx", this.x(tech)).attr("cy", this.y(tech));
  }

  // End drag by setting fill blue
  doDragEnd(tech) {
    d3.select("circle#" + this.techId(tech)).attr("fill", "blue").attr("title", this.techTitle(tech));
    d3.select("text#" + this.techTx(tech)).attr("x", (tech) => {
      if (this.leftQuads(tech)) {
        return this.x(tech) - 10;
      } else {
        return this.x(tech) + 10;
      }
    }).attr("y", (tech) => {
      return this.y(tech);
    });
  }

  leftQuads(tech) {
    return 90 <= tech.angle && tech.angle < 270;
  }

  // Convert degress to radians and make angle counter clockwise
  rad(deg) {
    return (360 - deg) * Math.PI / 180.0;
  }

  degSVG(deg) {
    return 360 - deg;
  }

  radD3(deg) {
    return (450 - deg) * Math.PI / 180.0;
  }

  degD3(rad) {
    return -rad * 180.0 / Math.PI;
  }

  // Calculate x y coordinates for plotting points from the tech grade and angle
  x(tech) {
    return this.x0 + this.r(tech) * Math.cos(this.rad(tech.angle));
  }

  y(tech) {
    return this.y0 + this.r(tech) * Math.sin(this.rad(tech.angle));
  }

  // Calculate radius for plotting points from the tech grade
  r(tech) {
    var g;
    g = tech.grade;
    if (g > 90) {
      return (100 - g) / 10.0 * this.r40;
    } else {
      return this.r40 + (90 - g) / 30.0 * this.r60;
    }
  }

  // Calculate tech angle from xy pixel/mouse coordinates
  angle(x, y) {
    var ang;
    ang = Math.atan2(y, x) * 180.0 / Math.PI;
    ang = ang < 0 ? 360 + ang : ang;
    return Math.round(ang);
  }

  // Calculate tech grade radius from xy pixel/mouse coordinates
  grade(x, y) {
    var r;
    r = Math.sqrt(x * x + y * y);
    r = r < this.r40 ? 100 - r * 10 / this.r40 : 90 + (this.r40 - r) * 30.0 / this.r60;
    return Math.round(r);
  }

  // Create a string of tech data for tool tips and status
  techTitle(tech) {
    return tech.name + " " + Math.round(tech.grade) + "% " + Math.round(tech.angle) + " Deg  " + tech.title;
  }

  // Replace any CSS selection character with_ to create selectable ids
  techId(tech) {
    var ptn;
    ptn = /[ .#>:~\^\=\+\*\(\)\[\]]/g;
    return "_" + tech.name.replace(ptn, '_');
  }

  techTx(tech) {
    return this.techId(tech) + "_tx";
  }

  angleQuad(ang) {
    if (Vis.within(0, ang, 180)) {
      return -ang + 90;
    } else {
      return -ang - 90;
    }
  }

  quadLine(x1, y1, x2, y2, stroke) {
    this.g.append("svg:line").attr("x1", x1 + this.x0).attr("y1", y1 + this.y0).attr("x2", x2 + this.x0).attr("y2", y2 + this.y0).attr("stroke", stroke).attr("stroke-width", "1");
  }

};

export default Radar;
