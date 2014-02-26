Plumbing = require "./plumbing"
Formatter = require "./formatter"

class Porcelain
  @run: (options) ->
    Plumbing.instance Formatter.input(options)

  @info: (path, next) ->
    Plumbing.meta path, next

module.exports = Porcelain



