#!/usr/bin/env node

const { CommandFunction } = require('../../dist/index')

function getTime() {
  return new Date()
}

const command = new CommandFunction(getTime)

module.exports = command.autoRun()
