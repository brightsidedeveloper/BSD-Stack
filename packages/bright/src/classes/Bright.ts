import { HealthResponse } from '../types/request'
import { get } from '../utils/request'

class Get {
  static async healthCheck(): Promise<HealthResponse> {
    return get('/api/v1/health')
  }

  static async getUser(id: string) {
    return get(`/api/v1/users/${id}`)
  }
}

export default class Bright {
  static get = Get
}
