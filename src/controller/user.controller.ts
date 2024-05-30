import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import userservice from '../service/user.service';
import{validateUser,validateLogin} from '../config/yup';
import {sendConfirmationMail,sendOtp,sendApiKey } from '../config/nodemailer'
import {confirmCode,generateOtpCode,generateRandomString} from  '../utils/confirmation'
import {comparePassword} from '../config/bcrypt'
import { createClient } from 'redis';

dotenv.config()

const redisClient= createClient({
    password: process.env.redisPassword,
    socket: {
        host: process.env.redisHost,
        port: 13778
    }
});

redisClient.on('connect',()=>{
    console.log('redis connected')
})

redisClient.on('error',(err)=>{
    console.log('redis error',err)
})
redisClient.connect()

class UserController{

 async createUser(req: Request, res: Response){
     try{
       const {name , email, password}= req.body;
      
       const vaild = await validateUser(name, email, password);

       if(vaild !== true) return res.status(403).json({message:vaild.errors});

       const existingUser= await userservice.findUserByEmail(email);

       if(existingUser) return res.status(409).json({message: 'user already exist'});

       const confirm= confirmCode();

       const link = `http://localhost:4000/confirmEmail?token=${confirm}&email=${email}`;


       const sendmail= await sendConfirmationMail(email,link);

      if (!sendmail) return res.status(400).json({message: 'email did send'});

      const payload ={
        confirm: confirm,
        email: email
      }

       redisClient.set(`${email}+confirm`,JSON.stringify(payload));
       
       const saveUser= await userservice.createUser(name,email,password);

       res.status(201).json({message: 'user created successfully', userservice: saveUser});
     }catch(error){
    res.status(500).json({ message: error}) }
    }

    async confirmCode(req: Request, res: Response){
     try{
        const {email}= req.body;

        if(email ===' ') return res.status(400).json({message: 'email is required'})

        const findUser= await userservice.findUserByEmail(email)

        if(!findUser) return res.status(404).json({message: 'user not found'});

        const otp = generateOtpCode()
    
        const sentMail= await sendOtp(email, otp)

        if(!sentMail) return res.status(400).json({message: 'email did not send'});

        const payload= {
            email: email,
            otp: otp,
            time: Date.now()
        }   
       const secret=  process.env.jwtSecret;
        
       const token = jwt.sign({findUser}, secret || 'secret', { expiresIn: '1h' });

      redisClient.set(email, JSON.stringify(payload))

      res.status(200).json({message:'Otp sent successfully', token:token})
    }catch(error){
        console.log(error);
        res.status(500).json({ message: error}) }
    }
    
    async login(req: Request, res: Response){
    try{
        const {email, password, otp}= req.body;

        const valid = await validateLogin(email, password, otp);

        if(valid !== true) return res.status(403).json({message: valid.errors});

        const data=  await redisClient.get(email)

        if(!data) return res.status(404).json({message: 'user not found'});

        const payload= JSON.parse(data)

        if(payload.email !== email) return res.status(200).json({message:'invalid email'});

        if(payload.otp !== otp) return res.status(200).json({message:'invalid otp'});
     
        const time = Date.now();

        if(time - payload.time > 300000) return res.status(403).json({message: 'otp expired'});

        redisClient.del(email);

        const user= await userservice.findUserByEmail(email);

        if(!user) return res.status(404).json({message: 'user not found'});

        const match= await comparePassword(password, user.password)

        if(!match) return res.status(403).json({message: 'password did not match'});

        res.status(200).json({message:'user login successful'});
    }catch(error){
        res.status(500).json({message: error})
       }
    }

    async confirmEmail(req: Request, res: Response){
        try{
        const {token,email}=req.query;

        if(!token) return res.status(401).json({message:' token is required' });

        if(!email) return res.status(401).json({message:' email is required'})

        const data= await redisClient.get(`${email}+confirm`as string);

        if(!data) return res.status(404).json({message: 'user not found'});

        const payload= JSON.parse(data);

        if(token !== payload.confirm) return res.status(400).json({message:' token has been tampered with '})

        await userservice.verifyEmail(payload.email)
        
        redisClient.del(`${email}+confirm`);

        res.status(200).json({message:'email verified'})
    }catch(error){
        res.status(500).json({message: error})
        }
    }
    
    async createApiKey(req: Request, res: Response){
        try{
          const {email}= req.params;

          if(!email) return res.status(404).json({message: 'please enter a valid email '})

          const user= await userservice.findUserByEmail(email);

          if(!user) return res.status(404).json({message: 'user not found'});

          if(user.isConfirmed===false) return res.status(404).json({message: ' Please confirm your email'});

          if(user.apiKey !== null) return res.status(400).json({message:' user already has an API key'});
          
          const apiKey= generateRandomString();

          if(!apiKey) return res.status(404).json({message:' api key not available'});
          
          await userservice.addApiKey(apiKey,email);
          
          const sendmail = await sendApiKey(email, apiKey);

          if(!sendmail) return res.status(400).json({message: 'email did not send'});

          res.status(200).json({message: 'api key created successfully'});

        }catch(error){
            res.status(500).json({message: error})
        }
    }

}

const usercontroller= new UserController();

export default usercontroller;