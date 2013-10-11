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




## How to use:

Dependencies: [Git](Git),  [Node.js](http://nodejs.org/) and [Grunt-cli](http://gruntjs.com/getting-started).

If you use [Homebrew](https://github.com/mxcl/homebrew):

```
$ brew install git
$ brew install node
// then
$ npm install -g grunt-cli
```

* Use git to clone the source code and submodules.
* Install node modules

```
$ git clone --recursive -b develop https://github.com/NEU-Libraries/scholar-onesearch.git
$ cd scholar-onesearch
$ npm install
```



## For Developers

@todo add documentation here ASAP

### LESS Structure

```
less/
  |-base/
  |-components/
  |-legacy/
  |-library/
  |-sections/
  |-utilities/
  |-vendor/
  - legacy.less
  - style.less
```
