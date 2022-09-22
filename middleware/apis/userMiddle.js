const userModel= require('../../models/users');
const instModel= require('../../models/instructor')

module.exports = {
    userEmailAuthSpecificAdmin: async function(req, res, next) {
        let email = req.body.email;

        try {
            const user = await userModel.find({'email': email}).exec();
            console.log('user', user);
            if (user.length === 0) {
                next();
            } else {
                return res.json({response: false, errors: 'E-mail already in use'});
            }
        } catch (err) {
            return res.json({response: false, errors: 'something went wrong'});
        }
    },
    instructorEmailAuthSpecificAdmin: async function(req, res, next){
        let email=req.body.email;

        try{
            const user = await instModel.find({'email':email}).exec();
            console.log('user', user);
            if(user.length === 0){
                next();
            }else{
                return res.json({ response:false,errors: 'E-mail already in use' });
            }
        }catch(err){
            return res.json({ response:false,errors: 'something went wrong' });
        }
    }
}