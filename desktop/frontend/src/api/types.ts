
  /**
   * Auto-generated File - BSD
   */
  
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

export type HealthStatusRequest = {
  health: number;
}

export type HealthStatusResponse = {
  status: string;
}

  export type HealthParams = {
  awesome?: boolean;
}
  