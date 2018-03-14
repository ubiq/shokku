import controller from 'server/controllers/blacklist'

export default router => router.get('/blacklist', controller.all)
