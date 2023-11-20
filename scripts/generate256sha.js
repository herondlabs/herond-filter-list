import fs from 'fs-extra'
import crypto from 'crypto'

export function generateHash(options = {}) {
  if (!options.file) {
    console.error("Miss file path")
    process.exit(1)
  }
  generate256sha(options.file)
}

export function generate256sha(file_path) {
  if (!fs.existsSync(file_path)) {
    console.error("File is non-exsting")
    process.exit(1)
  }
  const content = fs.readFileSync(file_path)
  const hash = crypto.createHash("sha256").update(content).digest("hex")
  return hash
}
