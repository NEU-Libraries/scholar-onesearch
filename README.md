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
---------
#### employed a process to load up CSS from a local system... 2/12/2014.
  
  * Adjust JSON config file to set up local server parameters
  * Use Grunt/NODE.js to run a local server on port 80.
  * assign NOcss2 to the NUdev view this is an entry with a bogus empty css file.
  * load the CSS target via entries in the nu_header.html
```
<link rel="stylesheet" href="http://<IP_OF_LOCALHOST>/css/legacy.css"/>
<link rel="stylesheet" href="http://IP_OF_LOCALHOST/css/style.css"/>
```
-- using this method will load your CSS off your LOCALHOST. As long as you have port80 open and the grunt task is running...
  

---------

## How to Contribute

Please see the [Contribute.md](./CONTRIBUTING.md) document on how to contribute.
