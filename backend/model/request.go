package model

type UserRequest struct {
	TokenId uint   `json:"tokenId"`
	Key     string `json:"key"`
}
