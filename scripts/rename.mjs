import fs from 'node:fs'
import path from 'node:path'
import cp from 'node:child_process'

let user = 'wopjs'
let name = path.basename(process.cwd()).toLowerCase()

let docsURL = `https://${user.toLowerCase()}.github.io/${name}`
let userLink = `[${user}](https://github.com/${user.toLowerCase()})`

let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
pkg.name = `@${user.toLowerCase()}/${name}`
pkg.description = name
pkg.keywords = name.split('-')
pkg.repository = `${user.toLowerCase()}/${name}`
if (user !== 'wopjs') {
  pkg.maintainers = void 0
}
pkg.scripts.postinstall = void 0

let readme = fs.readFileSync('README.template.md', 'utf8')
readme = readme.replace(/wopjs\/template/g, `${user}/${name}`)
readme = readme.replace('https://wopjs.github.io/template', docsURL)
readme = readme.replace('Collection of common utilities.', `${name}.`)
readme = readme.replace('[wopjs](https://github.com/wopjs)', userLink)

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
fs.writeFileSync('README.md', readme)
fs.rmSync('README.template.md')
fs.rmSync('scripts/rename.mjs')

const win = (bin) => process.platform === 'win32' ? `${bin}.cmd` : bin
cp.spawnSync(win('npm'), ['install'], { stdio: 'inherit' })
