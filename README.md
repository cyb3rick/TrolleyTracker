# TrolleyTracker

TrolleyTracker provides near realtime location updates for buses of UPRM. This project contains the server application that handles updates from tracking units installed in buseeb application to display updates through a google maps interface. ETAs are also provided to user-specified routes and bus stops.

## Prerequisites
Mongodb Server
Node.js
nmp

## Getting Started
```
// Clone repo
$ git clone https://github.com/cyb3rick/TrolleyTracker.git
// Go to project folder
$ cd TrolleyTracker
// Install dependencies with npm
$ npm install
```
## Running
```
// Star mongodb server
mongod --dbpath /your/dbpath/here
// Start node server
node server.js
// Visit localhost:8080/ and localhost:8080/sim
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2014 Erick Caraballo  
Licensed under the MIT license.
