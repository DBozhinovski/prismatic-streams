// Generated by CoffeeScript 1.6.3
(function() {
  var Transform, _;

  _ = require("lodash");

  Transform = require('stream').Transform;

  module.exports.input = function(raw) {
    if (_.isString(raw)) {
      return raw.split(" ").filter(function(n) {
        return n;
      });
    } else if (_.isArray(raw)) {
      return raw.split(" ").filter(function(n) {
        return n;
      });
    }
  };

  module.exports.toJSON = function(options) {
    var format, ts;
    ts = new Transform(options);
    format = function(progress) {
      return {
        "frame": progress.frame || 0,
        "fps": progress.fps || 0,
        "q": progress.q || 0,
        "size": progress.size || 0,
        "time": (function() {
          var time, _ref;
          time = ((_ref = progress.time) != null ? _ref.toString().split(":") : void 0) || "0";
          return parseInt(time[0], 10) * 60 * 60 + parseInt(time[1], 10) * 60 + parseInt(time[2], 10);
        })() || "0",
        "bitrate": progress.bitrate || 0
      };
    };
    ts._transform = function(chunk, encoding, next) {
      var i, line, progress, progressArray;
      line = chunk.toString().trim();
      if (line.substring(0, 5) === 'frame') {
        progressArray = line.split(" ").join("=").replace(/\s+|=+/g, "|").split("|");
        progress = {};
        i = 0;
        while (i < progressArray.length) {
          progress[progressArray[i]] = progressArray[i + 1];
          i += 2;
        }
        ts.push(JSON.stringify(format(progress)));
      } else {
        ts.push(JSON.stringify(format({})));
      }
      return next();
    };
    return ts;
  };

  module.exports.getProgress = function(current, target) {
    if (this.previous && this.previous > parseInt(current || 0, 10) && this.previous <= 100) {
      return this.previous;
    } else {
      this.previous = parseInt(current || 0, 10);
      return ((parseInt(current || 0, 10) / parseInt(target, 10)) * 100).toFixed(1);
    }
  };

  module.exports.percents = function(target) {
    var ts,
      _this = this;
    ts = new Transform;
    ts._transform = function(chunk, encoding, next) {
      var progress;
      progress = _this.getProgress(JSON.parse(chunk.toString()).frame, target);
      if (progress >= 100) {
        ts.push("100% \n\n");
      } else {
        ts.push("" + progress + "% \r");
      }
      return next();
    };
    return ts;
  };

}).call(this);
