const jwt = require('jsonwebtoken');
const makeApiResponse = require('../lib/response');


const generateAccessToken = async (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
   return token
  };
 
  const verifyAccessToken = async (req, res, next) => {
        try{  
            const token = req.header("Authorization")?.replace("Bearer ", "");
            const isValid = jwt.verify(token, process.env.JWT_SECRET)
            if (!isValid || !token) {
                const unauthorizedResponse = makeApiResponse("Unauthorized Request", 1, 401);
                return res.status(401).json(unauthorizedResponse);
            }
            next();
        } catch(err){
            const errorResponse = makeApiResponse("Invalid Token", 1, 401);
            return res.status(400).json(errorResponse);
        }

     
};
const removeToken = async (req, res, next) => {
    try{
        const token = req.header("Authorization")?.replace("Bearer ", "");
        const isValid = jwt.verify(token, process.env.JWT_SECRET)
        if (!isValid || !token) {
            const unauthorizedResponse = makeApiResponse("Unauthorized Request", 1, 401);
            return res.status(401).json(unauthorizedResponse);
        }
        const deleted = await jwt.destroy(token);
        next();
    } catch(err){
        const errorResponse = makeApiResponse("Invalid Token", 1, 400);
        return res.status(400).json(errorResponse);
    }
}
  module.exports =  { generateAccessToken , verifyAccessToken, removeToken };