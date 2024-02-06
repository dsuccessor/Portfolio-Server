const roles_and_permissions = require("../config/rolesAndPermissions.json");



class Role {
    constructor(){
        this.role = roles_and_permissions;
    }
    getRoleByName(name){
        return this.role.roles.find(result => result.name === name)
    }
    getRoles(){
        return this.role.roles
    }
}

class Permission {
    constructor(){
        this.permission = [];
    }
    getPermissionByRoleName(roleName){
        const role = roles_and_permissions.roles.find(output => output.name === roleName);
        return role ? role.permission : [];
    }
    getPermissions(){
        const allPermissions = roles_and_permissions.roles.filter(res => res.name != undefined);
        return allPermissions ? allPermissions : [];
    }
}

module.exports = {Role, Permission};