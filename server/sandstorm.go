package server

import (
	"net/http"
	"strings"
)

// NOTE - Do not trust Sandstorm User ID for security!
//
// Requests from third parties via an API URL will have the grain owner's
// User ID (at least, I think it does? per the Sandstorm docs). That's why we
// rely on permissions, which are attached to the API URL. (If we used forSharing
// I think it would strip the User ID, but then it would put the API tokens in
// the sharing menu instead of the API tokens menu.)
//
// The only reason I can see for looking at Sandstorm User ID is for grain
// sharing, which I see no good reason for as of this writing.

type SandstormPermission string

const HeaderSandstormPermissions = "X-Sandstorm-Permissions"

const SandstormPermissionAdmin = SandstormPermission("admin")
const SandstormPermissionFullApi = SandstormPermission("fullapi")

type SandstormPermissions []SandstormPermission

func (pp SandstormPermissions) Has(hp SandstormPermission) bool {
	for _, p := range pp {
		if hp == p {
			return true
		}
	}
	return false
}

func GetSandstormPermissions(r *http.Request) SandstormPermissions {
	var ps SandstormPermissions
	for _, strPerm := range strings.Split(r.Header.Get(HeaderSandstormPermissions), ",") {
		// Why not just add it. If it's invalid it just won't match anything.
		ps = append(ps, SandstormPermission(strPerm))
	}
	return ps
}
