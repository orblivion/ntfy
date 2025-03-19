package server

import (
	"net/http"
	"strings"
)

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
