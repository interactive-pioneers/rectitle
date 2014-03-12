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
    id: null
  };
  this.view = null;
  this._init(options);
  return this;
}

RecTitle.prototype._init = function(options) {
  this.options = this._merge(options, this.defaults);
  this._initView();
  //this._build();
};

RecTitle.prototype._initView = function() {
  this.view = document.createElement('canvas');
  this.view.setAttribute('class', 'rectitle');
  if (this.options.id) {
    this.view.setAttribute('id', this.options.id);
  }
};

RecTitle.prototype._build = function() {
//  this.view.setAttribute('width', this.options.width);
};

RecTitle.prototype.render = function(target) {
  if (target && target.tagName) {
    // TODO implement canvas build
    return true;
  }
  else {
    throw new TypeError('HTMLElement expected for rendering!');
  }
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
