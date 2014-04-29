'use strict';
/**
 * Constructor.
 * TODO JSDoc.
 * @constructs
 */
function RecTitle(options) {
  if (this._hasCapabilities()) {
    return this._init(options);
  }
  return null;
}

RecTitle.prototype._hasCapabilities = function() {
  var canvas = document.createElement('canvas');
  return !!(canvas.getContext && canvas.getContext('2d'));
};

RecTitle.prototype._setDefaults = function() {
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
    backgroundOpacity: 1,
    horizontalSkew: 0,
    opacity: 1,
    className: 'rectitle',
    id: null,
    webFontUrl: null
  };
  this.view = null;
  this._target = null;
  this._style = null;
  this._text = null;
  this._transformMatrix = null;
  this._dimensions = {width: null, height: null};
  this._skipAppend = false;
};

RecTitle.prototype._init = function(options) {
  this._setDefaults();
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
  return this;
};

RecTitle.prototype._initView = function() {
  this.view = document.createElement('canvas');
  this.view.setAttribute('class', this.options.className);
  this.view.setAttribute('style', 'background-color:transparent;');
  if (this.options.id) {
    this.view.setAttribute('id', this.options.id);
  }
};

RecTitle.prototype.hasTransformMatrix = function() {
  return this._transformMatrix && (this._transformMatrix.m12 !== 0 || this._transformMatrix.m21 !== 0);
};

RecTitle.prototype.render = function(target, skipAppend) {
  if (!this._hasCapabilities()) {
    return false;
  }
  if (target) {
    this.setTarget(target);
  }
  else if (!this.getTarget()) {
    throw new Error('Render expects target!');
  }
  this._skipAppend = skipAppend;
  this._preRender();
};

/**
 * Finalise rendering with actual measurements from pre-render.
 * TODO: remove and keep single render method (as in the master version)
 * TODO: implement PIXI algoritm for height measurements (tested to work) https://gist.github.com/videlais/9589285
 */
RecTitle.prototype._render = function(textBounds) {
  var width = textBounds.width + this.options.backgroundPadding.left + this.options.backgroundPadding.right;
  var height = textBounds.height + this.options.backgroundPadding.top + this.options.backgroundPadding.bottom;
  this._dimensions = this._getTransformedDimensions(width, height);
  this.view.setAttribute('width', this._dimensions.width);
  this.view.setAttribute('height', this._dimensions.height);
  if (this._draw() && !this._skipAppend) {
    this.emptyTarget().appendChild(this.view);
  }
};

RecTitle.prototype.emptyTarget = function() {
  var target = this.getTarget();
  while (target.firstChild) {
    target.removeChild(target.firstChild);
  }
  return target;
};
/*
RecTitle.prototype._calculateDimensions = function(textBounds) {
  var width = textBounds.x + this.options.backgroundPadding.left + this.options.backgroundPadding.right;
  var height =  + this.options.backgroundPadding.top + this.options.backgroundPadding.bottom;
  return this._getTransformedDimensions(width, height);
};*/

RecTitle.prototype._preRender = function() {
  this._setTextBounds(this._render.bind(this));
};

/**
 * Set real visible height of text.
 * Text height by font size is unreliable and is not visibly correct.
 * Calculate by drawn pixels.
 */
