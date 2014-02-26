{exec, spawn} = require "child_process"
fs = require "fs"

task 'watch', 'live build', ->
  builder = spawn "coffee", ["-w", "-c", "--output", "dist/", "src/"]

  builder.stdout.on "data", (out) ->
    exec "notify-send '#{out.toString().trim()}'"
