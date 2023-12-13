import { Command } from 'commander'
import herondList from './herondList.ts'
import actions from "./actions.ts";

const program = new Command();

program
  .command('generateFilterList')
  .action(herondList.generateFilterListFile)
  .requiredOption('-o, --output_path <output-path>', 'Output directory')

program
  .command('generateManifest')
  .action(herondList.generateManifestFiles)
  .requiredOption('-o, --output_path <output-path>', 'Output directory')
  .requiredOption('-v, --version <target-version>', 'target version to build')

program
  .command('generateCrx')
  .requiredOption('-e, --executable_herond <executable-herond>', 'executable file of Herond Browser')
  .requiredOption('-d, --extension_dir <extension-dir>', 'directory includes extension')
  .requiredOption('-k, --private_key <private-key>', 'the associated private key of extension')
  .requiredOption('-p, --publisher_key <publisher-key>', 'the private key of Herond to sign for all extensions')
  .action(herondList.packExtension)

program
  .command('buildHerondList')
  .requiredOption('-e, --executable_herond <executable-herond>', 'executable file of Herond Browser')
  .requiredOption('-k, --private_key <private-key>', 'the associated private key of extension')
  .requiredOption('-p, --publisher_key <publisher-key>', 'the private key of Herond to sign for all extensions')
  .requiredOption('-v, --version <target-version>', 'target version to build')
  .action(herondList.buildHerondList)

program
  .command('checkVersion')
  .requiredOption('-v, --version <target-version>', 'version to check')
  .option('-t, --type <selected-type>', '', '0')
  .action(actions.checkVersion)

program
    .command('upload')
    .requiredOption('-v, --version <target-version>', 'version to check')
    .action(actions.upload)

program
    .command('updateDb')
    .requiredOption('-v, --version <target-version>', 'version to check')
    .action(actions.updateDb)

program
  .parse(process.argv)
