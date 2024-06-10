const User = require('../models/user');
const {generateAccessToken, removeToken} = require('../middlewares/auth');
const {encryptPassword, comparePassword, } = require('../lib/encryption');
const makeApiResponse = require('../lib/response');
module.exports = {

    signUp: async function (req, res, next) {

          try{

            
            const password = await encryptPassword(req.body.password);
            const { email, full_name } = req.body;
            const user = new User({
              email,
              full_name,
              password,
              points: 5000
            });
            const newUser = await user.save();
            const successResponse = makeApiResponse("User created successfully", 0, 201, { user: newUser });
            return res.status(201).json(successResponse);


          } catch(err){
            const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
            return res.status(500).json(errorResponse);
          }

        },
    login: async function (req, res, next) {
        try {
          const { email, password } = req.body;
          const user = await User.findOne({ email }).exec();
            if (!user) {
                const errorResponse = makeApiResponse("User not found", 1, 404);
                return res.status(404).json(errorResponse);
                }
             const isMatch = await comparePassword(password, user.password);
            if (!isMatch) {
                const errorResponse = makeApiResponse("Invalid email or password", 1, 401);
                return res.status(401).json(errorResponse);
            }
            const accessToken = await generateAccessToken({user});
            const successResponse = makeApiResponse("Login successful", 0, 200, { user, accessToken });
            return res.status(200).json(successResponse);
        } catch (err) {
            const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
            return res.status(500).json(errorResponse);
        }
    },
    logout : async function (req, res, next) {
        try {
            const desotrySession = await removeToken();
            console.log(desotrySession)
            const successResponse = makeApiResponse("Logout successful", 0, 200);
            return res.status(200).json(successResponse);
        } catch (err) {
            const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
            return res.status(500).json(errorResponse);
        }
    },
    specificUser: async function (req, res, next) {
        try {
            const { id } = req.params;
            const user
                = await User.findById(id).exec();
            if (!user) {
                const errorResponse = makeApiResponse("User not found", 1, 404);
                return res.status(404).json(errorResponse);
            }
            const successResponse = makeApiResponse("User fetched successfully", 0, 200, { user });
            return res.status(200).json(successResponse);
        } catch (err) {
            const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
            return res.status(500).json(errorResponse);
        }
    },
    bet: async (req, res) => {
       try{
        const id = req.params.id;
  
        const { betType, betAmount } = req.body;
        
    
        if (!['7 UP', '7 DOWN', '7'].includes(betType) || ![100, 200, 500].includes(parseInt(betAmount))) {
            return res.status(400).json({ error: 'Invalid bet type or amount' });
        }
    
        const user = await User.findById(id).exec();
        if (!user || user.points < parseInt(betAmount)) {
            return res.status(400).json({ error: 'Insufficient points' });
        }
 
        const diceResult = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
        let winnings = 0;
        let message = '';
        if (betType === '7 UP' && diceResult > 7) {
            winnings = parseInt(betAmount) * 2;
            message = `You won ${parseInt(betAmount) * 2} points ! Dice result was greater than 7`;
        } else if (betType === '7 DOWN' && diceResult < 7) {
            winnings = parseInt(betAmount) * 2;
            message = `You won ${parseInt(betAmount) * 2} points! Dice result was less than 7`;
        } else if (betType === '7' && diceResult === 7) {
            winnings = parseInt(betAmount) * 5;
            message = `You won ${parseInt(betAmount) * 5} points! Dice result was 7`;
        } else {
            winnings = -parseInt(betAmount);
            message = `You lost ${parseInt(betAmount)} points!`;
        }
    
        user.points += winnings;
        await user.save();
        
        const successResponse = makeApiResponse("Bet placed successfully", 0, 200, { message, diceResult, winnings, points: user.points });
        return res.status(200).json(successResponse);
    }
    catch(err){
        const errorResponse = makeApiResponse(err?.message || "Internal Server Error", 1, 500);
        return res.status(500).json(errorResponse);
    }

}
}