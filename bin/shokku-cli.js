#!/usr/bin/env node

const program = require('commander');
const fs = require('fs')
const $ = require('shelljs')
const h = require('handlebars')
const Ora = require('ora')
const _ = require('lodash')

const package = require('../package.json')
const config = require('../shokku.config.json')

const ora = new Ora({
  spinner: 'toggle6'
})

program
  .description('Shokku utility cli for building and uploading docker images')
  .version(package.version, '-v, --version')

program
  .command('generate')
  .alias('g')
  .action(function () {
    ora.text = 'Reading templates from docker/templates dir...'
    ora.start()

    const dockerTemplatesDir = `${__dirname}/../docker/templates/`
    const dockerTemplatesFiles = fs.readdirSync(dockerTemplatesDir)
    const dockerTemplates = dockerTemplatesFiles.map(f => {
      return {
        file: f,
        baseDir: dockerTemplatesDir,
        out: `${__dirname}/../out/docker`
      }
    })

    ora.text = 'Reading templates from ks8/templates dir...'
    ora.info()

    const k8sTemplatesDir = `${__dirname}/../k8s/templates/`
    const k8sTemplatesFiles = fs.readdirSync(k8sTemplatesDir)
    const k8sTemplates = dockerTemplatesFiles.map(f => {
      return {
        file: f,
        baseDir: k8sTemplatesDir,
        out: `${__dirname}/../out/k8s`
      }
    })

    ora.text = 'Processing templates...'
    ora.info()

    const templates = dockerTemplates.concat(k8sTemplates)

    templates.forEach(t => {
      ora.text = `Processing template file: ${t.file}`

      const t = fs.readFileSync(t.baseDir + t.file, 'utf-8')

      ora.text = `Rendering template ${f}`
      const template = h.compile(t)
      const result = template(config)
      ora.text = 'Template rendered'

      $.mkdir('-p', t.out);

      const name = f.replace('.tpl', '')
      fs.writeFileSync(`${t.out}/${name}`, result, {
        encoding: 'utf-8'
      })

      ora.text = `Processed template ${name} sucessfully and saved in ${t.out} folder`
      ora.info()
    })
  })

program
  .command('build [registry]')
  .alias('b')
  .action(function (registry, options) {
    const reg = registry === 'local' ? config.docker.registry.local : config.docker.registry.remote

    ora.text = `Current registry selected ${reg}`
    ora.start()

    if (!$.which('docker')) {
      ora.text = 'Sorry, in order to work properly, this script needs docker to be installed'
      ora.fail()
      process.exit(1)
    }

    config.docker.images.forEach(image => {
      const dev = image.dev
      const name = image.name
      const version = image.version
      const folder = image.folder
      const build = image.build
      const dockerfile = image.dockerfile

      if (registry !== config.docker.registry.local && dev) {
        ora.text = `Skipping dev image ${name} for registry remote`
        ora.warn()
        return
      }

      ora.text = `Building docker image ${name}`
      ora.info()

      const c = `docker build -f docker/images/${folder}/${dockerfile} -t ${registry}/${name}:${version} ${build}`
      const result = $.exec(c).code !== 0
      if (result) {
        process.exit(1)
      }
    })
  })

program
  .command('upload')
  .alias('u')
  .action(function () {
    const registry = config.docker.registry.remote

    if (!$.which('docker')) {
      ora.text = 'Sorry, in order to work properly, this script needs docker to be installed'
      ora.fail()
      process.exit(1)
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
