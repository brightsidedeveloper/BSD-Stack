
/**
 * Auto-generated File - BSD
 */

import { UseQueryOptions, queryOptions } from '@tanstack/react-query';
import ez from './ez';
import { TestParams } from './types';


export function createTestQuery<TData = Awaited<ReturnType<typeof ez.get.test>>, TError = Error>(params: TestParams, opts: Omit<UseQueryOptions<Awaited<ReturnType<typeof ez.get.test>>, TError, TData, TestQueryKey>, 'queryKey' | 'queryFn'> = {}) {
  return queryOptions({
    ...opts,
    queryKey: getTestQueryKey(params),
    queryFn() {
      return ez.get.test(params);
    },
  });
}
export function getTestQueryKey(params: TestParams) {
  return ['test', params] as const;
}
export type TestQueryKey = ReturnType<typeof getTestQueryKey>;



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

