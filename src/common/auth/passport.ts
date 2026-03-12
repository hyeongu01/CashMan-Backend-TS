import passport from 'passport';
import {
    Strategy as JwtStrategy,
    ExtractJwt,
    type VerifiedCallback
} from "passport-jwt";
import prismaClient from "@config/db.config";
import config from "@config/config";
import type {NextFunction, Request, Response} from "express";
import {CustomJwtPayload} from "@common/auth/jwt";
import {customError} from "@common/CustomResponse";


passport.use(
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwt.accessSecret,
        },
        async (payload: CustomJwtPayload, done: VerifiedCallback) => {
            const user = await prismaClient.user.findFirst({
                where: {id: payload.id, deletedAt: null},
            });
            if (!user)
                return done(null, false);
            return done(null, user);
        }
    )
)

export const authJwt = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", (err: any, user: any) => {
        if (err) return next(err)
        if (!user) return next(customError.UNAUTHORIZED());
        req.user = user;
        next();
    })(req, res, next);
}

export default passport;

