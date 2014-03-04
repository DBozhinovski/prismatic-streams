// Generated by CoffeeScript 1.6.3
(function() {
  var EventEmitter, Formatter, Plumbing, Readable, exec, fs, spawn, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require("child_process"), spawn = _ref.spawn, exec = _ref.exec;

  fs = require("fs");

  Readable = require("stream").Readable;

  EventEmitter = require('events').EventEmitter;

  Formatter = require('./formatter');

  Plumbing = (function(_super) {
    __extends(Plumbing, _super);

    function Plumbing() {
      this.info = __bind(this.info, this);
      this.run = __bind(this.run, this);
      _ref1 = Plumbing.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Plumbing.prototype.run = function(raw) {
      var options, rs,
        _this = this;
      options = Formatter.input(raw);
      rs = new Readable;
      rs._read = function() {};
      this.emit("probing");
      exec("ffmpeg -loglevel error -t 1 " + (options.slice(0, -1).join(' ')) + " -f null /dev/null", function(error, stdout, stderr) {
        if (error) {
          return _this.emit("error", error.toString().trim());
        } else if (stderr) {
          return _this.emit("error", error.toString().trim());
        } else {
          return fs.writeFile('dummy.sh', "ffmpeg " + (options.join(' ')), function(error) {
            var ff;
            ff = spawn("sh", ["dummy.sh"]);
            _this.emit("started", ff.pid);
            ff.stderr.on("data", function(out) {
              return rs.push(out);
            });
            return ff.stdout.on("close", function() {
              rs.push(null);
              return _this.emit("closed");
            });
          });
        }
      });
      return rs;
    };

    Plumbing.prototype.info = function(path, next) {
      return exec("ffprobe -v quiet -print_format json -show_format -show_streams " + path, function(error, stdout, stderr) {
        if (error) {
          return this.emit("error", error);
        } else {
          return next(stdout);
        }
      });
    };

    return Plumbing;

  })(EventEmitter);

  module.exports = new Plumbing;

}).call(this);
