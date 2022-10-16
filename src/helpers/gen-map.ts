import { NONAME } from "dns";
import getTokenId, { ens_normalize } from "./name2id";
import parseInput from "./parse-input";
import { Invalids, Name2IdMap } from "./types";

interface NormalMap {
    [index: string]: boolean;
}
const chunkSize = 1000;

const generate = ({ id2name, input, maxRendered }: { id2name?: boolean, input: string, maxRendered: number }): Promise<{ map: Name2IdMap, displayMap: Name2IdMap, invalids: Invalids, count: number, duplicates: number }> => {
    return new Promise((resolve) => {
            const map: Name2IdMap = {};
            const displayMap: Name2IdMap = {};
            let count = 0;
            let duplicates = 0;
            const names = parseInput(input);
            const invalids: Invalids = [];
            
            const run = async () => {
                for (let i = 0; i < names.length; i += chunkSize) {
                    const chunk = names.slice(i, i + chunkSize);

                    await new Promise<void>((rs) => {
                        setTimeout(() => {
                            chunk.forEach(name => {
                                let normal: string;
                                try {
                                    normal = ens_normalize(name);
                                    // if(!validate(normal)) {
                                    //     throw new Error("invalid name!");
                                    // }
                                    if ([...normal].length < 3) {
                                        throw new Error("too short!");
                                    }
                                    let tokenId = getTokenId(normal);
                                    if (id2name) {
                                        if(map[tokenId]){
                                            duplicates++;
                                        } else {
                                            count++;
                                        }
                                        map[tokenId] = normal;
                                    } else {
                                        if(map[normal]){
                                            duplicates++;
                                        } else {
                                            count++;
                                            map[normal] = tokenId;
                                        }
                                    }
                                    
                                    if (count <= maxRendered) {
                                        if (id2name) {
                                            displayMap[tokenId] = map[tokenId];
                                        } else {
                                            displayMap[normal] = map[normal];
                                        }
                                    }
                                } catch (error: any) {
                                    invalids.push({ name, error });
                                }
                            });
                            rs();
                        }, 0);
                    })
                }
            }
            run().then(() => {
                resolve({ map, displayMap, invalids, count, duplicates });
            });
            
    });
};

const normalize = ({ input }: { input: string }): Promise<{ normalInput: string, invalids: Invalids, count: number, duplicates: number }> => {
    return new Promise((resolve) => {
        const map: NormalMap = {};
        let count = 0;
        let duplicates = 0;
        const names = parseInput(input);
        const invalids: Invalids = [];
        let normalInput = "";

        const run = async () => {
            for (let i = 0; i < names.length; i += chunkSize) {
                const chunk = names.slice(i, i + chunkSize);

                await new Promise<void>((rs) => {
                    setTimeout(() => {
                        chunk.forEach(name => {
                            let normal: string;
                            try {
                                normal = ens_normalize(name);
                                if ([...normal].length < 3) {
                                    throw new Error("too short!");
                                }

                                if(map[normal]){
                                    duplicates++;
                                } else {
                                    count++;
                                    map[normal] = true;
                                }

                            } catch (error: any) {
                                invalids.push({ name, error });
                            }
                        });
                        rs();
                    }, 0);
                })
            }
        }
        run().then(() => {
            Object.keys(map).sort().forEach(normalName => normalInput += normalName + " ");
            resolve({ normalInput, invalids, count, duplicates });
        });

    });
};

const extend = ({ input, extension, extensionMode }: { input: string, extension: string, extensionMode: string }): Promise<{ normalInput: string, count: number, duplicates: number }> => {
    return new Promise((resolve) => {
        const map: NormalMap = {};
        let count = 0;
        let duplicates = 0;
        const names = parseInput(input);
        let normalInput = "";

        const run = async () => {
            for (let i = 0; i < names.length; i += chunkSize) {
                const chunk = names.slice(i, i + chunkSize);

                await new Promise<void>((rs) => {
                    setTimeout(() => {
                        chunk.forEach(name => {
                            let extended: string;
                            if(extensionMode === "prefix") {
                                extended = extension + name;
                            } else {
                                extended = name + extension;
                            }

                            if(map[extended]){
                                duplicates++;
                            } else {
                                count++;
                                map[extended] = true;
                            }
                        });
                        rs();
                    }, 0);
                })
            }
        }
        run().then(() => {
            Object.keys(map).sort().forEach(normalName => normalInput += normalName + " ");
            resolve({ normalInput, count, duplicates });
        });

    });
};

export {generate, normalize, extend};
