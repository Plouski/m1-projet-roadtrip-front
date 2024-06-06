export interface User {
    id: string;
    firstname?: string;
    lastname?: string;
    email: string;
    password: string;
    admin?: boolean;
}

export interface Roadtrip {
    id: number;
    title: string;
    description?: string;
    duration: number;
    image?: string;
}