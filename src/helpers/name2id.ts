import { ens_normalize } from "@adraffy/ens-normalize";
const normalize = require('@ensdomains/eth-ens-namehash').normalize;
const validate = require('@ensdomains/ens-validation').validate;
const ethers = require('ethers');
const BigNumber = ethers.BigNumber;
const utils = ethers.utils;

const getTokenId = (name: string) => {
    const labelHash = utils.keccak256(utils.toUtf8Bytes(name));
    return BigNumber.from(labelHash).toString();
}

export {normalize, validate, ens_normalize};
export default getTokenId;