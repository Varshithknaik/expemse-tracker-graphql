import {users} from "../dummyData/data.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

const userResolver = {
  Mutation: {
    signUp: async(_ , {input} , context ) => {
      try{
        const { username , name , password , gender } = input;
        if(!username || !name || !password || !gender ){
          throw new Error("All fields are required");
        }

        const existingUser = await User.findOne({username});

        if(existingUser){
           throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);
        // https://avatar.iran.liara.run

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
          username,
          name,
          password: hashedPassword,
          gender,
          profilePicture: gender === "male" ? boyProfilePic : girlProfilePic
        })

        await newUser.save();
        await context.login(newUser);
        return newUser;
      }catch(err){   
        console.error("Error in singup: ", err);
        throw new Error(err.message || "Internal Server Error");
      }
    },

    login: async(_ , {input , context }) => {
      try{
        const { username , password } = input;
        const {user} = await context.authenticate('graphql-local' , { username , password });

        await context.login(user);
        return user;
      }catch(error){
        console.error("Error in login" , err);
        throw new Error(error.message || "Internal Server Error");
      }
    },

    logout: async (_ , __ , context) => {
      try{
        await context.logout();
        req.session.destroy((err) => {
          if(err) throw new Error(err.message || "Internal Server Error");
        })

        res.clearCookie("connect.sid");
        return { message: "Logged out successfully"}
      }catch(error){
        console.error("Error in login" , err);
        throw new Error(error.message || "Internal Server Error");
      }
    }
  },
  Query: {
    authUser:async (_, __, context) => {
      try {
        const user = await context.getUser();
        return user
      } catch (error) {
        console.Console.error("Error in authUser: " , err);
        throw new Error("Internal Server Error")
      }

    },
    user: async( _ , {userId}) => {
      try {
        const user = await User.findById(userId);
        return user
      } catch (error) {
        console.error("Error in user query: " , error);
        throw new Error("Error getting user");
      }
    }
  }
  // TODO => ADD USER/TRANSACTION RELATION
}

export default userResolver;