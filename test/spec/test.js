'use strict';
/* jshint undef: false */
(function () {
  describe('rectitle', function () {
    //var expect = chai.expect;

    var config = {
      fontFamily: 'Arial',
      fontSize: 12,
      id: 'rectitle-007',
      backgroundPadding: {
        left: 15,
        top: 15,
        right: 15,
        bottom: 15
      }
    };
    var rectitle;

    describe('init', function () {
      beforeEach(function() {
        rectitle = new RecTitle(config);
      });
      it('expected to construct object', function () {
        return expect(rectitle).to.be.an.object;
      });
      it('expected to set font size to ' + config.fontSize, function() {
        return expect(rectitle.options.fontSize).to.equal(config.fontSize);
      });
      it('expected to set font family to ' + config.fontFamily, function() {
        return expect(rectitle.options.fontFamily).to.equal(config.fontFamily);
      });
      it('expected to set element ID to ' + config.id, function() {
        return expect(rectitle.view.getAttribute('id')).to.equal(config.id);
      });
      it('expected to have background padding set to ' + config.backgroundPadding.toString(), function() {
        return expect(rectitle.options.backgroundPadding).to.equal(config.backgroundPadding);
      });
    });

    describe('render', function() {

      var headline = document.createElement('h2');
      var major = document.createElement('span');
      major.setAttribute('class', 'cutout');
      major.setAttribute('data-fontsize', 35);
      headline.appendChild(major);
      var minor = document.createElement('span');
      minor.setAttribute('data-fontsize', 78);
      headline.appendChild(minor);
      document.body.appendChild(headline);
      var target;

      beforeEach(function() {
        var targets = document.getElementsByClassName('cutout');
        target = targets[0];
        rectitle = new RecTitle(config);
      });
      it('expected to have rectitle initialised', function() {
        return expect(rectitle).to.exist;
      });
      it('expected to have target defined for testing', function() {
        return expect(target).to.exist;
      });
      it('expected to fail without target', function() {
        return expect(rectitle.render).to.throw(Error);
      });
      it('expected to fail on invalid target', function() {
        var test = function() {
          var fakeTarget = {name: 'fakeObject'};
          rectitle.render(fakeTarget);
        };
        return expect(test).to.throw(TypeError);
      });
      it('expected to succeed on valid target', function() {
        return expect(rectitle.render(target)).to.be.ok;
      });
    });

  });
})();
