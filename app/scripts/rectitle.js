(function() {
  'use strict';
  /**
   * Constructor.
   * @constructs
   */
  function RecTitle(options) {
    var defaults = {
      fontFamily: 'Helvetica',
      fontSize: 48,
      fontColor: '#fff',
      fontMask: false,
      fontOpacity: 1,
      backgroundColor: '#ccc',
      backgroundOpacity: 0.75
    };
    this.options = this._merge(options, defaults);
    console.log('options', this.options);
    return this;
  }

  /**
   * Merge objects.
   * @param Object source Source object to use for merging.
   * @param Object target Target object to merge to.
   * @return Object New merged object.
   */
  RecTitle.prototype.merge = function(source, target) {
    for (var option in source) {
      console.log('option', option);
      if (target[option] !== undefined) {
        target[option] = source[option];
      }
    }
    return target;
  };
})();
