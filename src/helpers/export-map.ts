import exportFromJSON from "export-from-json";
import writeXlsxFile from "write-excel-file";
import { ExportTypes, Name2IdMap } from "./types";

export const exportTypes = [{ name: 'CSV', val: 'csv' }, { name: 'XLS', val: 'xls' }];

const xlsSchema = [
    {
      column: 'Name',
      type: String,
      value: (obj: Name2IdMap) => obj.name
    },
    {
      column: 'Token ID',
      type: String,
      value: (obj: Name2IdMap) => obj.tokenId
    }
];

export const exportMap = ({data, type, id2Name}: {data: Name2IdMap, type: ExportTypes, id2Name: boolean}) => {
    return new Promise<void>((resolve) => {
        let keys;
        if (id2Name) {
            keys = Object.keys(data).sort((a, b) => (data[a].localeCompare(data[b])));
        } else {
            keys = Object.keys(data).sort();
        }
        if (type === "json") {
            exportFromJSON({
                data: data,
                fileName: `ens-name-tokenIds-${Date.now()}`,
                exportType: exportFromJSON.types[type],
                replacer: keys
            });
            resolve();
        } else {
            const dataArray: { name: string, tokenId: string }[] = [];
            if (id2Name) {
                keys.forEach(id => {
                dataArray.push({ tokenId: id, name: data[id] });
                });
            } else {
                keys.forEach(name => {
                dataArray.push({ name, tokenId: data[name] });
                });
            }
            if (type === 'xls') {
                
                writeXlsxFile(dataArray, {
                schema: id2Name ? xlsSchema.reverse() : xlsSchema,
                fileName: `ens-name-tokenIds-${Date.now()}.xlsx`
                }).catch(console.error).finally(() => {
                    resolve();
                });
            } else {
                exportFromJSON({
                    data: dataArray,
                    fileName: `ens-name-tokenIds-${Date.now()}`,
                    exportType: exportFromJSON.types[type]
                });
                resolve();
            }
        }
    });
};