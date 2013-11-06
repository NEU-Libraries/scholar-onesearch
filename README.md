Scholar OneSearch
==================
#### Primo Frontend for Northeastern University Libraries


This is the repository for the CSS and JavaScript to override the default styles of Exlibiris's Primo application. The CSS is authored using the awesome Bootstrap project, I am hoping to incorporate the font-awesome project.

Credit to:
- [Bootstrap](http://getbootstrap.com/)
- [LESS - CSS Preprocessor](http://lesscss.org/)
- [Font-Awesome Icon Font](http://fontawesome.io/)
- [jQuery](http://jquery.com/)
- [Modernizr](http://modernizr.com/)
- [scottjehl/Respond](https://github.com/scottjehl/Respond)



## How to use:

Dependencies: [Git](Git),  [Node.js](http://nodejs.org/) and [Grunt-cli](http://gruntjs.com/getting-started).

### Install Dependencies
If you use [Homebrew](https://github.com/mxcl/homebrew) on a Mac:

```
$ brew install git
$ brew install node
// then
$ npm install -g grunt-cli
$ npm install -g bower
```

### Install components

* Use git to clone this repository
* Install node modules
* Install bower components

```
$ git clone  https://github.com/NEU-Libraries/scholar-onesearch.git
$ cd scholar-onesearch
$ npm install
$ bower install
```

### Grunt Tasks
Configure your deploy tasks first review the `conf/exampleServer.json` and modify the Grunt tasks accordingly.

```

$ grunt less:development //compiles the less using a defined task

```




## How to Contribute

Please see the [Contribute.md](./CONTRIBUTING.md) document on how to contribute.
