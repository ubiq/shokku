import controller from 'server/controllers/main'

export default router => router.get('/', controller.main)
