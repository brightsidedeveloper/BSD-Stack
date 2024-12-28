
  /**
   * Auto-generated File - BSD
   */

  import { get, post, put, patch, del } from './request';
  import { v1UsersResponse, v1HealthStatusRequest, v1HealthStatusResponse, v1HealthParams } from './types';

  
  class Get {
    
        /**
         * Get a list of users
         * @returns {Promise<v1UsersResponse>}
         */
        static async v1Users() {
          return get<v1UsersResponse>(`/api/v1/users`);
        }
      
  
        /**
         * Check the health of the API
         * @returns {Promise<v1HealthStatusResponse>}
         */
        static async v1Health(params: v1HealthParams) {
          return get<v1HealthStatusResponse>(`/api/v1/health`, params);
        }
      
  }
  

  class Post {
    
        /**
         * Submit health data
         * @returns {Promise<v1HealthStatusResponse>}
         */
        static async v1Health(params: v1HealthStatusRequest) {
          return post<v1HealthStatusResponse>(`/api/v1/health`, params);
        }
      
  }
  

  class Put {
    
  }
  

  class Patch {
    
  }
  

  class Delete {
    
  }
  

  export default class ez {
    static get = Get;
    static post = Post;
    static put = Put;
    static patch = Patch;
    static delete = Delete;
  }
  