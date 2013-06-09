define([
  'jquery',
  'backbone',
  'chai',
  'bower_components/backbone-model-wax/backbone-model-wax',
  'lib/backbone-collection-wax'
], function($, Backbone, chai, modelwax, collectionwax) { 
  'use strict';

  var expect = chai.expect;

  describe('collection-wax', function() {
    var HeroModel
      , HeroesCollection
      , heroes
      , mockHeroes; 

    mockHeroes = [
      {name: 'Daniel LaRusso'},
      {name: 'Keisuke Miyagi'},
      {name: 'Mr. Han'}
    ];

    beforeEach(function() {
      HeroModel = Backbone.Model.extend({});
      _.extend(HeroModel.prototype, modelwax);

      HeroesCollection = Backbone.Collection.extend({
        model: HeroModel,
        initialize: function() {
          this.on('wax', this.breathe, this);
        }
      });
      _.extend(HeroesCollection.prototype, collectionwax);

      heroes = new HeroesCollection(mockHeroes);
    });

    afterEach(function() {
      heroes.off();
      heroes = undefined;
    });

    it('should be an object', function() {
      expect(collectionwax).to.be.a('object');
    });

    it('heroes mock collection length should be 3', function() {
      expect(heroes.length).to.equal(3); 
    });

    it('should start with no active models', function() {
      var actives = heroes.where({on: true});
      var altActives = heroes.getActive();
      expect(actives).to.be.empty;
      expect(altActives).to.equal(null);
    });

    describe('._setActive() - multiselect: false', function() {
      it('should set ._active to null if there are no active models.', function() {
        var active;

        heroes._setActive();
        active = heroes.getActive();
        expect(active).to.equal(null);
      });

      it('should set ._active to a reference of an activated model', function() {
        var first
          , active;

        first = heroes.first();
        first.set({on: true});

        heroes._setActive();
        active = heroes.getActive();
        expect(active).to.eql(first);
      });

      it('should set ._active to a reference of the first activated model in the collection', function() {
        // This situation can only happen if you're not using the model.wax() interface.
        // Instead your wondering around going crazy doing model.set({on: true}). Don't do it.
        var first
          , last
          , active;

        first = heroes.first();
        last = heroes.last();
        first.set({on: true});
        last.set({on: true});

        heroes._setActive();
        active = heroes.getActive();
        expect(active).to.eql(first);
      });
    });

    describe('._setActive() - multiselect: true', function() {
      beforeEach(function() { heroes.multiselect = true; });

      it('should have multiselect:true', function() {
        expect(heroes.multiselect).to.equal(true); 
      });

      it('should set ._active to null if there are no active models', function() {
        var initialActives
          , active;

        initialActives = heroes.where({on: true});
        expect(initialActives).to.be.empty;

        heroes._setActive();
        active = heroes.getActive();
        expect(active).to.equal(null);
      });

      it('should set ._active to an array with a reference to an activated model', function() {
        var first
          , active;

        first = heroes.first();
        first.set({on: true});

        heroes._setActive();
        active = heroes.getActive();

        expect(active).to.be.an('array');
        expect(active.length).to.equal(1);
        expect(_.indexOf(active, first)).to.equal(0);
      });

      it('should set ._active to an array with references to all activated models', function() {
        var first
          , last
          , active;

        first = heroes.first();
        last = heroes.last();
        first.set({on: true});
        last.set({on: true});

        heroes._setActive();
        active = heroes.getActive();

        expect(active).to.be.an('array');
        expect(active.length).to.equal(2);
        expect(_.indexOf(active, first)).to.equal(0);
        expect(_.indexOf(active, last)).to.equal(1);
      });
    });

    describe('.getActive()', function() {
      it('should return the value of the private property ._active', function() {
        var first = heroes.first()
          , last = heroes.last()
          , active;

        first.wax();
        active = heroes.getActive();
        expect(active).to.eql(heroes._active);
      });
    });
    
    describe('.breathe() - always', function() {
      it('should trigger "stateChange" event in absence of the silent option', function(done) {
        var first = heroes.first()
          , spy = function() { done(); };

        heroes.on('stateChange', spy);
        first.wax();
        heroes.off('stateChange', spy);
      });

      it('should not trigger "stateChange" event when silent option exists', function(done) {
        var start
          , spy
          , first;

        start = Date.now();

        spy = function() { 
          var end
            , diff;

          end = Date.now();
          diff = end - start; 
          expect(diff).to.be.at.least(500);
          done();
        };

        first = heroes.first();

        heroes.on('stateChange', spy);
        first.wax({silent: true});
        heroes.off('stateChange', spy);

        // Call spy after a while.
        setTimeout(spy, 500);
      });
    });

    describe('.breathe() - multiselect: false', function() {
      it('should get called when a model becomes active.', function(done) {
        var first = heroes.first()
          , breatheMock = function() {
            done();
          };

        heroes.on('wax', breatheMock);
        first.wax();
        heroes.off('wax', breatheMock);
      });

      it('should set ._active to a reference of the activated model', function() {
        var first
          , active
          , name;

        first = heroes.first();
        first.wax();

        active = heroes.getActive();
        expect(active).to.be.an.instanceof(Backbone.Model);
        expect(active).to.eql(first);

      });

      it('should replace the reference in ._active when a new one is activated.', function() {
        var first
          , active
          , last;

        first = heroes.first();
        last = heroes.last();

        first.wax();
        active = heroes.getActive();
        expect(active).to.eql(first);

        last.wax();
        active = heroes.getActive();
        expect(active).to.eql(last);
      });

      it('should not be able to remove all active models', function() {
        var active
          , first;

        first = heroes.first();

        first.wax();
        first.wax();

        active = heroes.getActive();
        expect(active).to.eql(first);
      });
    });

    describe('.breathe() - multiselect: true', function() {
      beforeEach(function() { heroes.multiselect = true; });

      it('should have multiselect:true', function() {
        expect(heroes.multiselect).to.equal(true); 
      });

      it('activating one model should set ._active to an array containing that model.', function() {
        var first
          , actives
          , name;

        // There are none.
        actives = heroes.getActive();
        expect(actives).to.equal(null);

        // Activate one.
        first = heroes.first();
        first.wax();

        // Should be an array so we can pop more on if necessary.
        actives = heroes.getActive();
        expect(actives).to.be.an('array');
        expect(actives.length).to.equal(1);
        expect(_.indexOf(actives, first)).to.equal(0);
      });

      it('should be able to push models to the array of active models', function() {
        var actives
          , danielsan 
          , mrmiyagi
          , mrhan;


        danielsan = heroes.find(function(hero) { return hero.get('name') === 'Daniel LaRusso'; } );
        mrmiyagi = heroes.find(function(hero) { return hero.get('name') === 'Keisuke Miyagi'; } );
        mrhan = heroes.find(function(hero) { return hero.get('name') === 'Mr. Han'; } );

        danielsan.wax();

        actives = heroes.getActive();
        expect(actives).to.be.an('array');
        expect(actives.length).to.equal(1);
        expect(_.indexOf(actives, danielsan)).to.equal(0);

        mrmiyagi.wax();

        actives = heroes.getActive();
        expect(actives).to.be.an('array');
        expect(actives.length).to.equal(2);
        expect(_.indexOf(actives, mrmiyagi)).to.equal(1);

        mrhan.wax();

        actives = heroes.getActive();
        expect(actives).to.be.an('array');
        expect(actives.length).to.equal(3);
        expect(_.indexOf(actives, mrhan)).to.equal(2);
      });

      it('should be able to unselect a model until none are active', function() {
        var actives
          , first
          , last;

        first = heroes.first();
        last = heroes.last();

        first.wax(); // Set active.

        first.wax(); // Set active again.
        actives = heroes.getActive();
        expect(actives).to.equal(null);
      });

      it('should be able to unselect a model', function() {
        var actives
          , first
          , last;

        first = heroes.first();
        last = heroes.last();

        // activate both.
        first.wax();
        last.wax();

        // deactivate one.
        first.wax();

        actives = heroes.getActive();

        expect(actives).to.be.an('array');
        expect(actives.length).to.equal(1);
        expect(actives).to.contain(last);
        expect(actives).to.not.contain(first);
      });
    });

    // TODO: extract the always stuff into sharedBehaviors possibly.
    describe('.waxOffAll() - always', function() {

      it('should trigger "stateChange" event, in absence of the silent option', function(done) {
        var spy = function() { 
          done();
        };

        heroes.on('stateChange', spy);
        heroes.waxOffAll();
        heroes.off('stateChange', spy);
      });

      it('should not trigger "stateChange" event when silent option exists', function(done) {
        var start
          , spy;

        start = Date.now();

        spy = function() { 
          var end
            , diff;

          end = Date.now();
          diff = end - start; 
          expect(diff).to.be.at.least(500);
          done();
        };


        heroes.on('stateChange', spy);
        heroes.waxOffAll({silent: true});
        heroes.off('stateChange', spy);

        // Call spy after a while.
        setTimeout(spy, 500);
      });
    });

    describe('.waxOffAll() - mulitselect: false', function() {
      it('should turn all models off', function() {
        var actives
          , first;

        first = heroes.first();
        first.wax();

        heroes.waxOffAll();

        actives = heroes.where({on: true});
        expect(actives).to.be.empty;
      });

      it('should set ._active to null', function() {
        var actives
          , first;

        first = heroes.first();
        first.wax();

        heroes.waxOffAll();

        actives = heroes.getActive();
        expect(actives).to.equal(null);
      });
    });

    describe('.waxOffAll() - mulitselect: true', function() {
      beforeEach(function() { heroes.multiselect = true; });

      it('should turn all models off', function() {
        var actives
          , first
          , last;

        first = heroes.first();
        last = heroes.last();

        first.wax();
        last.wax();

        heroes.waxOffAll();

        actives = heroes.where({on: true});
        expect(actives).to.be.empty;
      });

      it('should set ._active to null', function() {
        var actives
          , first
          , last;

        first = heroes.first();
        last = heroes.last();

        first.wax();
        last.wax();

        heroes.waxOffAll();

        actives = heroes.getActive();
        expect(actives).to.equal(null);
      });
    });
  });
});