import AElf from 'aelf-sdk';
import config from '../../config';
const {fetchTimeout} = config;
const aelf = new AElf(
  new AElf.providers.HttpProvider(config.httpProvider, fetchTimeout),
);

async function getContract(privateKeyInput, contractNameAddressSets) {
  const privateKey = privateKeyInput || config.commonPrivateKey;
  const wallet = AElf.wallet.getWalletByPrivateKey(privateKey);
  const contractInstances = {};

  const promise = Object.entries(contractNameAddressSets).map(
    ([contractName, contractAdress]) => {
      return aelf.chain
        .contractAt(contractAdress, wallet)
        .then(contractInstance => {
          contractInstances[contractName] = contractInstance;
        });
    },
  );
  return Promise.all(promise).then(() => {
    return contractInstances;
  });
}
const getOtherContracts = wallet => {
  const {contractAddresses} = config;
  const contractInstances = {};
  const promise = contractAddresses.map(({contractName, contractAdress}) => {
    return aelf.chain
      .contractAt(contractAdress, wallet)
      .then(contractInstance => {
        contractInstances[contractName] = contractInstance;
      });
  });
  return Promise.all(promise)
    .then(() => {
      return contractInstances;
    })
    .catch(err => {
      throw err;
    });
};
const aelfInstance = aelf;

export {getContract, getOtherContracts, aelfInstance};
