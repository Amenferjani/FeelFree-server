import { ObjectId } from "mongoose";

export interface IPost {
    _id?: ObjectId;
    op: ObjectId;
    content: string;
    title: string;
    timestamp?: Date;
    tags?: string[];
    comments: number;
    boost: number;
    community: ObjectId;
    media: {
        videos: { data: Buffer; contentType: string }[];
        images: { data: Buffer; contentType: string }[];
    };
}
