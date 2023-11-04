const {GraphQLError } = require("graphql");
const jwt = require('jsonwebtoken');
const userModel = require("../models/usersModel");

const auth = async (user, req, next)=> {

    const userToken = req?.headers?.authorization

    if(!userToken){
        throw new GraphQLError('Authentication failed, Authentication Token not Provided')
    }

    try {

    const decode = jwt.verify(userToken, process.env.JWT_KEY)

    if (!decode){
        throw new GraphQLError('Authentication failed, Invalid Authorization Token')
    }

    if(user?.email === decode?.email){
        return decode
    }

    throw new GraphQLError('Authentication failed, Impersonation suspected')
        
    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
        throw new GraphQLError('Invalid Token', error)
    }

    if(error instanceof jwt.TokenExpiredError){
        throw new GraphQLError('Token Expired', error)
    }

        throw new GraphQLError('Internal server error', error)
   
}
    
}

const loginAuth = async (req, next)=> {

    const userToken = req?.headers?.authorization

    if(!userToken){
        throw new GraphQLError('Authentication Token not Provided')
    }

    try {

    const decode = jwt.verify(userToken, process.env.JWT_KEY)

    if (!decode){
        throw new GraphQLError('Authentication failed, Invalid Authorization Token')
    }
        console.log("auth-key", decode);
        return decode
        
    } catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
        throw new GraphQLError('Invalid Token', error)
    }

    if(error instanceof jwt.TokenExpiredError){
        throw new GraphQLError('Token Expired', error)
    }

        throw new GraphQLError('Internal server error', error)
   
}
    
}

const closeSession = async (req, next)=>{

    if(req?.session){
    req?.session?.destroy((err)=> {
        if(err){
              throw new GraphQLError('Unable to destroy session');
            }
      })
    }
    else {
        throw new GraphQLError('No Open session to close');
    }
}

const createPassResetAuth = async (args, next)=>{

    const token = jwt.sign(args, process.env.JWT_KEY, { expiresIn: "10m" })

    if (!token){
        throw new GraphQLError('Failed to create Authentication Token')
    }

    return token
}

const createLoginAuth = async (args, next)=>{

    const token = jwt.sign(args, process.env.JWT_KEY, { expiresIn: "1h" })

    if (!token){
        throw new GraphQLError('Failed to create Authentication Token')
    }

    return token
}

const validateLogin = async (args, next) =>{

        // Checking if user provide the needed info
        if (!args) {
            console.log("Email and Password must be provided to Login");
            throw new GraphQLError("Email and Password must be provided to Login")
          }

      const result = await userModel?.findOne({
        email: args?.email,
        password: args?.password,
      });
  
      if (result?.length < 1 || result == null) {
        console.log(`Admin with ${args.email} and ${args.password} does not exist, Kindly check and try again`);
        throw new GraphQLError(
          `Admin with ${args.email} and ${args.password} does not exist, Kindly check and try again`
        );
      }

      return result;
      
}

module.exports = {auth, closeSession, loginAuth, createLoginAuth, createPassResetAuth, validateLogin};