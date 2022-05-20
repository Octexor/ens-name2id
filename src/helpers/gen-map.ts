import { ens_normalize } from "@adraffy/ens-normalize";
import getTokenId, { normalize } from "./name2id";
import parseInput from "./parse-input";

interface Name2IdMap {
    [index: string]: string;
}
type Invalids = { name: string, error: Error }[];
const generate = ({ id2name, input, maxRendered }: { id2name?: boolean, input: string, maxRendered: number }): { map: Name2IdMap, displayMap: Name2IdMap, invalids: Invalids, count: number } => {
    const map: Name2IdMap = {};
    const displayMap: Name2IdMap = {};
    let count = 0;
    const names = parseInput(input);
    const invalids: Invalids = [];
    names.forEach(name => {
        if (name.length === 0) return;
        let normal: string;
        try {
            normal = normalize(ens_normalize(name));
            if ([...normal].length < 3) {
                throw new Error("too short!");
            }
            let tokenId = getTokenId(normal);
            if (id2name) {
                map[tokenId] = normal;
            } else {
                map[normal] = tokenId;
            }
            count++;
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

    return { map, displayMap, invalids, count };
};

export default generate;