
/**
 * Auto-generated File - BSD
 */

import { UseQueryOptions, queryOptions } from '@tanstack/react-query';
import ez from './ez';
import { HealthParams } from './types';


export function createMeQuery<TData = Awaited<ReturnType<typeof ez.get.me>>, TError = Error>(opts: Omit<UseQueryOptions<Awaited<ReturnType<typeof ez.get.me>>, TError, TData, MeQueryKey>, 'queryKey' | 'queryFn'> = {}) {
  return queryOptions({
    ...opts,
    queryKey: getMeQueryKey(),
    queryFn() {
      return ez.get.me();
    },
  });
}
export function getMeQueryKey() {
  return ['me'] as const;
}
export type MeQueryKey = ReturnType<typeof getMeQueryKey>;



export function createUsersQuery<TData = Awaited<ReturnType<typeof ez.get.users>>, TError = Error>(opts: Omit<UseQueryOptions<Awaited<ReturnType<typeof ez.get.users>>, TError, TData, UsersQueryKey>, 'queryKey' | 'queryFn'> = {}) {
  return queryOptions({
    ...opts,
    queryKey: getUsersQueryKey(),
    queryFn() {
      return ez.get.users();
    },
  });
}
export function getUsersQueryKey() {
  return ['users'] as const;
}
export type UsersQueryKey = ReturnType<typeof getUsersQueryKey>;



export function createHealthQuery<TData = Awaited<ReturnType<typeof ez.get.health>>, TError = Error>(params: HealthParams, opts: Omit<UseQueryOptions<Awaited<ReturnType<typeof ez.get.health>>, TError, TData, HealthQueryKey>, 'queryKey' | 'queryFn'> = {}) {
  return queryOptions({
    ...opts,
    queryKey: getHealthQueryKey(params),
    queryFn() {
      return ez.get.health(params);
    },
  });
}
export function getHealthQueryKey(params: HealthParams) {
  return ['health', params] as const;
}
export type HealthQueryKey = ReturnType<typeof getHealthQueryKey>;

