'use strict';
/**
 * Constructor.
 * TODO JSDoc.
 * @constructs
 */
function RecTitle(options) {
  this.defaults = {
    fontFamily: 'Helvetica',
    fontSize: 48,
    fontColor: '#fff',
    mask: false,
    backgroundColor: '#000',
    backgroundPadding: {
      left: 10,
      top: 0,
      right: 10,
      bottom: 0
    },
    horizontalSkew: 0,
    opacity: 1,
    class: 'rectitle',
    id: null
  };
  this.view = null;
  this._target = null;
  this._style = null;
  this._text = null;
  this._transformMatrix = null;
  this._dimensions = {width: null, height: null};
  this._init(options);
  return this;
}

RecTitle.prototype._init = function(options) {
  this.options = this._merge(this._parse(options), this.defaults);
  this._transformMatrix = {
    m11: 1,
    m12: this.options.horizontalSkew,
    m21: 0,
    m22: 1,
    dx: 0,
    dy: 0
  };
  this._initView();
};

RecTitle.prototype._initView = function() {
  this.view = document.createElement('canvas');
  this.view.setAttribute('class', this.options.class);
  this.view.setAttribute('style', 'background-color:transparent;');
  if (this.options.id) {
    this.view.setAttribute('id', this.options.id);
  }
};

RecTitle.prototype.hasTransformMatrix = function() {
  return this._transformMatrix && (this._transformMatrix.m12 !== 0 || this._transformMatrix.m21 !== 0);
};

RecTitle.prototype.render = function(target, skipAppend) {
  if (target) {
    this.setTarget(target);
  }
  else if (!this.getTarget()) {
    throw new Error('Render expects target!');
  }
  this._dimensions = this._calculateDimensions();
  this.view.setAttribute('width', this._dimensions.width);
  this.view.setAttribute('height', this._dimensions.height);
  if (this._draw()) {
    return skipAppend ? this.view : this.emptyTarget().appendChild(this.view);
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
  if (this.hasTransformMatrix() && this._transformMatrix.m12 !== 0) {
    var angle = Math.atan(this._transformMatrix.m12);
    dimensions.height = Math.abs(Math.tan(angle) * width) + height;
    dimensions.shift.y = dimensions.height - dimensions.original.height;
  }
  return dimensions;
};

RecTitle.prototype._draw = function() {
  var context = this.view.getContext('2d');
  if (this.options.opacity < 1) {
    context.globalAlpha = this.options.opacity;
  }
  context.font = this.options.fontSize + 'px ' + this.options.fontFamily;
  if (this.hasTransformMatrix()) {
    context.transform(this._transformMatrix.m11, this._transformMatrix.m12, this._transformMatrix.m21, this._transformMatrix.m22, this._transformMatrix.dx, this._transformMatrix.dy);
  }
  context.fillStyle = this.options.backgroundColor;
  context.fillRect(this._dimensions.shift.x, this._dimensions.shift.y, this._dimensions.width - this._dimensions.shift.x, this._dimensions.height - this._dimensions.shift.y);
  if (this.options.mask === true) {
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
    var textTransform = this._style.getPropertyValue('text-transform');
    switch (textTransform) {
      case 'uppercase':
        text = text.toUpperCase();
        break;
      case 'lowercase':
        text = text.toLowerCase();
        break;
      case 'capitalize':
        text = text.charAt(0).toUpperCase() + text.slice(1);
        break;
    }
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
    this._style = window.getComputedStyle(this._target);
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
  for (var option in target) {
    if (source[option] !== undefined) {
      target[option] = source[option];
    }
  }
  return target;
};

RecTitle.prototype._parse = function(options) {
  if (options.fontSize && typeof options.fontSize !== 'number') {
    if (this._isPixelValue(options.fontSize)) {
      options.fontSize = Number(options.fontSize.substring(0, options.fontSize.indexOf('p')));
    }
    else {
      throw new TypeError('Incorrect font size! Please provide numeric value.');
    }
  }
  options.mask = options.mask && (options.mask === true || options.mask === 'true' || options.mask === '1');
  return options;
};

RecTitle.prototype._isPixelValue = function(value) {
  return typeof value !== 'number' && (value.indexOf('px') !== -1 || value.indexOf('pt') !== -1);
};
