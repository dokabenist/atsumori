
class Env
{
  static get resourcePath() {
    return chrome.runtime.getURL("./resources/");
  }
}

module.exports = Env;
