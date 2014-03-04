{ spawn, exec } = require "child_process"
fs = require "fs"
{ Readable } = require "stream" 

class Plumbing
  @instance: (options) ->
    rs = new Readable
    rs._read = -> # required for some reason, even though no processing happens

    exec "ffmpeg -loglevel error -t 1 #{options.slice(0,-1).join ' '} -f null /dev/null", (error, stdout, stderr) =>
      if error then throw error.toString().trim()
      else if stderr then throw stderr.toString().trim()
      else
        fs.writeFile 'dummy.sh', "ffmpeg #{options.join ' '}", (error) =>
          ff = spawn "sh", ["dummy.sh"]
          @pid = ff.pid

          # since ffmpeg has the nasty habit of printing to stderr...
          ff.stderr.on "data", (out) -> rs.push out

          ff.stdout.on "close", -> 
            rs.push null # stream done

    rs

  @meta: (path, next) ->
    exec "ffprobe -v quiet -print_format json -show_format -show_streams #{path}", (error, stdout, stderr) ->
      if error then throw error
      else
        next stdout


module.exports = Plumbing
