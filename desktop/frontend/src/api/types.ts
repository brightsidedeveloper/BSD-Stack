
  /**
   * Auto-generated File - BSD
   */
  
  export type V1UserSignUpRequest = {
  email: string;
  password: string;
}

export type V1MeResponse = {
  id: string;
  email: string;
  createdAt: string;
}

export type V1UsersResponse = {
  users?: Array<{
  id: string;
  email: string;
  createdAt: string;
}>;
}

export type V1UserLoginRequest = {
  email: string;
  password: string;
}

export type V1UserAuthResponse = {
  token?: string;
}

export type V1HealthStatusRequest = {
  health: number;
}

export type V1HealthStatusResponse = {
  status: string;
}

  export type V1HealthParams = {
  awesome?: boolean;
}
  