
class Util
{
  static random(n) {
    return Math.floor(Math.random() * n);
  }

  static randomItem(list) {
    return list[Util.random(list.length)];
  }

  static isVisibleElement (element) {
    let rootElement = window.document.body || window.document.documentElement;
    var currentElement = element;
    while (currentElement) {
      let style = currentElement.style;
      if ((style.display === 'none') || (style.visibility === 'hidden')) return false;
      if (currentElement == rootElement) break;
      currentElement = currentElement.parentElement;
    }
    return (currentElement == rootElement);
  }

  static updateElementAttributes (element, attributes) {
    if (!element) return;
    for (var attributeName in attributes) {
      let value = attributes[attributeName];
      if (value == null) { // null or undefined
        element.removeAttribute(attributeName);
      }
      else {
        element.setAttribute(attributeName, value);
      }
    }
  }

  static updateElementStyles (element, styles) {
    if (!element) return;
    for (var styleKey in styles) {
      element.style[styleKey] = styles[styleKey];
    }
  }

  static createElement (tagName, attributes = null, styles = null) {
    let element = window.document.createElement(tagName);
    if (attributes) {
      Util.updateElementAttributes(element, attributes);
    }
    if (styles) {
      Util.updateElementStyles(element, styles);
    }

    return element;
  }
}

module.exports = Util;
