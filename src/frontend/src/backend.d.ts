import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Mood {
    name: string;
    description: string;
    emoji: string;
}
export interface backendInterface {
    getAllMoods(): Promise<Array<Mood>>;
    getRandomMood(): Promise<Mood>;
}
