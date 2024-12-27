import { HealthResponse } from '../types/request'
import { get, post } from '../utils/request'

class Get {
  static async healthCheck() {
    return get<HealthResponse>('/api/v1/health')
  }

  static async getUser(id: string) {
    return get(`/api/v1/users/${id}`)
  }
}

class Post {
  static async createUser() {
    return post<HealthResponse>('/api/v1/users', {
      body: {
        name: 'John Doe',
        email: '',
      },
    })
  }
}

class Put {
  static async updateUser() {
    return get('/api/v1/users')
  }
}

class Patch {
  static async patchUser() {
    return get('/api/v1/users')
  }
}

class Delete {
  static async deleteUser() {
    return get('/api/v1/users')
  }
}

export default class Bright {
  static get = Get
  static post = Post
  static put = Put
  static patch = Patch
  static delete = Delete
}
