var Act;

Act = class Act {
  constructor(scene) {
    this.scene = scene;
    this.infoVis = true;
    this.knowVis = true;
    this.wiseVis = true;
    this.learnVis = true;
    this.doVis = true;
    this.shareVis = true;
    this.embraceVis = true;
    this.innovateVis = true;
    this.encourageVis = true;
  }

  info() {
    return this.infoVis = this.traverse('plane', 'Information', this.infoVis);
  }

  know() {
    return this.knowVis = this.traverse('plane', 'Knowledge', this.knowVis);
  }

  wise() {
    return this.wiseVis = this.traverse('plane', 'Wisdom', this.wiseVis);
  }

  learn() {
    return this.learnVis = this.traverse('row', 'Learn', this.learnVis);
  }

  do() {
    return this.doVis = this.traverse('row', 'Do', this.doVis);
  }

  share() {
    return this.shareVis = this.traverse('row', 'Share', this.shareVis);
  }

  embrace() {
    return this.embraceVis = this.traverse('col', 'Embrace', this.embraceVis);
  }

  innovate() {
    return this.innovateVis = this.traverse('col', 'Innovate', this.innovateVis);
  }

  encourage() {
    return this.encourageVis = this.traverse('col', 'Encourage', this.encourageVis);
  }

  traverse(prop, value, visible) {
    var reveal;
    visible = visible ? false : true;
    reveal = (child) => {
      if ((child[prop] != null) && child[prop] === value) {
        child.visible = visible;
        return console.log('reveal', {
          name: child.name,
          prop: prop,
          value: value,
          visible: child.visible
        });
      }
    };
    this.scene.traverse(reveal);
    return visible;
  }

};

export default Act;
