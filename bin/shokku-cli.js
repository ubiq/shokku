#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk')
const fs = require('fs')
const $ = require('shelljs')
const h = require('handlebars')
const Ora = require('ora')

const package = require('../package.json')
const config = require('../shokku.config.json')

const ora = new Ora({
  spinner: 'toggle6'
})
const log = console.log

program
  .description('Shokku utility cli for generating, building and uploading related docker images')
  .version(package.version, '-v, --version')

program
  .command('generate', 'create shokku docker compose related files')
  .alias('g')
  .action(function () {
    ora.text = 'Reading templates from docker/templates dir...'
    ora.start()

    const templatesDir = `${__dirname}/../docker/templates/`
    const templatesFiles = fs.readdirSync(templatesDir)
    ora.succeed()

    templatesFiles.forEach(f => {
      ora.text = `Processing template file: ${f}`
      ora.succeed()

      const t = fs.readFileSync(templatesDir + f, 'utf-8')

      ora.text = `Rendering template ${f}`
      const template = h.compile(t)
      const result = template(config)
      ora.text = 'Template rendered!'

      $.mkdir('-p', `${__dirname}/../out/docker`);

      const name = f.replace('.tpl', '')
      fs.writeFileSync(`${__dirname}/../out/docker/${name}`, result, {
        encoding: 'utf-8'
      })

      ora.text = `File ${name} saved in out/docker folder!`
    })
  })

program
  .command('build [registry]', 'build docker images')
  .alias('b')
  .action(function (registry, options) {
    const reg = registry === 'local' ? config.docker.registry.local : config.docker.registry.remote

    log(chalk.green(`Current registry selected ${reg}`))

    if (!$.which('docker')) {
      log(chalk.red('Sorry, in order to work properly, this script needs docker to be installed!'))
    }

    config.docker.images.forEach(image => {
      const dev = image.dev
      const name = image.name
      const version = image.version
      const folder = image.folder
      const build = image.build
      const dockerfile = image.dockerfile

      if (registry !== config.docker.registry.local && dev) {
        log(chalk.yellow(`Skipping dev image ${name} for registry remote!`))
        return
      }

      log(chalk.green(`Building docker image ${name}`))

      const c = `docker build -f docker/images/${folder}/${dockerfile} -t ${registry}/${name}:${version} ${build}`
      const result = $.exec(c).code !== 0
      if (result) {
        process.exit(1)
      }
    })
  })

program
  .command('upload', 'upload docker images to registry')
  .alias('u')
  .action(function () {
    const registry = config.docker.registry.remote

    if (!$.which('docker')) {
      log(chalk.red('Sorry, in order to work properly, this script needs docker to be installed!'))
    }

    config.docker.images.forEach(image => {
      const name = image.name
      const version = image.version

      const c = `docker push ${registry}/${name}:${version}`
      const result = $.exec(c).code !== 0
      if (result) {
        process.exit(1)
      }
    })
  })

program.parse(process.argv)
