import { generateFilterListFile } from './generateFilterListFile.js'
import { generateManifestFiles } from './generateManifestFile.js'
import { generateCrxWithArgs } from './generateCrx.js'

export async function generateHerondListComponent(options = {}) {
  try {
    if (!options.executable_herond) {
      throw new Error("Missing the executable file of Herond Browser")
    }

    if (!options.private_key) {
      throw new Error("Missing the private key to sign extension")
    }

    if (!options.publisher_key) {
      throw new Error("Missing the publisher key to sign extension")
    }

    const extension_dir = await generateFilterListFile()
    await generateManifestFiles()
    await generateCrxWithArgs(options.executable_herond, extension_dir, options.private_key, options.publisher_key)

  } catch (e) {
    console.error(`Error: ${e}`)
    process.exit(1)
  }
}
