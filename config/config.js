const config={
    production :{
        SECRET: process.env.SECRET,
        DATABASE: process.env.MONGODB_URI
    },
    default : {
        SECRET: 'mysecretkey',
        DATABASE: 'mongodb+srv://belle_impex:Indore123@cluster0.tsyi5.mongodb.net/belle_impex?retryWrites=true&w=majority'
    }
}


exports.get = function get(env){
    return config[env] || config.default
}