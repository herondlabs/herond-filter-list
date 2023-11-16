import program from '../node_modules/commander/index.js'
import { generateCrx } from './generateCrx.js'
import { generateHerondListComponent } from './generateHerondListComponent.js'
import { generateFilterListFile } from './generateFilterListFile.js'
import { generateManifestFiles } from './generateManifestFile.js'

program
  .command('generateFilterList')
  .action(generateFilterListFile)

program
  .command('generateManifest')
  .action(generateManifestFiles)

program
  .command('generateCrx')
  .option('-e, --executable_herond <executable-herond>', 'executable file of Herond Browser')
  .option('-d, --extension_dir <extension-dir>', 'directory includes extension')
  .option('-k, --private_key <private-key>', 'the associated private key of extension')
  .option('-p, --publisher_key <publisher-key>', 'the private key of Herond to sign for all extensions')
  .action(generateCrx)

program
  .command('generateHerondListComponent')
  .option('-e, --executable_herond <executable-herond>', 'executable file of Herond Browser')
  .option('-k, --private_key <private-key>', 'the associated private key of extension')
  .option('-p, --publisher_key <publisher-key>', 'the private key of Herond to sign for all extensions')
  .action(generateHerondListComponent)

program
  .parse(process.argv)
