import axios from 'axios'
import errors from 'common-errors'

import l from '@/helpers/logger'

const BLACKLIST_RESOURCE_URL = process.env.API_BLACKLIST_RESOURCE_URL || 'https://raw.githubusercontent.com/ubiq/blacklists/master/domains.json'

class BlacklistService {
  async blacklist() {
    l.info('BlacklistService - blacklist() / Performing request to fetch blacklists!')
    try {
      const res = await axios(BLACKLIST_RESOURCE_URL)
      return { blacklist: res.data }
    } catch (err) {
      l.error(`BlacklistService - blacklist() / ${err}`)
      throw new errors.HttpStatusError(502, "Can't retrieve blacklist resource from Github. Please, try again later.")
    }
  }
}

export default new BlacklistService()
