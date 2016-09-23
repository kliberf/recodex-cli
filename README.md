# ReCodEx CLI
Command line interface for ReCodEx submissions running in [Node.js](https://nodejs.org), written in ES6 and compiled using [Babel](https://babeljs.io/).

## Requirements
- [Node.js](https://nodejs.org) v6

## Installation
`npm install -g recodex-cli`

## Usage
- the tool is currently in development and no useful stuff is in fact implemented :-)

## Development
1. clone the repository
2. install dependencies using `npm install` in the root directory of the repository
3. build the source using `npm run build`
4. run the program using `node lib/index.js [args..]`

For faster development use the watch mode of build `npm run build:watch`.

## Testing
Unit tests are using [Mocha](https://mochajs.org) and [Chai](http://chaijs.com) and are locaded in the `/tests` directory.

### Running tests
- linting: `npm run lint`
- unit tests: `npm run test`


