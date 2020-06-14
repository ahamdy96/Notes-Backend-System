import passport from 'passport'
import passportJWT from 'passport-jwt'


const jwtStrategy = passportJWT.Strategy;
const extractJwt = passportJWT.ExtractJwt;

const jwtVerifiy = (key, userModel, fbUserModel) => {
    passport.use(new jwtStrategy({
        jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: key
    }, async (paylod, done) => {
        try {

            let user;
            if (paylod.accessToken) {
                user = await fbUserModel.findById(paylod._id).exec();
            } else {
                user = await userModel.findById(paylod._id).exec();
            }

            if (user) {
                done(null, user)
            } else {
                done(null, false, { message: 'invalid token' })
            }
        } catch (error) {
            done(error)
        }
    }))
    return passport;
}

export { jwtVerifiy }