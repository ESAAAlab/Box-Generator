module.exports = {

  options: {
    livereload: true
  },

  scripts: {
    files: [
      'src/scripts/*.js'
    ],
    tasks: [
      'jshint',
      'copy',
      'inject'
    ]
  },

  styles: {
    files: [
      'src/styles/*.scss'
    ],
    tasks: [
      'sass:dev'
    ]
  },

  html: {
    files: [
      'src/**/*.html'
    ],
    tasks: [
      'copy',
      'inject'
    ]
  },

  other: {
    files: [
      '*.png',
      '*.xml',
      '*.ico',
      '*.txt'
    ],
    tasks: [
      'copy'
    ]
  }
};