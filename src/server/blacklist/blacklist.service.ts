import { Component } from '@nestjs/common'
import axios from 'axios'
import l from '@/common/helpers/logger'

const BLACKLIST_RESOURCE_URL = process.env.API_BLACKLIST_RESOURCE_URL || 'https://raw.githubusercontent.com/ubiq/blacklists/master/domains.json'

@Component()
export default class BlacklistService {
  async blacklist() {
    const res = await axios(BLACKLIST_RESOURCE_URL)
    return { blacklist: res.data }
  }
}
