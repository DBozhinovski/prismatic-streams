Plumbing = require "./plumbing"
Formatter = require "./formatter"

class Porcelain
  @run: (options) ->
    Plumbing.instance Formatter.input(options)
    @pid = Plumbing.pid

  @info: (path, next) ->
    Plumbing.meta path, next

module.exports = Porcelain



