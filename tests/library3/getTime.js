#!/usr/bin/env node

const { CommandFunction } = require('../../dist/command-functions')

function getTime() {
  return new Date()
}

const command = new CommandFunction(getTime)

module.exports = command.autoRun()
