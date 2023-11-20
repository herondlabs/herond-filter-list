import childProcess from 'child_process'
import fs from 'fs'

import { generate256sha } from './generate256sha.js'

export function generateCrxWithArgs(executable_herond, extension_dir, private_key, publisher_key) {
  try {
    if (!fs.existsSync(executable_herond)) {
      throw new Error("Non-existent the executable file of Herond Browser")
    }

    if (!fs.existsSync(extension_dir)) {
      throw new Error("Non-existent directory includes extension to create CRX file")
    }

    if (!fs.existsSync(private_key)) {
      throw new Error("Non-existent the private key to sign extension")
    }

    if (!fs.existsSync(publisher_key)) {
      throw new Error("Non-existent the publisher key to sign extension")
    }

    const args = [
      `--pack-extension="${extension_dir}"`,
      `--pack-extension-key="${private_key}"`,
      `--brave-extension-publisher-key="${publisher_key}"`]
    childProcess.execSync(`"${executable_herond}" ${args.join(' ')}`)
    const crxOutPath = extension_dir + '.crx'
    const hash = generate256sha(crxOutPath)
    console.log("THE CRX FILE IS CREATED. PATH = %s, hash = %s", crxOutPath, hash)

  } catch (e) {
    console.error(`Error: ${e}`)
    process.exit(1)
  }
}

export function generateCrx(options = {}) {
  try {
    if (!options.executable_herond) {
      throw new Error("Missing the executable file of Herond Browser")
    }

    if (!options.extension_dir) {
      throw new Error("Missing the directory includes extension to create CRX file")
    }

    if (!options.private_key) {
      throw new Error("Missing the private key to sign extension")
    }

    if (!options.publisher_key) {
      throw new Error("Missing the publisher key to sign extension")
    }

    generateCrxWithArgs(options.executable_herond, options.extension_dir, options.private_key, options.publisher_key)

  } catch (e) {
    console.error(`Error: ${e}`)
    process.exit(1)
  }
}
