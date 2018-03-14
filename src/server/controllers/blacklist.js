import BlacklistService from 'server/services/blacklist'

export class Controller {
  async all(req, res) {
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
