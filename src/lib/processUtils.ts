import * as fs from'fs'
import Log from './logging.ts'
import { spawnSync, SpawnSyncOptions } from 'child_process'

let npmCommand = 'npm'
if (process.platform === 'win32') {
  npmCommand += '.cmd'
}

interface RunOptions extends SpawnSyncOptions {
  continueOnFail?: boolean
}

const run = (cmd: string, args: ReadonlyArray<string> = [], options?: RunOptions) => {
  options = { cwd: './', continueOnFail: false, stdio: 'inherit', ...options }
  Log.command(options.cwd, cmd, args)
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

const runGit = (repoPath: string, gitArgs: ReadonlyArray<string>, options?: RunOptions) => {
  let prog = run('git', gitArgs, { cwd: repoPath, ...options })

  if (prog.status !== 0) {
    return null
  } else {
    return prog.stdout?.toString().trim()
  }
}

const runNpm = (repoPath: string, gitArgs: ReadonlyArray<string>, options?: RunOptions) =>  {
  let prog = run(npmCommand, gitArgs, { cwd: repoPath, ...options })

  if (prog.status !== 0) {
    return null
  } else {
    return prog.stdout?.toString().trim()
  }
}

const getNPMConfig = (pathToPackageJson: string, path: ReadonlyArray<string>) => {
  let packages = {}
  if (fs.existsSync(pathToPackageJson + '/package.json')) {
    packages = require(pathToPackageJson + '/package.json')
  }

  let obj: {[key: string]: any} = packages
  for (var i = 0, len = path.length; i < len; i++) {
    if (!obj) {
      return obj
    }
    obj = obj[path[i]]
  }
  return obj
}

export default {
  run,
  runGit,
  runNpm,
  getNPMConfig
}