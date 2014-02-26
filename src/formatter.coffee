_ = require "lodash"
{ Transform } = require 'stream' 

module.exports.input = (raw) ->
  if _.isString(raw) then return raw.split(" ").filter((n) -> n)
  else if _.isArray(raw) then return raw.split(" ").filter((n) -> n)

module.exports.toJSON = (options) ->
  ts = new Transform options

  format = (progress) ->
    {
      "frame": progress.frame or 0
      "fps": progress.fps or 0
      "q": progress.q or 0
      "size": progress.size or 0
      "time": ( -> 
        time = progress.time?.toString().split(":") or "00:00:00"
        parseInt(time[0],10) * 60 * 60 + parseInt(time[1], 10) * 60 + parseInt(time[2], 10)
      )() or "00:00:00"
      "bitrate": progress.bitrate or 0
    }

  ts._transform = (chunk, encoding, next) ->
    line = chunk.toString().trim()

    if line.substring(0,5) is 'frame'
      progressArray = line.split(" ").join("=").replace(/\s+|=+/g, "|").split("|")
      progress = {}
      i = 0
      while i < progressArray.length
        progress[progressArray[i]] = progressArray[i+1]
        i+=2

      ts.push JSON.stringify(format(progress))
    else
      ts.push JSON.stringify format({})

    next()

  ts

module.exports.getProgress = (current, target) ->
  if @previous and @previous > parseInt(current or 0, 10)
    return @previous
  else
    @previous = parseInt(current or 0, 10)
    ((parseInt(current or 0,10) / parseInt(target, 10)) * 100).toFixed(1)

module.exports.percents = (target) ->
  ts = new Transform

  ts._transform = (chunk, encoding, next) =>
    progress = @getProgress(JSON.parse(chunk.toString()).frame, target)
    if progress >= 100
      ts.push "100% \n\n" #ts.push "100% \n\n"
    else 
      ts.push "#{progress}% \r"
    next()

  ts