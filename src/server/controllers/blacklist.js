import BlacklistService from '@/server/services/blacklist'

import l from '@/helpers/logger'

export class Controller {
  async blacklist(req, res) {
    l.info('BlacklistController - all() / Calling blacklist service')
    try {
      const result = await BlacklistService.blacklist()
      return res.json(result)
    } catch (err) {
      return res.error({
        code: err.status_code || 404,
        message: err.message
      })
    }
  }
}

export default new Controller()
