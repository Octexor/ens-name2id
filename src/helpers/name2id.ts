import { ens_normalize } from "@adraffy/ens-normalize";
const oldNormalize = require('@ensdomains/eth-ens-namehash').normalize;
const oldValidate = require('@ensdomains/ens-validation').validate;
const ethers = require('ethers');
const BigNumber = ethers.BigNumber;
const utils = ethers.utils;

const getTokenId = (name: string) => {
    const labelHash = utils.keccak256(utils.toUtf8Bytes(name));
    return BigNumber.from(labelHash).toString();
}

export {oldNormalize, oldValidate, ens_normalize};
export default getTokenId;