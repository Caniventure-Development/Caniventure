import { mkdirSync, existsSync, cpSync, statSync } from 'node:fs'
import path from 'node:path'
import colors from 'picocolors'

const base = import.meta.dirname

const cachePath = path.join(base, 'cache')
if (!existsSync(cachePath) || !statSync(cachePath).isDirectory()) {
  mkdirSync(cachePath)
  console.log(colors.green(`Created cache directory at ${cachePath}`))
}

const envExamplePath = path.join(base, '.env.example')
const envPath = path.join(base, '.env')
if (existsSync(envExamplePath) && !existsSync(envPath)) {
  cpSync(envExamplePath, envPath)
  console.log(colors.green(`Copied example environment over to ${envPath}`))
}

console.log(colors.green('Setup complete!'))
