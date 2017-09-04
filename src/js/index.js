
(function (win) {
  let Atsumori = require('./atsumori');
  let Env = require('env');

  if (!win.atsumori) {
    win.atsumori = new Atsumori({
      resourcePath: Env.resourcePath
    });
  }
})(window);
