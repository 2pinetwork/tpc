import { Command, Option } from 'commander'
import packageConfig from '../package.json'

const helpText = `
Additinal sub-commands:
  register              Signup and register for API keys
  confirm               Confirm your account using the provided token via email
  api-key               Generate API keys using an existing and confirmed user
  create-random-wallet  Creates locally a new random wallet

Example call:
  $ npx ${packageConfig.name} register`

const command = (): { program: Command, project: string } => {
  let project   = null
  const program = new Command(packageConfig.name)
  const help    = {
    version:     'output the current version',
    development: 'create the project with development endpoint (if in doubt, do not use)',
    mnemonic:    'provide your own mnemonic',
    key:         'provide your API key',
    secret:      'provide your API secret (be carefull, can be seen using shell history)',
    project:     'project name (it will also become the project directory)'
  }

  program
    .version(packageConfig.version, '-v, --version', help.version)
    .option('-d, --development', help.development)
    .addOption(new Option('-m, --mnemonic <words...>', help.mnemonic).env('MNEMONIC'))
    .addOption(new Option('-k, --key <key>', help.key).env('API_KEY'))
    .addOption(new Option('-s, --secret <secret>', help.secret).env('API_SECRET'))
    .addHelpText('after', helpText)
    .argument('<project-name>', help.project)
    .action(projectName => project = projectName)
    .parse()

  return { program, project: String(project) }
}

export default command
