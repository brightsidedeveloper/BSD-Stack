/**
 * Auto-generated File - BSD
 */

export type v1UsersResponse = {
  users?: Array<{
    id: string
    email: string
    createdAt: string
  }>
}

export type v1HealthStatusRequest = {
  health: number
}

export type v1HealthStatusResponse = {
  status: string
}

export type v1HealthParams = {
  awesome?: boolean
}
