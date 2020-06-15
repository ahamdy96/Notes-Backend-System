import passport from 'passport'
import passportJWT from 'passport-jwt'

const jwtStrategy = passportJWT.Strategy
const extractJwt = passportJWT.ExtractJwt


const jwtVerifiy = (key, userModel, fbUserModel) => {

    // configure passport to use jwt strategy for authentication
    passport.use(new jwtStrategy({
        jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: key
    }, async (paylod, done) => {
        try {

            let user

            // if accessToken exists then the jwt is for facebook user
            if (paylod.accessToken) {

                // find facebook user
                user = await fbUserModel.findById(paylod._id).exec()
            } else {

                // find user
                user = await userModel.findById(paylod._id).exec()
            }

            if (user) {

                // return user if it exists
                done(null, user)

            } else {

                // return invalid token if user not found
                done(null, false, { message: 'invalid token' })

            }
        } catch (error) {

            // return error if any is caught
            done(error)
        
        }
    }))
    
    return passport
}

export { jwtVerifiy }