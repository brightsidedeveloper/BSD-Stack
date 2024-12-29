
/**
 * Auto-generated File - BSD
 */

import { UseQueryOptions, queryOptions } from '@tanstack/react-query';
import ez from './ez';
import { V1HealthParams } from './types';


export function createV1UsersQuery<TData = Awaited<ReturnType<typeof ez.get.v1Users>>, TError = Error>(opts: Omit<UseQueryOptions<Awaited<ReturnType<typeof ez.get.v1Users>>, TError, TData, V1UsersQueryKey>, 'queryKey' | 'queryFn'> = {}) {
  return queryOptions({
    ...opts,
    queryKey: getV1UsersQueryKey(),
    queryFn() {
      return ez.get.v1Users();
    },
  });
}
export function getV1UsersQueryKey() {
  return ['users'] as const;
}
export type V1UsersQueryKey = ReturnType<typeof getV1UsersQueryKey>;



export function createV1HealthQuery<TData = Awaited<ReturnType<typeof ez.get.v1Health>>, TError = Error>(params: V1HealthParams, opts: Omit<UseQueryOptions<Awaited<ReturnType<typeof ez.get.v1Health>>, TError, TData, V1HealthQueryKey>, 'queryKey' | 'queryFn'> = {}) {
  return queryOptions({
    ...opts,
    queryKey: getV1HealthQueryKey(params),
    queryFn() {
      return ez.get.v1Health(params);
    },
  });
}
export function getV1HealthQueryKey(params: V1HealthParams) {
  return ['health', params] as const;
}
export type V1HealthQueryKey = ReturnType<typeof getV1HealthQueryKey>;

