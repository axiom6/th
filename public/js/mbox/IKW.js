import Util  from '../util/Util.js';
import Vis   from '../vis/Vis.js';
import Build from '../mbox/Build.js';
var IKW;

IKW = class IKW {
  constructor(mbox, coord, color, width, height, depth) {
    // {style: {border: '4px dashed rgba(192, 32, 48, .5)', color: 'rgba(96, 16, 32, 1)', background: 'rgba(255, 255, 255, .75)'}},
    this.flotExpr = this.flotExpr.bind(this);
    this.viewArrays = this.viewArrays.bind(this);
    this.mbox = mbox;
    this.coord = coord;
    this.color = color;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.mathbox = this.mbox.mathbox;
    this.build = new Build();
    this.ni = 0;
    this.nt = 4;
  }

  canvasContext() {
    var canvas, ctx;
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    if (ctx == null) {
      ctx = canvas.getContext('webgl');
    }
    if (ctx == null) {
      console.log('MBox.IKW.canvasContext() null');
    }
    return ctx;
  }

  canvasText(icon, x, y) {
    var ctx, uc;
    uc = Vis.unicode(icon);
    ctx = this.canvasContext();
    ctx.font = 'bold 24px FontAwesome';
    ctx.fillText(uc, x, y);
  }

  contextFont(fontSpec = '36px FontAwesome') {
    var ctx;
    ctx = this.canvasContext();
    ctx.font = fontSpec;
    console.log('MBox.IKW.contextFont()', fontSpec);
  }

  logContextFont(msg) {
    var ctx;
    ctx = this.canvasContext();
    console.log('MBox.IKW().logContextFont', msg, ctx.font);
  }

  museCartesian(range = [[0, 120], [0, 120], [0, 120]], scale = [2, 2, 2], divide = [12, 12]) {
    var view;
    this.mathbox.camera({
      position: [3, 3, 3],
      proxy: true
    });
    view = this.mathbox.cartesian({
      range: range,
      scale: scale
    });
    // @coord.axesXYZ( view,  8, 0xFFFFFF )
    // @coord.gridXYZ( view,  4, 0xFFFFFF, divide[1], 0.7, '10' )
    // @coord.tickXYZ( view, 64, 0xFFFFFF, divide[2], 2 )
    return view;
  }

  inIAKW(plane) {
    var array;
    array = ['Information', 'Augment', 'Knowledge', 'Wisdom'];
    return Util.inArray(array, plane);
  }

  inIAK(plane) {
    var array;
    array = ['Information', 'Augment', 'Knowledge'];
    return Util.inArray(array, plane);
  }

  cubeFaces(x, y, z, s, cubp) {
    cubp.push([[x - s, y - s, z - s], [x - s, y + s, z - s], [x - s, y + s, z + s], [x - s, y - s, z + s]]);
    cubp.push([[x + s, y - s, z - s], [x + s, y + s, z - s], [x + s, y + s, z + s], [x + s, y - s, z + s]]);
    cubp.push([[x - s, y - s, z - s], [x + s, y - s, z - s], [x + s, y - s, z + s], [x - s, y - s, z + s]]);
    cubp.push([[x - s, y + s, z - s], [x + s, y + s, z - s], [x + s, y + s, z + s], [x - s, y + s, z + s]]);
    cubp.push([[x - s, y - s, z - s], [x + s, y - s, z - s], [x + s, y + s, z - s], [x - s, y + s, z - s]]);
    cubp.push([[x - s, y - s, z + s], [x + s, y - s, z + s], [x + s, y + s, z + s], [x - s, y + s, z + s]]);
  }

  convey(practice, dir, x, y, z, s, hsv, conv, conc, conb, cone, conp) {
    var beg, end, q;
    q = s / 2;
    [beg, end] = this.build.connectName(practice, dir);
    conv.push([[x - s, y - q, z], [x - s, y + q, z], [x + s, y + q, z], [x + s, y - q, z]]);
    conc.push(Vis.toRgbHsv(hsv[0], hsv[1], hsv[2], true));
    conb.push(beg);
    cone.push(end);
    conp.push([x, y, z]);
  }

  //console.log( 'Convey', { beg:beg, end:end, x:x, y:y, z:z } )
  flow(practice, dir, x, y, z, s, hsv, flow, floc, flob, floe, flop) {
    var beg, end, q;
    q = s / 2;
    [beg, end] = this.build.connectName(practice, dir);
    flow.push([[x - q, y - s, z], [x - q, y + s, z], [x + q, y + s, z], [x + q, y - s, z]]);
    floc.push(Vis.toRgbHsv(hsv[0], hsv[1], hsv[2], true));
    flob.push(beg);
    floe.push(end);
    flop.push([x, y, z]);
  }

  conduit(practice, dir, x, y, z, s, hsv, pipv, pipc, pipb, pipe, pipp) {
    var beg, end, q;
    q = s / 2;
    [beg, end] = this.build.connectName(practice, dir);
    console.log('Conduit', beg, end, [[x - q, y, z - q], [x + q, y, z - q], [x + q, y, z + q], [x - q, y, z + q]]);
    pipv.push([[x - q, y, z - q], [x + q, y, z - q], [x + q, y, z + q], [x - q, y, z + q]]);
    pipc.push(Vis.toRgbHsv(hsv[0], hsv[1], hsv[2], true));
    pipb.push(beg);
    pipe.push(end);
    pipp.push([x, y, z]);
  }

  fourTier(x, y, z, s, study, hexp, hexc, hexq, hext, hexi) {
    var cos30s, cos30y;
    cos30s = Vis.cos(30) * s;
    cos30y = cos30s * 2;
    switch (study.dir) {
      case 'north':
      case 'northd':
        hexp.push(this.hex(x, y + cos30s, z, s, hexq));
        break;
      case 'west':
      case 'westd':
        hexp.push(this.hex(x - 1.5 * s, y, z, s, hexq));
        break;
      case 'east':
      case 'eastd':
        hexp.push(this.hex(x + 1.5 * s, y, z, s, hexq));
        break;
      case 'south':
      case 'southd':
        hexp.push(this.hex(x, y - cos30s, z, s, hexq));
        break;
      case 'nw':
      case 'nwd':
        hexp.push(this.hex(x - 1.5 * s, y + cos30y, z, s, hexq));
        break;
      case 'ne':
      case 'ned':
        hexp.push(this.hex(x + 1.5 * s, y + cos30y, z, s, hexq));
        break;
      case 'sw':
      case 'swd':
        hexp.push(this.hex(x - 1.5 * s, y - cos30y, z, s, hexq));
        break;
      case 'se':
      case 'sed':
        hexp.push(this.hex(x + 1.5 * s, y - cos30y, z, s, hexq));
        break;
      default:
        hexp.push(this.hex(x, y + cos30s, z, s, hexq));
    }
    hexc.push(Vis.toRgba(study));
    hext.push(study.name); // Vis.unicode( """'#{study.icon}'""" )
    hexi.push(Vis.unicode(study.icon));
  }

  studTier(x, y, z, study, stup, stuc, stuq, stut, stui) {
    var h, s, x0, y0;
    h = 10;
    s = 6.667;
    x0 = x - h;
    y0 = y + s * 0.5;
    switch (study.dir) {
      case 'north':
        stup.push(this.stu(x0 + s, y0, z, s, stuq));
        break;
      case 'west':
        stup.push(this.stu(x0, y0 - s, z, s, stuq));
        break;
      case 'east':
        stup.push(this.stu(x0 + s * 2, y0 - s, z, s, stuq));
        break;
      case 'south':
        stup.push(this.stu(x0 + s, y0 - s * 2, z, s, stuq));
        break;
      default:
        stup.push(this.stu(x0 + s, y0 - s, z, s, stuq));
    }
    stuc.push(Vis.toRgba(study));
    stut.push(study.name);
    stui.push(Vis.unicode(study.icon));
  }

  stu(x, y, z, s, stuq) {
    var pts;
    stuq.push([x + s * 0.5, y + s * 0.5, z]);
    pts = [];
    pts.push([x, y, z]);
    pts.push([x + s, y, z]);
    pts.push([x + s, y + s, z]);
    pts.push([x, y + s, z]);
    return pts;
  }

  hex(x, y, z, s, hexq) {
    var ang, l, len1, pts, ref;
    hexq.push([x, y, z]);
    pts = [];
    ref = [0, 60, 120, 180, 240, 300];
    for (l = 0, len1 = ref.length; l < len1; l++) {
      ang = ref[l];
      pts.push([x + s * Vis.cos(ang), y + s * Vis.sin(ang), z]);
    }
    return pts;
  }

  studySlots(x, y, z, sprac, subs) {
    var l, len1, len2, m, ref, ref1, s, t, u;
    s = sprac / 3;
    ref = [s, s * 3, s * 5];
    for (l = 0, len1 = ref.length; l < len1; l++) {
      t = ref[l];
      ref1 = [s, s * 3, s * 5];
      for (m = 0, len2 = ref1.length; m < len2; m++) {
        u = ref1[m];
        this.cubeFaces(x + t - sprac, y + u - sprac, z - s * 2, s, subs);
      }
    }
  }

  flotExpr(emit, el) { // i, j, k, l, time ) =>
    return emit(el('div', {}, 'Practice'));
  }

  toRgbHexxFaces(len) {
    var l, len1, m, prac, ref, ref1, rgba, rgbh;
    rgbh = [];
    for (prac = l = 0, ref = len; (0 <= ref ? l < ref : l > ref); prac = 0 <= ref ? ++l : --l) {
      ref1 = [[180, 50, 90], [60, 50, 90], [90, 50, 90], [30, 50, 90]];
      for (m = 0, len1 = ref1.length; m < len1; m++) {
        rgba = ref1[m];
        rgbh.push(Vis.toRgbHsv(rgba[0], rgba[1], rgba[2], true));
      }
    }
    return rgbh;
  }

  musePoints() {
    var obj;
    obj = {
      id: 'musePoints',
      width: this.width,
      height: this.height,
      depth: this.depth,
      items: 1,
      channels: 4
    };
    obj.expr = (emit, x, y, z) => {
      return emit(this.center(x), this.center(y), this.center(z), 1); // emit( x, y, z, 1 )
    };
    return obj;
  }

  center(u) {
    var v;
    v = u;
    if (0 <= u && u < 40) {
      v = 20;
    }
    if (80 <= u && u < 80) {
      v = 60;
    }
    if (80 <= u && u <= 120) {
      v = 100;
    }
    return v;
  }

  museColors() {
    var obj;
    obj = {
      id: 'museColors',
      width: this.width,
      height: this.height,
      depth: this.depth,
      channels: 4 
    };
    obj.expr = (emit, x, y, z) => {
      var a, b, g, r;
      [r, g, b, a] = this.practiceColor(x, y, z, i, j, k);
      return emit(r, g, b, a);
    };
    return obj;
  }

  musePoint() {
    var obj;
    obj = {
      id: "musePoint",
      points: "#musePoints",
      colors: "#museColors",
      shape: "square",
      color: 0xffffff,
      size: 600
    };
    return obj;
  }

  museText() {
    var obj, str;
    str = function(n) {
      return Util.toStr(n);
    };
    obj = {
      font: 'Helvetica',
      style: 'bold',
      width: 16,
      height: 5,
      depth: 2 // point:"#musePoint"
    };
    obj.expr = (emit, i, j, k, time) => {
      Util.noop(time);
      if (this.ni < this.nt) {
        this.ni = this.ni + 1;
      }
      //console.log( "Hi #{str(i)} #{str(j)} #{str(k)}" )
      return emit(`Hi ${str(i)} ${str(j)} ${str(k)}`);
    };
    return obj;
  }

  museLabel() {
    return {
      points: "#musePoints",
      color: '#000000',
      snap: false,
      outline: 2,
      size: 24,
      depth: .5,
      zIndex: 5
    };
  }

  museCube(view) {
    view.volume(this.musePoints());
    view.volume(this.museColors());
    return view.point(this.musePoint()).text(this.museText()).label(this.museLabel());
  }

  practiceColor(x, y, z) {
    var c, hue, v;
    if (0 <= x && x < 40) {
      hue = 210;
    } else if (40 <= x && x < 80) {
      hue = 60;
    } else if (80 <= x && x <= 120) {
      hue = 300;
    }
    if (0 <= y && y < 40) {
      c = 40;
    } else if (40 <= y && y < 80) {
      c = 60;
    } else if (80 <= y && y <= 120) {
      c = 80;
    }
    if (0 <= z && z < 40) {
      v = 40;
    } else if (40 <= z && z < 80) {
      v = 60;
    } else if (80 <= z && z <= 120) {
      v = 80;
    }
    return Vis.toRgbHsv(hue, c, v, true);
  }

  createArrays() {
    var a, c, col, con, flo, h, i, i1, j1, k1, key, l, l1, len1, len2, len3, len4, len5, len6, len7, len8, len9, m, m1, o, p, pla, plane, practice, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, row, sprac, studies, study, v, w, x, y, z;
    a = { // Suffixes: p-Pplygons c-Colors t-Text i-Icons q-Points b-Beg Connect e-Eng Connect
      xyzs: [],
      cubp: [],
      cubc: [],
      prcp: [],
      prct: [],
      prci: [],
      hexp: [],
      hexc: [],
      hexq: [],
      hext: [],
      hexi: [],
      stup: [],
      stuc: [],
      stuq: [],
      stut: [],
      stui: [],
      conv: [],
      conc: [],
      conb: [],
      cone: [],
      conp: [],
      flow: [],
      floc: [],
      flob: [],
      floe: [],
      flop: [],
      pipv: [],
      pipc: [],
      pipb: [],
      pipe: [],
      pipp: []
    };
    sprac = 10;
    ref = [
      {
        name: 'Information',
        z: 100
      },
      {
        name: 'Knowledge',
        z: 60
      },
      {
        name: 'Wisdom',
        z: 20
      }
    ];
    
    for (l = 0, len1 = ref.length; l < len1; l++) {
      plane = ref[l];
      ref1 = [
        {
          name: 'Learn',
          y: 100
        },
        {
          name: 'Do',
          y: 60
        },
        {
          name: 'Share',
          y: 20
        }
      ];
      for (m = 0, len2 = ref1.length; m < len2; m++) {
        row = ref1[m];
        ref2 = [
          {
            name: 'Embrace',
            x: 20
          },
          {
            name: 'Innovate',
            x: 60
          },
          {
            name: 'Encourage',
            x: 100
          }
        ];
        for (o = 0, len3 = ref2.length; o < len3; o++) {
          col = ref2[o];
          x = col.x;
          y = row.y;
          z = plane.z;
          a.xyzs.push([x, y, z, 1]);
          this.cubeFaces(x, y, z, sprac, a.cubp); //studySlots( x, y, z, sprac, hexs )
          practice = this.build.getPractice(plane.name, row.name, col.name);
          studies = this.build.getStudies(plane.name, practice.name);
          for (key in studies) {
            study = studies[key];
            //fourTier( x, y, z, 4,     study, a.hexp, a.hexc, a.hexq, a.hext, a.hexi )
            this.studTier(x, y, z, study, a.stup, a.stuc, a.stuq, a.stut, a.stui);
          }
          [h, c, v] = practice.hsv;
// Colors for 6 faces
          for (i = p = 0; p < 6; i = ++p) {
            a.cubc.push(Vis.toRgbHsv(h, c, v, true));
          }
          a.prcp.push([
            x,
            y,
            z,
            1 // ( [ x,y-sprac+2,z,1] )
          ]);
          a.prct.push(practice.name);
          a.prci.push(`${Vis.unicode(practice.icon)}`);
        }
        ref3 = [
          {
            name: 'west',
            x: 40,
            hsv: {
              h: 90,
              s: 60,
              v: 90
            },
            colName: 'Embrace'
          },
          {
            name: 'east',
            x: 80,
            hsv: {
              h: 0,
              s: 60,
              v: 90
            },
            colName: 'Innovate'
          }
        ];
        for (w = 0, len4 = ref3.length; w < len4; w++) {
          con = ref3[w];
          practice = this.build.getPractice(plane.name, row.name, con.colName);
          this.convey(practice, 'east', con.x, row.y, plane.z, sprac, practice.hsv, a.conv, a.conc, a.conb, a.cone, a.conp);
        }
      }
      ref4 = [
        {
          name: 'north',
          y: 80,
          rowName: 'Learn'
        },
        {
          name: 'south',
          y: 40,
          rowName: 'Do'
        }
      ];
      for (i1 = 0, len5 = ref4.length; i1 < len5; i1++) {
        flo = ref4[i1];
        ref5 = [
          {
            name: 'Embrace',
            x: 20,
            hsv: {
              h: 210,
              s: 60,
              v: 90
            }
          },
          {
            name: 'Innovate',
            x: 60,
            hsv: {
              h: 60,
              s: 60,
              v: 90
            }
          },
          {
            name: 'Encourage',
            x: 100,
            hsv: {
              h: 255,
              s: 60,
              v: 90
            }
          }
        ];
        for (j1 = 0, len6 = ref5.length; j1 < len6; j1++) {
          col = ref5[j1];
          practice = this.build.getPractice(plane.name, flo.rowName, col.name);
          this.flow(practice, 'south', col.x, flo.y, plane.z, sprac, practice.hsv, a.flow, a.floc, a.flob, a.floe, a.flop);
        }
      }
    }
    ref6 = [
      {
        name: 'Information',
        z: 80
      },
      {
        name: 'Knowledge',
        z: 40
      }
    ];
    
    for (k1 = 0, len7 = ref6.length; k1 < len7; k1++) {
      pla = ref6[k1];
      ref7 = [
        {
          name: 'Learn',
          y: 100
        },
        {
          name: 'Do',
          y: 60
        },
        {
          name: 'Share',
          y: 20
        }
      ];
      for (l1 = 0, len8 = ref7.length; l1 < len8; l1++) {
        row = ref7[l1];
        ref8 = [
          {
            name: 'Embrace',
            x: 20
          },
          {
            name: 'Innovate',
            x: 60
          },
          {
            name: 'Encourage',
            x: 100
          }
        ];
        for (m1 = 0, len9 = ref8.length; m1 < len9; m1++) {
          col = ref8[m1];
          practice = this.build.getPractice(pla.name, row.name, col.name);
          this.conduit(practice, 'next', col.x, row.y, pla.z, 20, practice.hsv, a.pipv, a.pipc, a.pipb, a.pipe, a.pipp);
        }
      }
    }
    return a; // All the arrays
  }

  viewArrays(view) {
    var a, i, l, len, ref;
    a = this.createArrays();
    a.cont = [];
    len = a.conb.length;
    for (i = l = 0, ref = len; (0 <= ref ? l < ref : l > ref); i = 0 <= ref ? ++l : --l) {
      a.cont.push(a.conb[i] + ' ' + a.cone[i]);
    }
    view.array({
      data: a.xyzs,
      id: "xyzs",
      items: 1,
      channels: 4,
      live: false,
      width: a.xyzs.length
    });
    view.array({
      data: a.cubp,
      id: "cubp",
      items: 4,
      channels: 3,
      live: false,
      width: a.cubp.length // 4 sides = 4 items
    });
    view.array({
      data: a.cubc,
      id: "cubc",
      items: 1,
      channels: 4,
      live: false,
      width: a.cubc.length
    });
    //iew.array( { data:a.hexp, id:"hexp", items:6, channels:3, live:false, width:a.hexp.length } ) # 6 sides = 6 items
    //iew.array( { data:a.hexc, id:"hexc", items:1, channels:4, live:false, width:a.hexc.length } )
    //iew.array( { data:a.hexq, id:"hexq", items:1, channels:3, live:false, width:a.hexq.length } )
    view.array({
      data: a.stup,
      id: "stup",
      items: 4,
      channels: 3,
      live: false,
      width: a.stup.length // 4 sides = 4 items
    });
    view.array({
      data: a.stuc,
      id: "stuc",
      items: 1,
      channels: 4,
      live: false,
      width: a.stuc.length
    });
    view.array({
      data: a.stuq,
      id: "stuq",
      items: 1,
      channels: 3,
      live: false,
      width: a.stuq.length
    });
    view.array({
      data: a.prcp,
      id: "prcp",
      items: 1,
      channels: 4,
      live: false,
      width: a.prcp.length
    });
    view.array({
      data: a.conv,
      id: "conv",
      items: 4,
      channels: 3,
      live: false,
      width: a.conv.length
    });
    view.array({
      data: a.conc,
      id: "conc",
      items: 1,
      channels: 4,
      live: false,
      width: a.conc.length
    });
    view.array({
      data: a.conp,
      id: "conp",
      items: 1,
      channels: 3,
      live: false,
      width: a.conp.length
    });
    view.array({
      data: a.flow,
      id: "flow",
      items: 4,
      channels: 3,
      live: false,
      width: a.flow.length
    });
    view.array({
      data: a.floc,
      id: "floc",
      items: 1,
      channels: 4,
      live: false,
      width: a.floc.length
    });
    view.array({
      data: a.flop,
      id: "flop",
      items: 1,
      channels: 3,
      live: false,
      width: a.flop.length
    });
    view.array({
      data: a.pipv,
      id: "pipv",
      items: 4,
      channels: 3,
      live: false,
      width: a.pipv.length
    });
    view.array({
      data: a.pipc,
      id: "pipc",
      items: 1,
      channels: 4,
      live: false,
      width: a.pipc.length
    });
    view.array({
      data: a.pipp,
      id: "pipp",
      items: 1,
      channels: 3,
      live: false,
      width: a.pipp.length
    });
    view.face({
      points: "#cubp",
      colors: "#cubc",
      color: 0xffffff,
      shaded: true,
      fill: true,
      line: true,
      closed: true,
      zIndex: 1,
      opacity: 0.3
    });
    //iew.face(  { points:"#hexp", colors:"#hexc", color:0xffffff, shaded:true, fill:true, line:true, closed:true, zIndex:2, opacity:1.0 } )
    view.face({
      points: "#stup",
      colors: "#stuc",
      color: 0xffffff,
      shaded: true,
      fill: true,
      line: true,
      closed: true,
      zIndex: 2,
      opacity: 1.0
    });
    view.face({
      points: "#conv",
      colors: "#conc",
      color: 0xffffff,
      shaded: true,
      fill: true,
      line: true,
      closed: true,
      zIndex: 3,
      opacity: 0.5
    });
    view.face({
      points: "#flow",
      colors: "#floc",
      color: 0xffffff,
      shaded: true,
      fill: true,
      line: true,
      closed: true,
      zIndex: 3,
      opacity: 0.5
    });
    view.face({
      points: "#pipv",
      colors: "#pipc",
      color: 0xffffff,
      shaded: true,
      fill: true,
      line: true,
      closed: true,
      zIndex: 3,
      opacity: 0.5
    });
    view.text({
      data: a.prct,
      font: 'Font Awesome',
      width: a.prct.length,
      height: 1,
      depth: 1 // , style:'bold'
    });
    view.label({
      points: "#prcp",
      color: '#ffffff',
      snap: false,
      size: 24,
      offset: [0, -120],
      depth: 0.5,
      zIndex: 3,
      outline: 0
    });
    view.text({
      data: a.prci,
      font: 'FontAwesome',
      width: a.prci.length,
      height: 1,
      depth: 1 // , style:'bold'
    });
    view.label({
      points: "#prcp",
      color: '#ffffff',
      snap: false,
      size: 36,
      offset: [0, 0],
      depth: 0.5,
      zIndex: 3,
      outline: 0
    });
    //iew.text(  { data:a.hext, font:'Font Awesome', width:a.hext.length, height:1, depth:1 } )
    //iew.label( { points:"#hexq", color:'#000000', snap:false, size:16, offset:[0,-15], depth:0.5, zIndex:3, outline:0 } )
    //iew.text(  { data:a.hexi, font:'FontAwesome', width:a.hexi.length, height:1, depth:1 } )
    //iew.label( { points:"#hexq", color:'#000000', snap:false, size:36, offset:[0, 15], depth:0.5, zIndex:3, outline:0 } )
    view.text({
      data: a.stut,
      font: 'Font Awesome',
      width: a.stut.length,
      height: 1,
      depth: 1
    });
    view.label({
      points: "#stuq",
      color: '#000000',
      snap: false,
      size: 16,
      offset: [0, -20],
      depth: 0.5,
      zIndex: 3,
      outline: 0
    });
    view.text({
      data: a.stui,
      font: 'FontAwesome',
      width: a.stui.length,
      height: 1,
      depth: 1
    });
    view.label({
      points: "#stuq",
      color: '#000000',
      snap: false,
      size: 36,
      offset: [0, 10],
      depth: 0.5,
      zIndex: 3,
      outline: 0
    });
    view.text({
      data: a.cont,
      font: 'FontAwesome',
      width: a.cont.length,
      height: 1,
      depth: 1
    });
    view.label({
      points: "#conp",
      color: '#000000',
      snap: false,
      size: 16,
      offset: [0, 15],
      depth: 0.5,
      zIndex: 4,
      outline: 0
    });
    view.text({
      data: a.flob,
      font: 'FontAwesome',
      width: a.flob.length,
      height: 1,
      depth: 1
    });
    view.label({
      points: "#flop",
      color: '#000000',
      snap: false,
      size: 16,
      offset: [0, 15],
      depth: 0.5,
      zIndex: 4,
      outline: 0
    });
    view.text({
      data: a.floe,
      font: 'FontAwesome',
      width: a.floe.length,
      height: 1,
      depth: 1
    });
    view.label({
      points: "#flop",
      color: '#000000',
      snap: false,
      size: 16,
      offset: [0, -15],
      depth: 0.5,
      zIndex: 4,
      outline: 0
    });
    view.text({
      data: a.pipb,
      font: 'FontAwesome',
      width: a.pipb.length,
      height: 1,
      depth: 1
    });
    view.label({
      points: "#pipp",
      color: '#000000',
      snap: false,
      size: 16,
      offset: [0, -15],
      depth: 0.5,
      zIndex: 4,
      outline: 0
    });
    view.text({
      data: a.pipe,
      font: 'FontAwesome',
      width: a.pipe.length,
      height: 1,
      depth: 1
    });
    view.label({
      points: "#pipp",
      color: '#000000',
      snap: false,
      size: 16,
      offset: [0, 15],
      depth: 0.5,
      zIndex: 4,
      outline: 0
    });
  }

};

export default IKW;
