// ## backbone-collection-wax.js
// 
// // author: Will Vaughn
//
// > description
// 
// The below Use Anywhere setup was so graciously provided to me by:
// <https://github.com/umdjs/umd/blob/master/returnExports.js>

(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports, like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.collectionwax = factory();
  }
}(this, function () {
  'use strict';

  // This is backbone-collection-wax.
  return {

    _active: null,

    multiselect: false,

    breathe: function() {

      var args = arguments.length ? [].slice.call(arguments, 0) : [],
          current = args[0],
          options = args[1] ? args[1] : {};

      this.each(function(model) {

        if (model === current) {

          if (!current.get("on")) {
            // on is false
            model._waxOn(options);
          } else if (current.get("on") && this.multiselect) {
            // on is true, and multiselect is on.
            model._waxOff(options);
          }

        } else {
          // model is not current.
          if (!this.multiselect) {
            model._waxOff(options); 
          } 
        } 
      }, this); 

      this._setActive();

      if (!options.silent) {
        // this._stateChanged();
        var actives = this.getActive(); 
        this.trigger("stateChange", actives, options);
      }
    },

    _setActive: function() {
      var actives = this.filter(function(model) {
        return model.isOn(); 
      }, this); 

      if (actives.length >= 1 && !this.multiselect) {
        this._active = actives[0]; 
      } else if (actives.length >= 1 && this.multiselect) {
        this._active = actives;
      } else {
        this._active = null; 
      } 
    },

    getActive: function() {
      return this._active;
    },

    // TODO test and wire up this function to keep me from repeating like I have in breathe and waxOffAll
    /*
    _stateChanged: function() {
      var actives = this.getActive();
      this.trigger("stateChange", actives, options); 
    },
    */

    waxOffAll: function(options) {
      options = options ? options : {};

      this.each(function(model) {
        model._waxOff(options); 
      }); 

      this._setActive();

      if (!options.silent) {
        // this._stateChanged();
        var actives = this.getActive();
        this.trigger("stateChange", actives, options); 
      }
    } 
  };
}));