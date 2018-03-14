import controller from 'server/controllers/status'

export default router => router.get('/status', controller.status)
