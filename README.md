# BridgeAthletic grunt-ng-annotate
> Add, remove and rebuild AngularJS dependency injection annotations. Based on [ng-annotate](https://www.npmjs.org/package/ng-annotate).

[![Build Status](https://travis-ci.org/mzgol/grunt-ng-annotate.svg?branch=master)](https://travis-ci.org/mzgol/grunt-ng-annotate)
[![Build status](https://ci.appveyor.com/api/projects/status/rr3i854ic8rb47i5/branch/master)](https://ci.appveyor.com/project/mzgol/grunt-ng-annotate)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ng-annotate --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ng-annotate');
```

## The "ngAnnotate" task

### Overview
In your project's Gruntfile, add a section named `ngAnnotate` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    ngAnnotate: {
        options: {
            // Task-specific options go here.
        },
        your_target: {
            // Target-specific file lists and/or options go here.
        },
    },
})
```

#### Options

The `ngAnnotate` task accepts a couple of options:

```js
{
    // Tells if ngAnnotate should add annotations (true by default).
    add: true|false,

    // Tells if ngAnnotate should remove annotations (false by default).
    remove: true|false,

    // If provided, only strings matched by the regexp are interpreted as module
    // names. You can provide both a regular expression and a string representing
    // one. See README of ng-annotate for further details:
    // https://npmjs.org/package/ng-annotate
    regexp: regexp,

    // If files are provided without a destination, each file is processed
    // separately and each of them is saved under original name with appended
    // suffix provided here.
    outputFileSuffix: string,

    // If files are provided without a destination and this option is set,
    // each file is processed separately and each of them is saved under original
    // name processed by this function.
    transformDest: function (sourcePath) {},

    // Switches the quote type for strings in the annotations array to single
    // ones; e.g. '$scope' instead of "$scope" (false by default).
    singleQuotes: true|false,

    // If ngAnnotate supports a new option that is not directly supported via
    // this grunt task yet, you can pass it here. These options gets merged
    // with the above specific to ngAnnotate. Options passed here have lower
    // precedence to the direct ones described above.
    ngAnnotateOptions: {},
}
```

#### Additional BridgeAthletic Options

```js
{
    ...
    
    // If provided, ngAnnotate recursively finds all files in the given
    // path and injects the dependencies in place, overwriting the files
    // themselves.
    paths : [
        directory/of/files/to/annotate,
        ...
    ],
}
```

Note that both `add` and `remove` options can be set to true; in such a case `ngAnnotate` first removes
annotations and then re-adds them (it can be used to check if annotations were provided correctly).

### Usage Examples

```js
grunt.initConfig({
    ngAnnotate: {
        options: {
            singleQuotes: true,
        },
        all: {
            files: {
                'a.js': ['a.js'],
                'c.js': ['b.js'],
                'f.js': ['d.js', 'e.js'],
            },
        },
    },
});

grunt.loadNpmTasks('grunt-ng-annotate');
```

After executing `grunt ngAnnotate`, you'll get file `a.js` annotated and saved under the same name, file `b.js`
annotated and saved as `c.js` and files `d.js` and `e.js` concatenated, annotated and saved as `f.js`. Annotations
will be saved using single quotes.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed
functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 Michał Gołębiowski. Licensed under the MIT license.
