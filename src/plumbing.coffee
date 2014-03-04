{ spawn, exec } = require "child_process"
fs = require "fs"
{ Readable } = require "stream"
{ EventEmitter } = require 'events'
Formatter = require './formatter'

class Plumbing extends EventEmitter
  run: (raw) =>
    options = Formatter.input raw # format options

    rs = new Readable
    rs._read = -> # required for some reason, even though no processing happens

    @emit "probing"
    exec "ffmpeg -loglevel error -t 1 #{options.slice(0,-1).join ' '} -f null /dev/null", (error, stdout, stderr) =>
      if error then @emit "error", error.toString().trim()
      else if stderr then @emit "error", error.toString().trim()
      else
        fs.writeFile 'dummy.sh', "ffmpeg #{options.join ' '}", (error) =>
          ff = spawn "sh", ["dummy.sh"]
          @emit "started", ff.pid # return the pid

          # since ffmpeg has the nasty habit of printing to stderr...
          ff.stderr.on "data", (out) => rs.push out

          ff.stdout.on "close", => 
            rs.push null # stream done
            @emit "closed"

    rs

  info: (path, next) =>
    exec "ffprobe -v quiet -print_format json -show_format -show_streams #{path}", (error, stdout, stderr) ->
      if error then @emit "error", error
      else
        next stdout


module.exports = new Plumbing
