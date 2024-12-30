// Auto-generated File - BSD

package api

type UsersResponseUsers struct {
  Id string `json:"id"`
  Email string `json:"email"`
  CreatedAt string `json:"createdAt"`
}

type TestResponse struct {
  Message string `json:"message"`
}

type UserSignUpRequest struct {
  Email string `json:"email"`
  Password string `json:"password"`
}

type MeResponse struct {
  Id string `json:"id"`
  Email string `json:"email"`
  CreatedAt string `json:"createdAt"`
}

type UsersResponse struct {
  Users []UsersResponseUsers `json:"users"`
}

type UserLoginRequest struct {
  Email string `json:"email"`
  Password string `json:"password"`
}

type UserAuthResponse struct {
  Token string `json:"token"`
}