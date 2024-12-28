/**
 * Auto-generated File - BSD
 */

import { queryOptions } from '@tanstack/react-query'
import ez from './ez'
import { v1HealthParams } from './types'
import { Alert } from 'react-native'

export function createV1UsersQuery() {
  return queryOptions({
    queryKey: ['users'],
    queryFn() {
      Alert.alert('Querying users')
      return ez.get.v1Users()
    },
  })
}

export function createV1HealthQuery(params: v1HealthParams) {
  return queryOptions({
    queryKey: ['health', params],
    queryFn() {
      return ez.get.v1Health(params)
    },
  })
}
