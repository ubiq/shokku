import AppController from '@/app.controller'
import { routes } from '@/app.routes'
import BlacklistModule from '@/server/blacklist/blacklist.module'
import JsonRpcModule from '@/server/jsonrpc/jsonrpc.module'
import StatusModule from '@/server/status/status.module'
import TickerModule from '@/server/ticker/ticker.module'
import { MorganMiddleware } from '@nest-middlewares/morgan'
import { MiddlewaresConsumer, Module, RequestMethod } from '@nestjs/common'
import { RouterModule } from 'nest-router'
// import { graphqlExpress } from 'apollo-server-express'
// import { GraphQLModule, GraphQLFactory } from '@nestjs/graphql'

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    BlacklistModule,
    JsonRpcModule,
    StatusModule,
    TickerModule,
    // GraphQLModule
  ],
  controllers: [
    AppController,
  ],
  components: [],
})
export class ApplicationModule {
  // constructor(private readonly graphQLFactory: GraphQLFactory) {}

  configure(consumer: MiddlewaresConsumer): void {
    // GraphQL
    // const typeDefs = this.graphQLFactory.mergeTypesByPaths('./**/*.graphql')
    // const schema = this.graphQLFactory.createSchema({ typeDefs })

    // const qraphql = graphqlExpress(req => ({ schema, rootValue: req }))
    // consumer
    //   .apply(qraphql)
    //   .forRoutes({ path: '/graphql', method: RequestMethod.ALL })

    // Logging
    MorganMiddleware.configure('tiny')
    consumer.apply(MorganMiddleware).forRoutes({
      path: '*', method: RequestMethod.ALL
    })

  }
}