RecTitle.prototype._setTextBounds = function(callback) {
  var canvas = document.createElement('canvas');
  var width = this.getTextWidth(this.getText());
  var height = this.options.fontSize;
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  var context = canvas.getContext('2d');
  context.translate(0, Math.round(height * 0.8));
  context.font = this.options.fontSize + 'px "' + this.options.fontFamily + '"';
  context.fillStyle = '#000';
  console.log('>> ', this.getText(), width, height, this.options.fontFamily);
  context.fillText(this.getText(), 0, 0);
  var debugSlot = document.createElement('div');
  debugSlot.style.backgroundColor = 'rgba(127,127,127,0.5)';
  debugSlot.style.backgroundRepeat = 'no-repeat';
  debugSlot.style.position = 'absolute';
  debugSlot.style.width = '400px';
  debugSlot.style.height = '100px';
  document.body.appendChild(debugSlot);
  setTimeout(function() {
    var bounds = {
      x: 0,
      y: 0,
      width: width,
      height: 0
    };
    var data = context.getImageData(0, 0, width, height).data;
    console.log('data: ' + data.length + ' B');
    debugSlot.style.backgroundImage = 'url(' + canvas.toDataURL('image/png') + ')';
    var first = 0;
    var last = 0;
    var pxw = 0;
    var pxh = height;
    // last line with black pixel
    while (!last && pxh) {
      pxh--;
      for (pxw = 0; pxw < width; pxw++) {
        if (data[pxh  * width * 4 + pxw * 4 + 3]) {
          last = pxh;
          break;
        }
      }
    }
    pxh = height;
    // 1st line with black pixel
    while (pxh) {
      pxh--;
      for (pxw = 0; pxw < width; pxw++) {
        if (data[pxh * width * 4 + pxw * 4 + 3]) {
          first = pxh;
          break;
        }
      }
      if (first !== pxh) {
        console.log('caught!', last, first);
        bounds.height = last - first;
      }
    }
    console.log('bounds', bounds.width, bounds.height);
    callback(bounds);
  }, 1000);
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
  if (this.options.horizontalSkew > 0) {
    context.translate(0, -this._dimensions.shift.y);
  }
  if (this.options.opacity < 1) {
    context.globalAlpha = this.options.opacity;
  }
  context.font = this.options.fontSize + 'px ' + this.options.fontFamily;
  if (this.hasTransformMatrix()) {
    context.transform(this._transformMatrix.m11, this._transformMatrix.m12, this._transformMatrix.m21, this._transformMatrix.m22, this._transformMatrix.dx, this._transformMatrix.dy);
  }
  context.fillStyle = this.getRGBA(this.options.backgroundColor, this.options.backgroundOpacity);
  context.fillRect(this._dimensions.shift.x, this._dimensions.shift.y, this._dimensions.width - this._dimensions.shift.x, this._dimensions.height - this._dimensions.shift.y);
  if (this.options.mask === true) {
    context.globalCompositeOperation = 'destination-out';
  }
  else {
    context.fillStyle = this.options.fontColor;
  }
  context.fillText(this.getText(), this.options.backgroundPadding.left + this._dimensions.shift.x, this._dimensions.original.height - this.options.backgroundPadding.bottom + this._dimensions.shift.y);
  return context;
};

RecTitle.prototype.getRGBA = function(color, alpha) {
  if (!alpha) {
    alpha = 1;
  }
  if (color.charAt(0) === '#') {
    if (color.length === 4) {
      var shorthandPattern = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      color = color.replace(shorthandPattern, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });
    }
    var matches = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (matches) {
      var rgb =  {
        r: parseInt(matches[1], 16),
        g: parseInt(matches[2], 16),
        b: parseInt(matches[3], 16)
      };
      color = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
    }
  }
  else if (color.indexOf('rgb(') === 0) {
    color = 'rgba' + color.substring(3, color.indexOf(')')) + ',' + alpha + ')';
  }
  return color;
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

RecTitle.prototype.getWidth = function() {
  return this._dimensions.width;
};

RecTitle.prototype.getHeight = function() {
  return this._dimensions.height;
};

RecTitle.prototype.getShift = function() {
  return this._dimensions.shift;
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
    if (Number(options.fontSize).toString() === options.fontSize) {
      options.fontSize = Number(options.fontSize);
    }
    else if (this._isPixelValue(options.fontSize)) {
      options.fontSize = Number(options.fontSize.substring(0, options.fontSize.indexOf('p')));
    }
    else {
      throw new TypeError('Incorrect font size! Please provide numeric value.');
    }
  }
  if (options.backgroundPadding) {
    for (var i in options.backgroundPadding) {
      options.backgroundPadding[i] = Number(options.backgroundPadding[i]);
    }
  }
  if (options['class']) {
    options.className = options['class'];
  }
  options.mask = options.mask && (options.mask === true || options.mask === 'true' || options.mask === '1');
  return options;
};

RecTitle.prototype._isPixelValue = function(value) {
  return typeof value !== 'number' && (value.indexOf('px') !== -1 || value.indexOf('pt') !== -1);
};





