const normalize = require('@ensdomains/eth-ens-namehash').normalize;
const ethers = require('ethers');
const BigNumber = ethers.BigNumber;
const utils = ethers.utils;

const getTokenId = (name: string) => {
    const labelHash = utils.keccak256(utils.toUtf8Bytes(name));
    return BigNumber.from(labelHash).toString();
}

export {normalize};
export default getTokenId;