import config from '@config/config'
import {Router} from "express";
import type {Request, Response, NextFunction} from "express";
import {customError} from "@common/CustomResponse";
import {generateNaverLoginURL} from "@common/auth/naverLogin";


const router = Router();

// login
router.get('/naver/login', async (req: Request, res: Response, next: NextFunction) => {
    const api_url = generateNaverLoginURL();
    if (!api_url) throw customError.SERVER_ERROR();

    return res.end("<a href='"+ api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
})

export default router;
