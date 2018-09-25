var Gui;

Gui = class Gui {
  constructor(act) {
    this.act = act;
    this.gui = new dat.GUI();
    this.planes();
    this.rows();
    this.cols();
  }

  planes() {
    var pfolder;
    pfolder = this.gui.addFolder('Planes');
    pfolder.add(this.act, 'info');
    pfolder.add(this.act, 'know');
    pfolder.add(this.act, 'wise');
    return pfolder.open();
  }

  rows() {
    var rfolder;
    rfolder = this.gui.addFolder('Rows');
    rfolder.add(this.act, 'learn');
    rfolder.add(this.act, 'do');
    rfolder.add(this.act, 'share');
    return rfolder.open();
  }

  cols() {
    var rfolder;
    rfolder = this.gui.addFolder('Cols');
    rfolder.add(this.act, 'embrace');
    rfolder.add(this.act, 'innovate');
    rfolder.add(this.act, 'encourage');
    return rfolder.open();
  }

};

export default Gui;
