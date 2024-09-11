import { ObjectId } from "mongoose";
export interface IUser { 
    _id?: ObjectId;
    username: string;
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    // communities?: ObjectId[];
    // posts?:ObjectId[]
}
