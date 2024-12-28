
/**
 * Auto-generated File - BSD
 */

import { queryOptions } from '@tanstack/react-query';
import ez from './ez';
import { v1HealthParams, v1UserSignUpRequest, v1UserSignUpResponse, v1UsersResponse, v1UserLoginRequest, v1UserLoginResponse, v1HealthStatusRequest, v1HealthStatusResponse } from './types';


export function createV1UsersQuery() {
  return queryOptions({
    queryKey: ['users'],
    queryFn() {
      return ez.get.v1Users();
    },
  });
}


export function createV1HealthQuery(params: v1HealthParams) {
  return queryOptions({
    queryKey: ['health', params],
    queryFn() {
      return ez.get.v1Health(params);
    },
  });
}
