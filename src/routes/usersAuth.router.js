import { Router } from "express";
import passport from "passport";

const router = Router();


router.get('/githubSignup',passport.authenticate('github', { scope: [ 'user:email' ] }))

router.get('/github',passport.authenticate('github',{ 
    failureRedirect: '/login',
    successRedirect: "/view/products"
    }),
)


export default router;