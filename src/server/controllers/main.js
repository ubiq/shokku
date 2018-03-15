export class Controller {
  async main(req, res) {
    return res.status(204).send()
  }
}

export default new Controller()
