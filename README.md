# backbone-collection-wax

> ### Wax on, Wax Off. Don't forget to breathe. Very Important!  
Mr Miyagi

![backbone-wax](https://raw.github.com/CascadeEnergy/backbone-collection-wax/master/MrMiyagi-Karate-Kid.png)

[![Build Status](https://secure.travis-ci.org/CascadeEnergy/backbone-collection-wax.png?branch=master)](https://travis-ci.org/CascadeEnergy/backbone-collection-wax)

Backbone.Collection mixin which works with backbone-model-wax to provide methods for controlling 'on'/'off' state in collections

Contributers:

- Will Vaughn

---
### [Contents](id:contents)
- [Usage](#usage)
- [Install](#install)
- [Why](#why)
- [Example](#example)
- [API](#api)
- [Tests](#tests)
- [Support](#support)

---
### [Usage](id:usage)

This mixin is a part of team with **[backbone-model-wax](https://github.com/CascadeEnergy/backbone-model-wax)**. If you install with bower, you will recieve both.

A waxy backbone collection needs to at least extend collectionwax, and listen for a `wax` event to be handled by the `breathe()` method.

    var MyCollection = Backbone.Collection.extend{
      model: MyModel, // see below.

      initialize: function() { 
        // Don't forget to breathe. Very Important!
        this.on('wax', this.breathe, this)
      }
    }

    // Mixin.
    _.extend(MyCollection.prototype, collectionwax)

Also, its models need to extend modelwax.

    var MyModel = Backbone.Model.extend({
      // do normal model stuff here.
    })

    _.extend(MyModel.prototype, modelwax)

---
[top](#contents)
### [Install](id:install)

Bower is a package manager for the web built by twitter, you should check it out, and download this package.

`$ npm install bower -g`  
`$ bower install backbone-collection-wax --save `

The `--save` flag will save backbone-collection-wax as a dependency in your project's `bower.json` file.

OR  

Download this project, take `backbone-collection-wax.js` or `backbone-collection-wax.min.js` files out and put them wherever you would like.

---
[top](#contents)
### [Why](id:why)

---
[top](#contents)
### [Example](id:example)

There is a small how-to in this repository at [example/example.html](https://github.com/CascadeEnergy/backbone-collection-wax/blob/master/example/example.html). 

The example shows how to apply the wax mixins to keep track of selection in an unordered list. It's very simplistic, but might give you some idea of how to use the mixins.

To run the example.

```
$ git clone git@github.com:CascadeEnergy/backbone-collection-wax.git
$ cd backbone-collection-wax/
$ bower install
$ node ./util/web-server.js
```

and then navigate to <http://localhost:8000/example/example.html>

---
[top](#contents)
### [API](id:api)

  _collectionwax documentation needed_

  - **multiselect**
  - **breathe()**
  - **getActive()**
  - **waxOffAll()**


  _modelwax documentation needed_

  - **wax()**
  - **isOn()**

---
[top](#contents)
### [Tests](id:tests)

Tests are in the `test/` directory, they are written with mocha, and run via `testrunner.html`. To get the dependencies for testing, you must have npm and bower installed: `npm install -g bower`.

Single Test Run. This is how travis-ci runs the tests.

```
$ git clone git@github.com:CascadeEnergy/backbone-collection-wax.git  
$ cd backbone-collection-wax/
$ npm install
$ bower install
$ npm test
```

**OR**  

Run them in the terminal as you Develop!!!

```
$ git clone git@github.com:CascadeEnergy/backbone-collection-wax.git  
$ cd backbone-collection-wax/
$ npm install
$ bower install
```

Start a server in one terminal window.  
`$ grunt nodemon`

And then in another terminal window.

```   
$ cd backbone-collection-wax/ 
$ grunt watch
```

and then just start developing. Grunt will run automated tests with [mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs), and JSHint whenever you save files.

Also tests in the browser at <http://localhost:8000/testrunner.html>

---
[top](#contents)
### [Support](id:support)

You can make an issue. Pull requests welcome.

[@nackjicholson](http://twitter.com/nackjicholson)
If I'm on my computer I'll be in IRC freenode `#sensei`

component generated with yeoman and [backbone-module](https://github.com/nackjicholson/generator-backbone-module)