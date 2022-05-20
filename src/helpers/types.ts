import exportFromJSON from "export-from-json";

export type ExportTypes = keyof typeof exportFromJSON.types;

export interface Name2IdMap {
    [index: string]: string;
}

export type Invalids = { name: string, error: Error }[];