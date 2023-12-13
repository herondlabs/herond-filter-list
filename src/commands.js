import program from '../node_modules/commander/index.js'
import {buildHerondList, generateFilterListFile, generateManifestFiles, packExtension} from './herondList.js'

program
  .command('generateFilterList')
  .action(generateFilterListFile)
  .requiredOption('-o, --output_path <output-path>', 'Output directory')

program
  .command('generateManifest')
  .action(generateManifestFiles)
  .requiredOption('-o, --output_path <output-path>', 'Output directory')
  .requiredOption('-v, --version <target-version>', 'target version to build')

program
  .command('generateCrx')
  .requiredOption('-e, --executable_herond <executable-herond>', 'executable file of Herond Browser')
  .requiredOption('-d, --extension_dir <extension-dir>', 'directory includes extension')
  .requiredOption('-k, --private_key <private-key>', 'the associated private key of extension')
  .requiredOption('-p, --publisher_key <publisher-key>', 'the private key of Herond to sign for all extensions')
  .action(packExtension)

program
  .command('buildHerondList')
  .requiredOption('-e, --executable_herond <executable-herond>', 'executable file of Herond Browser')
  .requiredOption('-k, --private_key <private-key>', 'the associated private key of extension')
  .requiredOption('-p, --publisher_key <publisher-key>', 'the private key of Herond to sign for all extensions')
  .requiredOption('-v, --version <target-version>', 'target version to build')
  .action(buildHerondList)

program
  .command('checkVersion')
  .requiredOption('-v, --version <target-version>', 'version to check')
  .action()

program
  .parse(process.argv)
