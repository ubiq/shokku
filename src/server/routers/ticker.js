import controller from '@/server/controllers/ticker'

export default router => router
  .get('/ticker/symbols', controller.symbols)
  .get('/ticker/{symbol}', controller.symbol)
