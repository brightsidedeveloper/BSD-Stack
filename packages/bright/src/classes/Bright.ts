import { HealthResponse } from '../types/request'
import { get } from '../utils/request'

class Get {
  static async healthCheck(): Promise<HealthResponse> {
    return get('/api/health')
  }
}

export default class Bright {
  static get = Get
}
