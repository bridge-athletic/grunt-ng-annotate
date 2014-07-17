/**
 * grunt-ng-annotate
 * https://github.com/mzgol/grunt-ng-annotate
 *
 * Author Michał Gołębiowski <m.goleb@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    var fs = require('fs'),
        ngAnnotate = require('ng-annotate');

    var async = require('async');
    var findit = require('findit');

    grunt.registerMultiTask('ngAnnotate',
        'Add, remove and rebuild AngularJS dependency injection annotations',

        function () {
            var filesNum = 0,
                validRun = true,
            // Merge task-specific and/or target-specific options with these defaults.
                options = this.options();

            if (!options.ngAnnotateOptions) {
                options.ngAnnotateOptions = {};
            }

            if (options.add != null) {
                options.ngAnnotateOptions.add = options.add;
                delete options.add;
            } else {
                options.ngAnnotateOptions.add = true;
            }

            if (options.remove != null) {
                options.ngAnnotateOptions.remove = options.remove;
                delete options.remove;
            } else {
                options.ngAnnotateOptions.remove = false;
            }

            if (options.regexp != null) {
                options.ngAnnotateOptions.regexp = options.regexp;
                delete options.regexp;
            }

            if (options.singleQuotes != null) {
                options.ngAnnotateOptions.single_quotes = options.singleQuotes;
                delete options.singleQuotes;
            }

            //
            // OUR CODE
            //
            var context = this;
            // grunt.log.error(JSON.stringify(this, null, 4));
            // grunt.log.error(JSON.stringify(this.files, null, 4));
                    
            async.series([
                // Find all files to be annotated and push to this.files
                function(callback) {
                    async.eachSeries(context.data.paths, function(path, onEach) {
                        var src = path.src;
                        var dest = path.dest;

                        // grunt.log.error(src + ' --> ' + dest);

                        var finder = findit(src);
                        finder.on('file', function(file, stat) {
                            // grunt.log.error('+++ File: ' + file);

                            // Append '/' to src and dest
                            src = (src.slice(-1) === '/') ? src : src + '/';
                            dest = (dest.slice(-1) === '/') ? dest : dest +  '/';

                            // Retrieve file name from path
                            file = file.split(src)[1];

                            // Create file object
                            var fileObject = {
                                src : [src + file],
                                dest : dest + file,
                                orig : {
                                    src : [src + file],
                                    dest : dest + file
                                }
                            };

                            // Append file object to this.files
                            context.files.push(fileObject);
                        });

                        finder.on('end', function() {
                            // Call callback
                            onEach(null, null);
                        });
                    }, function(err) {
                        if (err) {
                            // grunt.log.error(err);
                            callback(err);
                        } else {
                            // grunt.log.error('Finished pushing all files to this.files');
                            callback(null, null);
                        }
                    });
                }, 
                // Process each file to be annotate
                function(callback) {
                    // grunt.log.error('Starting to annotate...');

                    // Iterate over all specified file groups.
                    async.eachSeries(context.files, function(mapping, onEach) {
                        var tmpFilePath = mapping.dest; // use the destination file as a temporary source one

                        if (mapping.dest) {
                            // If destination file provided, concatenate all source files to a temporary one.
                            // In such a case options transformDest & outputFileSuffix are ignored.

                            grunt.file.write(
                                tmpFilePath,
                                mapping.src.map(function (file) {
                                    return grunt.file.read(file);
                                }).join('\n')
                            );

                            if (!runNgAnnotate(tmpFilePath, tmpFilePath, options.ngAnnotateOptions)) {
                                validRun = false;
                                onEach('Error in annotating file');
                            } else {
                                onEach(null, null);
                            }
                        } else {
                            // Otherwise each file will have its own ngAnnotate output.

                            // Transform the destination path.
                            if (!options.transformDest) {
                                // By default, append options.outputFileSuffix to the file name.
                                options.transformDest = function transformDest(path) {
                                    return path + (options.outputFileSuffix || '');
                                };
                            }

                            mapping.src.map(function (path) {
                                if (!runNgAnnotate(path, options.transformDest(path), options.ngAnnotateOptions)) {
                                    validRun = false;
                                    onEach('Error in annotating file');
                                } else {
                                    onEach(null, null);
                                }
                            });
                        }
                    }, function(err) {
                        if (err) {
                            // grunt.log.error(err);
                            callback(err);
                        } else {
                            // grunt.log.error('Finished annotating all files');
                            callback(null, null);
                        }
                    });
                }
            ], function(err, results) {
                if (err) {
                    grunt.log.error(err);
                } 
                if (validRun) {
                    if (filesNum < 1) {
                        grunt.log.ok('No files provided to the ngAnnotate task.');
                    } else {
                        grunt.log.ok(filesNum + (filesNum === 1 ? ' file' : ' files') + ' successfully generated.');
                    }
                }
                return validRun;
            });
            

            function runNgAnnotate(srcPath, destPath, ngAnnotateOptions) {
                filesNum++;

                var ngAnnotateOutput = ngAnnotate(grunt.file.read(srcPath), ngAnnotateOptions);

                // Write the destination file.
                if (ngAnnotateOutput.errors) {
                    grunt.log.write('Generating "' + destPath + '" from "' + srcPath + '"...');
                    grunt.log.error();
                    ngAnnotateOutput.errors.forEach(function (error) {
                        grunt.log.error(error);
                    });
                    return false;
                }

                // Remove the temporary destination file if existed.
                if (fs.existsSync(destPath)) {
                    fs.unlinkSync(destPath);
                }

                // Write ngAnnotate output to the target file.
                grunt.file.write(destPath, ngAnnotateOutput.src);

                return true;
            }
        });

};
