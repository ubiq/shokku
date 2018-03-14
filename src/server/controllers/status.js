import StatusService from 'server/services/status'
import l from 'helpers/logger'

export class Controller {
  async status(req, res) {
    l.info('StatusController - status() / Sending status')
    const resp = await StatusService.status()
    return res.json(resp)
  }
}

export default new Controller()
