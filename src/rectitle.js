'use strict';
/**
 * Constructor.
 * @constructs
 */
function RecTitle(options) {
  this.defaults = {
    fontFamily: 'Helvetica',
    fontSize: 48,
    fontColor: '#fff',
    fontMask: false,
    fontOpacity: 1,
    backgroundColor: '#ccc',
    backgroundOpacity: 0.75,
    backgroundPadding: {
      left: 10,
      top: 10,
      right: 10,
      bottom: 10
    },
    transformMatrix: {
      m11: 0,
      m12: 0,
      m21: 0,
      m22: 0,
      dx: 0,
      dy: 0
    },
    id: null
  };
  this.view = null;
  this._target = null;
  this._text = null;
  this._dimensions = {width: null, height: null};
  this._init(options);
  return this;
}

RecTitle.prototype._init = function(options) {
  this.options = this._merge(options, this.defaults);
  this._initView();
};

RecTitle.prototype._initView = function() {
  this.view = document.createElement('canvas');
  this.view.setAttribute('class', 'rectitle');
  if (this.options.id) {
    this.view.setAttribute('id', this.options.id);
  }
};

RecTitle.prototype._draw = function() {
  var context = this.view.getContext('2d');
  context.font = this.options.fontSize + 'px ' + this.options.fontFamily;
  context.fillStyle = this.options.backgroundColor;
  context.setTransform(this.options.transformMatrix.m11, this.options.transformMatrix.m12, this.options.transformMatrix.m21, this.options.transformMatrix.m22, this.options.transformMatrix.dx, this.options.transformMatrix.dy);
  context.fillRect(0, 0, this._dimensions.width, this._dimensions.height);
  if (this.options.fontMask === true) {
    context.globalCompositeOperation = 'destination-out';
  };
  context.fillText(this.getText(), this.options.backgroundPadding.left, this.options.backgroundPadding.top);
  return context;
};

RecTitle.prototype.render = function(target) {
  this.setTarget(target);
  this._dimensions = this._calculateDimensions();
  this.view.setAttribute('width', dimensions.width);
  this.view.setAttribute('height', dimensions.height);
  if (this._draw()) {
    this.getTarget().innerHTML('');
    return this.getTarget().appendChild(this.view);
  }
  return false;
};

RecTitle.prototype._calculateDimensions = function() {
  var textWidth = this.getTextWidth(this.getText());
  var width = textWidth + this.options.backgroundPadding.left + this.options.backgroundPadding.right;
  var height = this.options.fontSize + this.options.backgroundPadding.top + this.options.backgroundPadding.bottom;
  return {width: width, height: height};
};

RecTitle.prototype.getTextWidth = function(text) {
  var canvas = document.createElement('canvas');
  var width = 3072;
  var height = this.options.fontSize + 10;
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  var context = canvas.getContext('2d');
  context.font = this.options.fontSize + 'px ' + this.options.fontFamily;
  context.textAlign = 'center';
  context.fillStyle = 'black';
  context.fillText(text, width * 0.5, height * 0.5);
  return context.measureText().width;
};

RecTitle.prototype.setText = function(text) {
  if (typeof text === 'string' && text.length > 0) {
    this._text = text;
  }
  else {
    throw new TypeError('Invalid text object, non-zero string expected!');
  }
  return this._text;
};

RecTitle.prototype.getText = function() {
  if (this._text) {
    return this._text;
  }
  else {
    var text = this.getTarget().textContent || this.getTarget().innerText;
    return this.setText(text);
  }
};


RecTitle.prototype.setTarget = function(target) {
  if (target && target.tagName) {
    this._target = target;
  }
  else {
    throw new TypeError('HTMLElement expected for target!');
  }
  return this._target;
};

RecTitle.prototype.getTarget = function() {
  return this._target;
};

/**
 * Merge objects.
 * 1-dimensional merge of properties.
 * @param Object source Source object to use for merging.
 * @param Object target Target object to merge to.
 * @return Object New merged object.
 */
RecTitle.prototype._merge = function(source, target) {
  for (var option in source) {
    if (target[option] !== undefined) {
      target[option] = source[option];
    }
  }
  return target;
};
