const {GraphQLError } = require("graphql");
const jwt = require('jsonwebtoken');

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

// function Auth(req, res, next) {
//     const authorization = req.headers.authorization;
//     if (!authorization) {
//         return res.status(401).json({
//             message: 'No Authorization Header'
//         })
//     }
//     try {
//         const token = authorization.split('Bearer ')[1];
//         if (!token) {
//             return res.status(401).json({
//                 message: 'Invalid Token Format'
//             })
//         }
//         const decode = jwt.verify(token, process.env.JWT_KEY);
//         req.user = decode
//         next()
//     } catch (error) {
//         if (error instanceof jwt.TokenExpiredError) {
//             return res.status(401).json({
//                 message: 'Session Expired',
//                 error: error.message,
//             })
//         }
//         if (error instanceof jwt.JsonWebTokenError || error instanceof TokenError) {
//             return res.status(401).json({
//                 message: 'Invalid Token',
//                 error: error.message,
//             })
//         }
//         res.status(500).json({
//             message: 'Internal server Error',
//             error: error.message,
//             stack: error.stack
//         });
//     }
// }

module.exports = {auth, closeSession, loginAuth, createLoginAuth, createPassResetAuth};