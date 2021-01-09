/* eslint-disable no-param-reassign */
export default class AlignGrid {
  constructor(config) {
    if (!config.scene) {
      return;
    }
    if (!config.rows) {
      config.rows = 3;
    }
    if (!config.cols) {
      config.cols = 3;
    }
    if (!config.width) {
      config.width = config.scene.game.config.width;
    }
    if (!config.height) {
      config.height = config.scene.game.config.height;
    }
    this.h = config.height;
    this.w = config.width;
    this.rows = config.rows;
    this.cols = config.cols;
    // cw cell width is the scene width divided by the number of columns
    this.cw = this.w / this.cols;
    // ch cell height is the scene height divided the number of rows
    this.ch = this.h / this.rows;
    this.scene = config.scene;
  }

  // place an object in relation to the grid
  placeAt(xx, yy, obj) {
    // calculate the center of the cell
    // by adding half of the height and width
    // to the x and y of the coordinates
    const x2 = this.cw * xx + this.cw / 2;
    const y2 = this.ch * yy + this.ch / 2;
    obj.x = x2;
    obj.y = y2;
  }

  // mostly for planning and debugging this will
  // create a visual representation of the grid
  show(a = 1) {
    this.graphics = this.scene.add.graphics();
    this.graphics.lineStyle(4, 0xff0000, a);
    //
    //
    // this.graphics.beginPath();
    for (let i = 0; i < this.w; i += this.cw) {
      this.graphics.moveTo(i, 0);
      this.graphics.lineTo(i, this.h);
    }
    for (let i = 0; i < this.h; i += this.ch) {
      this.graphics.moveTo(0, i);
      this.graphics.lineTo(this.w, i);
    }
    this.graphics.strokePath();
  }

  placeAtIndex(index, obj) {
    const yy = Math.floor(index / this.cols);
    const xx = index - (yy * this.cols);
    this.placeAt(xx, yy, obj);
  }

  showNumbers(a = 1) {
    this.show(a);
    let n = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const numText = this.scene.add.text(0, 0, n, {
          color: 'red',
        });
        numText.setOrigin(0.5, 0.5);
        this.placeAt(j, i, numText);
        n++;
      }
    }
  }

  getIndexPos(index) {
    const yy = Math.floor(index / this.cols);
    const xx = index - (yy * this.cols);
    const x2 = this.cw * xx + this.cw / 2;
    const y2 = this.ch * yy + this.ch / 2;
    const obj = {};
    obj.x = x2;
    obj.y = y2;
    return obj;
  }
}
