
  /**
   * Auto-generated File - BSD
   */
  
  export type TestRequest = {
  name: string;
}

export type TestResponse = {
  message?: string;
}

export type UserSignUpRequest = {
  email: string;
  password: string;
}

export type MeResponse = {
  id: string;
  email: string;
  createdAt: string;
}

export type UsersResponse = {
  users?: Array<{
  id: string;
  email: string;
  createdAt: string;
}>;
}

export type UserLoginRequest = {
  email: string;
  password: string;
}

export type UserAuthResponse = {
  token?: string;
}

  export type TestParams = {
  name: string;
}
  