import { ObjectId } from "mongoose";
export interface ICommunity { 
    _id?: ObjectId;
    name: string;
    description: string;
    creator: ObjectId;
    mods?: string[];
    tags?: string[];
    media: {
        logo: { data: Buffer; contentType: string }[];
        banner: { data: Buffer; contentType: string }[];
    };
    numberOfMembers: number;
}
