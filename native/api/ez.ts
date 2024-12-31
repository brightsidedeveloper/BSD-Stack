
  /**
   * Auto-generated File - BSD
   */

  import { post, get } from './request';
  import { UserSignUpRequest, UserLoginRequest, UserAuthResponse, MeResponse, UsersResponse } from './types';

  
  class Get {
    
        /**
         * Get the current user
         */
        static async me() {
          return get<MeResponse>(`/api/v1/me`);
        }
      
  
        /**
         * Get a list of users
         */
        static async users() {
          return get<UsersResponse>(`/api/v1/users`);
        }
      
  }
  

  class Post {
    
        /**
         * Create a new user
         */
        static async signup(params: UserSignUpRequest) {
          return post<UserAuthResponse>(`/api/auth/signup`, params);
        }
      
  
        /**
         * Login a user
         */
        static async login(params: UserLoginRequest) {
          return post<UserAuthResponse>(`/api/auth/login`, params);
        }
      
  
        /**
         * Logout a user
         */
        static async logout() {
          return post<UserAuthResponse>(`/api/auth/logout`);
        }
      
  
        /**
         * Delete a user
         */
        static async deleteAccount() {
          return post<UserAuthResponse>(`/api/auth/deleteAccount`);
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
  