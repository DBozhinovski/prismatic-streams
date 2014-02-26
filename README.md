## Prismatic
#### *A node js wrapper for ffmpeg*

### Features
- Stream based - exposes a readable stream from ffmpeg
- Exposes a transform stream which is able to convert raw ffmpeg output to JSON

### Getting started
Prismatic can be used:

1. As a command line utility (for testing purposes only): Clone the repository, install packages via NPM and use the prismatic executable located in /bin
2. As a library: Clone the repository, install packages via NPM and build the package via `npm build`. Install the produced .tgz via `npm install {path}` anywhere needed. Installing via npm coming soon. 

Usage [examples](examples)

### Requirements
* A recent version of ffmpeg
* Node.js, NPM
* CoffeeScript (if you need to edit the source)
* Lodash and Commander (installable through NPM)
