
import {spawnSync} from "child_process";
import path from 'path'

const herondListComponentId = 'dlibgjfecknlggedcgaabhmefdkfdkgp'
const herondListPublickey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhqhvAl3+uBJ6HJKHxYMxynJiaeWPFJPOZDbe5c3w1A2gegtszpKFL369T+7SM3HPTdvA+P831As3KHGBrYbSpqefLsqTSQyyQlXGfCNVJZHvYYZHxyqDgrGMQ0Pg7HCghvbU2WHij2l31c0Ty9pxXcTjw+IZyWgYOy6KuVr3sPB+HuIoyAAJ1wMRdAcqR1hUKZ0DmluCFhATsN2RUlkmfgqr+y7DHL+W0DLN6w+jxMNVnboPZRVUCx7/q+08c7V1HZpjMspuDslwU87CFkfrG6Q1hJAFj2I6ybc6JtnrcwlDPGaw5R6acqmxDDwpMWNDy7sGsdmdG7axfBbZuY5BowIDAQAB'
const outputPath = `build/${herondListComponentId}`
const s3Bucket = 'herond-ext-updater-prod'
const s3Path = 'release'

const run = (cmd, args = [], options) => {
  options = { cwd: './', continueOnFail: false, stdio: 'inherit', ...options }
  console.log(options.cwd, cmd, args)
  const prog = spawnSync(cmd, args, options)
  if (prog.status !== 0) {
    if (!options.continueOnFail) {
      console.log(prog.stdout && prog.stdout.toString())
      console.error(prog.stderr && prog.stderr.toString())
      process.exit(1)
    }
  }
  return prog
}

const extensionFileName = `extension_${'1.0.1'.replace(/\./g, '_')}.crx`
const s3Key = `${s3Path}/${herondListComponentId}/${extensionFileName}`
const publicURL = `https://${s3Bucket}.s3.amazonaws.com/${s3Key}`
const crxFilePath = path.resolve(outputPath, extensionFileName)

console.log(publicURL, crxFilePath)
//aws dynamodb update-item --table-name=herond-extensions-prod --key='{"ID": {"S": "test123"}}' --update-expression='SET Version = :v,Title = :t' --expression-attribute-values='{":v": {"S": "1.0.2"}, ":t": {"S": "test"}}'
// const key = '{"ID": {"S": "test123"}}'
// const expression = 'SET Version=:v, #u=:u, SHA256=:s'
// const attributeNames = '{"#u": "URL"}'
// const values = '{":v": {"S": "1.0.2"}, ":u": {"S": "https://"}, ":s": {"S": "abc"}}'
// const rs = run('aws', ['dynamodb', 'update-item', '--table-name=herond-extensions-prod', `--key=${key}`, `--update-expression=${expression}`, `--expression-attribute-names=${attributeNames}`, `--expression-attribute-values=${values}`])
// console.log(rs)