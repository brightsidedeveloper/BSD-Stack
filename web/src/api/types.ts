
  /**
   * Auto-generated File - BSD
   */
  
  export type v1UserSignUpRequest = {
  email: string;
  password: string;
}

export type v1UserSignUpResponse = {
  id?: string;
}

export type v1UsersResponse = {
  users?: Array<{
  id: string;
  email: string;
  createdAt: string;
}>;
}

export type v1UserLoginRequest = {
  email: string;
  password: string;
}

export type v1UserLoginResponse = {
  id?: string;
}

export type v1HealthStatusRequest = {
  health: number;
}

export type v1HealthStatusResponse = {
  status: string;
}

  export type v1HealthParams = {
  awesome?: boolean;
}
  