import getTokenId, { normalize, validate, ens_normalize } from "./name2id";
import parseInput from "./parse-input";
import { Invalids, Name2IdMap } from "./types";

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
                    // eslint-disable-next-line
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
                                        }
                                        map[normal] = tokenId;
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

export default generate;