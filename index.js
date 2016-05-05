'use strict';

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var path = require('path');

// Need to calculate background-size for larger image.

// background-size: (last_index * 64px) 64px;

// get last index
Handlebars.registerHelper('last_index', function(context, options) {
  return context.length;
});

// register multiplication helper
Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "*": lvalue * rvalue
    }[operator];
});

var getTemplate = function () {
  return fs.readFileAsync(path.join(__dirname, 'template', 'less.hbs'), 'utf8');
};

var transform = Promise.method(function (layouts, source, opt, Handlebars) {
  var template = Handlebars.compile(source);
  return template({
    layouts: layouts,
    opt: opt
  });
});

module.exports = {
  process: function (layouts, opt, Handlebars) {
    return getTemplate()
      .then(function (source) {
        return transform(layouts, source, opt, Handlebars);
      });
  },
  isBeautifyable: function () {
    return true;
  },
  extension: function () {
    return 'less';
  }
};
