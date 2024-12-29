
  /**
   * Auto-generated File - BSD
   */

  import { post, get } from './request';
  import { V1UserSignUpRequest, V1UsersResponse, V1UserLoginRequest, V1UserAuthResponse, V1HealthStatusRequest, V1HealthStatusResponse, V1HealthParams } from './types';

  
  class Get {
    
        /**
         * Get a list of users
         * @returns {Promise<V1UsersResponse>}
         */
        static async v1Users() {
          return get<V1UsersResponse>(`/api/v1/users`);
        }
      
  
        /**
         * Check the health of the API
         * @returns {Promise<V1HealthStatusResponse>}
         */
        static async v1Health(params: V1HealthParams) {
          return get<V1HealthStatusResponse>(`/api/v1/health`, params);
        }
      
  }
  

  class Post {
    
        /**
         * Create a new user
         * @returns {Promise<V1UserAuthResponse>}
         */
        static async v1Signup(params: V1UserSignUpRequest) {
          return post<V1UserAuthResponse>(`/api/v1/auth/signup`, params);
        }
      
  
        /**
         * Login a user
         * @returns {Promise<V1UserAuthResponse>}
         */
        static async v1Login(params: V1UserLoginRequest) {
          return post<V1UserAuthResponse>(`/api/v1/auth/login`, params);
        }
      
  
        /**
         * Logout a user
         * @returns {Promise<V1UserAuthResponse>}
         */
        static async v1Logout() {
          return post<V1UserAuthResponse>(`/api/v1/auth/logout`);
        }
      
  
        /**
         * Submit health data
         * @returns {Promise<V1HealthStatusResponse>}
         */
        static async v1Health(params: V1HealthStatusRequest) {
          return post<V1HealthStatusResponse>(`/api/v1/health`, params);
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
  