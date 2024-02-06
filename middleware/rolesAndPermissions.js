const { GraphQLError } = require("graphql");
const {Role, Permission} = require("../models/rolesAndPermissions");

const checkPermission = async (permission, userRole, req, next)=>{

        //console.log("req body:", req.body.variables);
        const role = userRole;
        const access = new Permission().getPermissionByRoleName(role);
        // console.log("access", access);
        if (access.includes(permission)){
            //return next();
            return true
        }
        else {
            // return res.status(403).json({ error: 'Access denied' });
            throw new GraphQLError('Access denied, User has no '+ permission +" access")
        }
    }
module.exports = checkPermission;