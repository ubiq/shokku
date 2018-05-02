import { ApplicationModule } from '@/app.module'
import { AppExceptionFilter } from '@/core/modules/exception'
import { NetworkChainValidatorPipe } from '@/core/pipes'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as express from 'express'
import { NetworksRepository } from 'networks'
import * as SwaggerUI from 'swagger-ui-express'

async function bootstrap() {
  const server = express()
  const app = await NestFactory.create(ApplicationModule, server, {})

  // Swagger
  const options = new DocumentBuilder()
    .setTitle('Shokku API')
    .setDescription('An open source scalable blockchain infrastructure for Ubiq, Ethereum, POA and IPFS that runs on Kubernetes')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  server.use('/swagger', SwaggerUI.serve, SwaggerUI.setup(document))

  // Global Filters
  app.useGlobalFilters(new AppExceptionFilter())

  // Global Pipes
  const networksRepository = app.get<NetworksRepository>(NetworksRepository)
  app.useGlobalPipes(new NetworkChainValidatorPipe(networksRepository))

  await app.listen(3000)
}

bootstrap()
