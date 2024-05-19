import { Key } from "react";

export type Pet = {
    _id: Key | string;
    id: number;
    name: string;
    age: string;
    breed: string;
    location: string;
    image?: string;
};

