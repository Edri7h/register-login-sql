import prisma from "../db/db.config.js";
import bcrypt from "bcrypt"
import jwt  from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {
        const { name, password, email } = req.body
        if ([name, password, email].some((field) => field.trim() === '')) {
            return res.status(400).json({
                message: "all fields are required",
                success: false
            })
        }
        let user = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(user){
            return res.status(400).json({
                message: "credentials are already taken",
                success: false
            })
        }
        const hashedPassword =await bcrypt.hash(password,10)
        user = await prisma.user.create({
            data:{
                name,
                email,
                password:hashedPassword
            }
        })
        return res.status(200).json({
            message:"user registered success",
            user,
            success:true 
        })
        
    } catch (error) {
            console.log(error)
    }
}



export const loginUser= async (req,res)=>{

    try {

        const {email,password}=req.body;
        if([email,password].some((field)=>field.trim()===''))
        {
            return res.status(400).json({
                message:"all fields are required",
                success:false
            })
        }
      const user= await  prisma.user.findUnique({
            where:{
                email

            }
        })

        if(!user){
            return res.status(401).json({
                message:"account doesn't exist",
                success:false
            })
        }
        const isPasswordMatch =  await bcrypt.compare(password,user.password) 
        if(!isPasswordMatch){
            return res.status(401).json({
                    message:"invalid credentials",
                    success:false
            })
        }
            const forTokenData={
                email:user.email,
                id:user.id
            }
        const token = await  jwt.sign(forTokenData,process.env.JWT_SECRET_KEY,{
            expiresIn:"1d"
        })


        return res.cookie("token",token,
            {
                maxAge:24*60*60*1000,
                httpOnly:true,
                sameSite:'strict'

            }).status(200).json({
             message:`welcome back ${user.name}`,
            user,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}


export const logout= (req,res)=>{
    try {
return res.status(200).cookie("token","",
    {
        maxAge:0
    }
).json({
    message:"logged out success",
    success:true
})
        
    } catch (error) {
        console.log(error)
    }
}