// Auto-generated File - BSD

package api

type V1UsersResponseUsers struct {
	Id        string `json:"id"`
	Email     string `json:"email"`
	CreatedAt string `json:"createdAt"`
}

type V1UsersResponse struct {
	Users []V1UsersResponseUsers `json:"users"`
}

type V1HealthStatusRequest struct {
	Health int `json:"health"`
}

type V1HealthStatusResponse struct {
	Status string `json:"status"`
}
