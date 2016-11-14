module.exports = {
  files: {
    cwd: 'src/',  // set working folder / root to copy
    src: ['**/*.html','images/*.*','*.png','*.xml','*.ico','*.txt','scripts/**/*.js','styles/**/*.css'],      // copy all files and subfolders **with ending .html**
    dest: 'dist/',    // destination folder
    expand: true           // required when using cwd
  }
}