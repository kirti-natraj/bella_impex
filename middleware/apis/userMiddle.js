const userModel= require('../../models/users');

module.exports = {
    userEmailAuthSpecificAdmin: async function(req, res, next) {
        let user_name = req.body.email;

        try {
            const user = await userModel.find({'user_name': user_name}).exec();
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
  
}