import { Request, Response, NextFunction } from "express";

const verifyApiKey =async (req:Request, res:Response, next:NextFunction) =>{
       try{
         const {apiKey}= req.query
         if(!apiKey) return res.status(401).json({message:' Unauthorized api key is required'});

         next();
       }catch(error){
        next(error);
       }
}

export default verifyApiKey;