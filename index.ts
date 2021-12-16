#!/usr/bin/env node

import command from './src/command'
import processRegistration from './src/commands/registration'
import processCreateRandomWallet from './src/commands/createRandomWallet'
import processCreateApp from './src/commands/createApp'

const { program, project } = command()
const options              = program.opts()

const main = async () => {
  if (project === 'register') {
    await processRegistration(options)
  } else if (project === 'create-random-wallet') {
    processCreateRandomWallet()
  } else {
    await processCreateApp(project, options)
  }
}

main().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)

  process.exit(1)
})
