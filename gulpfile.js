const gulp = require('gulp');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const clone = require('clone');
const path = require('path');

// common options
const webpackOption =  {
  entry: {
    js: "./src/js/index.js"
  },
  output: {
    filename: 'atsumori.js'
  },
  resolve: {
    extensions: ['', '.js'],
    alias: {}
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015'],
          plugins: ['transform-class-properties']
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused:false,
        dead_code:false,
        warnings: false
      },
      sourceMap: true,
      mangle: true
    })
  ]
};

// bookmarklet
gulp.task('build-bookmarklet', function() {
  let baseBuildPath = 'build/bookmarklet/';
  let esBuildOption = clone(webpackOption);
  esBuildOption.resolve.alias['env'] = path.resolve('./src/js/env_bookmarklet.js');
  esBuildOption.output.filename = 'bookmarklet.js';

  gulp.src('./src/js/*.js')
    .pipe(webpackStream(esBuildOption, webpack))
    .pipe(gulp.dest(baseBuildPath));
  gulp.src('resources/**').pipe(gulp.dest(`${baseBuildPath}resources/`));
});

// Chrome Extension
gulp.task('build-extension', function () {
  let baseBuildPath = 'build/extension/';
  let esBuildOption = clone(webpackOption);
  esBuildOption.resolve.alias['env'] = path.resolve('./src/js/env_extension.js');
  esBuildOption.output.filename = 'main.js';

  gulp.src('./src/js/*.js')
    .pipe(webpackStream(esBuildOption, webpack))
    .pipe(gulp.dest(baseBuildPath));
  gulp.src('resources/**').pipe(gulp.dest(`${baseBuildPath}resources/`));
  gulp.src('extension/**').pipe(gulp.dest(baseBuildPath));
});

// build all
gulp.task('build', ['build-bookmarklet', 'build-extension'], function() {});
