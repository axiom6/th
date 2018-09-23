import Util  from '../util/Util.js';
import Vis   from '../vis/Vis.js';
import MBox  from '../mbox/MBox.js';
import Coord from '../mbox/Coord.js';
var Regress;

Regress = class Regress {
  constructor(mbox) {
    this.mbox = mbox;
    this.width = 100;
    this.height = 100;
    this.mathbox = this.mbox.mathbox;
    this.coord = new Coord(this.mbox, this.width, this.height);
  }

  viewLinearRegress() {
    var points, slope, yInter;
    this.x = this.toArray(this.data02(), 0);
    this.y = this.toArray(this.data02(), 1);
    this.n = Math.min(this.x.length, this.y.length);
    [slope, yInter] = this.slopeYInter(this.n, this.x, this.y);
    Util.alert({
      slope: slope,
      yInter: yInter
    });
    this.view = this.coord.cartesian([[0, 4], [0, 500], [0, 4]]);
    points = this.view.area(this.areaRegress(this.n, this.x, this.y));
    return this.view.surface({
      points: points,
      color: 0x5090FF,
      shaded: true,
      opacity: 1.0,
      lineX: true,
      lineY: true,
      width: 2
    });
  }

  areaRegress(n, x, y) {
    var obj;
    obj = {
      id: 'areaRegress',
      width: this.width,
      height: this.height,
      axes: [1, 3],
      channels: 3
    };
    obj.expr = (emit, slope, yInter, i, j) => {
      Util.noop(i, j);
      return emit(slope, this.rss(n, x, y, slope, yInter), yInter);
    };
    return obj;
  }

  rss(n, x, y, slope, yInter) {
    var i, k, ref, sum, term;
    sum = 0.0;
    for (i = k = 0, ref = n; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
      term = y[i] - yInter - slope * x[i];
      sum = sum + term * term;
    }
    //console.log( Util.toFixed(sum,1), Util.toFixed(slope,1), Util.toFixed(yInter,1) )
    return sum;
  }

  data01() {
    return [[0, 2], [1, 4], [2, 3], [3, 5], [4, 8], [5, 9], [6, 10], [7, 11]];
  }

  data02() {
    return [[0.0, 2.1], [1.0, 3.9], [2, 5.2], [3, 7.9], [4.0, 10.3], [5, 11.7], [6, 14.1], [7, 15.9]];
  }

  toArray(data, index) {
    var d, k, len, x;
    x = [];
    for (k = 0, len = data.length; k < len; k++) {
      d = data[k];
      x.push(d[index]);
    }
    return x;
  }

  slopeYInter(n, x, y) {
    var denom, numer, slope, xmean, yInter, ymean;
    xmean = this.mean(n, x);
    ymean = this.mean(n, y);
    numer = this.sumProducts(n, x, y, xmean, ymean);
    denom = this.sumSquares(n, x, xmean);
    slope = numer / denom;
    yInter = ymean - slope * xmean;
    return [slope, yInter];
  }

  sumProducts(n, x, y, xmean, ymean) {
    var i, k, ref, sum;
    sum = 0.0;
    for (i = k = 0, ref = n; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
      sum = sum + (x[i] - xmean) * (y[i] - ymean);
    }
    return sum;
  }

  sumSquares(n, x, xmean) {
    var i, k, ref, sum;
    sum = 0.0;
    for (i = k = 0, ref = n; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
      sum = sum + (x[i] - xmean) * (x[i] - xmean);
    }
    return sum;
  }

  mean(n, x) {
    var i, k, ref, sum;
    sum = 0;
    for (i = k = 0, ref = n; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
      sum = sum + x[i];
    }
    return sum / n;
  }

};

export default Regress;
