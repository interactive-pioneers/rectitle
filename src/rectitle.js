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
    backgroundColor: '#000',
    backgroundOpacity: 0.75,
    backgroundPadding: {
      left: 10,
      top: 0,
      right: 10,
      bottom: 0
    },
    transformMatrix: {
      m11: 0,
      m12: 0,
      m21: 0,
      m22: 0,
      dx: 0,
      dy: 0
    },
    class: 'rectitle',
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
  this.view.setAttribute('class', this.options.class);
  this.view.setAttribute('style', 'backrgound-color:transparent;');
  if (this.options.id) {
    this.view.setAttribute('id', this.options.id);
  }
};


RecTitle.prototype.hasTransformMatrix = function() {
  for (var i in this.options.transformMatrix) {
    if (this.options.transformMatrix[i] !== 0) {
      return true;
    }
  }
  return false;
};

RecTitle.prototype.render = function(target) {
  this.setTarget(target);
  this._dimensions = this._calculateDimensions();
  this.view.setAttribute('width', this._dimensions.width);
  this.view.setAttribute('height', this._dimensions.height);
  if (this._draw()) {
    return this.emptyTarget().appendChild(this.view);
  }
  return false;
};

RecTitle.prototype.emptyTarget = function() {
  var target = this.getTarget();
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }
  return target;
};

RecTitle.prototype._calculateDimensions = function() {
  var width = this.getTextWidth(this.getText()) + this.options.backgroundPadding.left + this.options.backgroundPadding.right;
  var height = this.options.fontSize + this.options.backgroundPadding.top + this.options.backgroundPadding.bottom;
  return this._getTransformedDimensions(width, height);
};

RecTitle.prototype._getTransformedDimensions = function(width, height) {
  var dimensions = {
    width: width,
    height: height,
    original: {
      width: width,
      height: height
    },
    shift: {
      x: 0,
      y: 0
    }
  };
  //return dimensions;
  var angle;
  if (this.options.transformMatrix.m12 !== 0) {
    angle = Math.atan(this.options.transformMatrix.m12);
    dimensions.height = Math.abs(Math.tan(angle) * width) + height;
    dimensions.shift.y = dimensions.height - dimensions.original.height;
  }
  // TODO fix skewing failing cut right-side
  if (this.options.transformMatrix.m21 !== 0) {
    angle = Math.atan(this.options.transformMatrix.m21);
    var trialWidth = Math.tan(angle) * height;
    dimensions.width = trialWidth * 2 + width;
    //console.log('width', dimensions.width, Math.abs(Math.tan(angle) * height) );
    if (Math.abs(trialWidth) !== trialWidth) {
      dimensions.shift.x =  Math.tan(angle) * height;
    }
  }
  return dimensions;
};

RecTitle.prototype._draw = function() {
  var context = this.view.getContext('2d');
  context.font = this.options.fontSize + 'px ' + this.options.fontFamily;
  if (this.hasTransformMatrix()) {
    context.transform(this.options.transformMatrix.m11, this.options.transformMatrix.m12, this.options.transformMatrix.m21, this.options.transformMatrix.m22, this.options.transformMatrix.dx, this.options.transformMatrix.dy);
  }
  context.fillStyle = this.options.backgroundColor;
  context.fillRect(this._dimensions.shift.x, this._dimensions.shift.y, this._dimensions.width - this._dimensions.shift.x, this._dimensions.height - this._dimensions.shift.y);
  if (this.options.fontMask === true) {
    context.globalCompositeOperation = 'destination-out';
  }
  else {
    context.fillStyle = this.options.fontColor;
  }
  context.fillText(this.getText(), this.options.backgroundPadding.left + this._dimensions.shift.x, this._dimensions.original.height - this.options.backgroundPadding.bottom);
  return context;
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
  return context.measureText(text).width;
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
    var text = this.getTarget().textContent;
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
