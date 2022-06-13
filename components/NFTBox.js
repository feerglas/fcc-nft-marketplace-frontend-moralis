import { useState, useEffect } from 'react';
import { useWeb3Contract, useMoralis } from 'react-moralis';
import nftMarketplaceAbi from '../constants/NFTMarketplace.json';
import nftAbi from '../constants/BasicNft.json';
import Image from 'next/image';
import { Card } from 'web3uikit';
import { ethers } from 'ethers';
import UpdateListingModal from './UpdateListingModal';

const truncateString = (fullString, stringLength) => {
  if (fullString.length < stringLength) {
    return fullString;
  }

  const separator = '...';
  const separatorLength = separator.length;
  const charsToShow = stringLength - separatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return (
    fullString.substring(0, frontChars) +
    separator +
    fullString.substring(fullString.length - backChars)
  );
};

export default function NFTBox({
  price,
  nftAddress,
  tokenId,
  marketplaceAddress,
  seller,
}) {
  const { isWeb3Enabled, account } = useMoralis();
  const [imageURI, setImageURI] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [showModal, setShowModal] = useState(false);

  const hideModal = () => setShowModal(false);

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: 'tokenURI',
    params: {
      tokenId,
    },
  });

  async function updateUI() {
    const tokenURI = await getTokenURI();

    if (tokenURI) {
      // not all users will have ipfs browser extension.
      // therefore, we use an ipfs gateway through a traidtional webservice
      const requestURL = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
      setImageURI(imageURIURL);
      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
    }
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  const isOwnedByUser = seller === account || seller === undefined;
  const formattedSellerAddress = isOwnedByUser
    ? 'you'
    : truncateString(seller || '', 15);

  const handleCardClick = () => {
    isOwnedByUser ? setShowModal(true) : console.log('will init buy');
  };

  return (
    <div>
      <div>
        {imageURI ? (
          <div>
            <UpdateListingModal
              isVisible={showModal}
              tokenId={tokenId}
              marketplaceAddress={marketplaceAddress}
              nftAddress={nftAddress}
              onClose={hideModal}
            />
            <Card
              title={tokenName}
              description={tokenDescription}
              onClick={handleCardClick}
            >
              <div className="p-2">
                <div className="flex flex-col items-end gap-2">
                  <div>#{tokenId}</div>
                  <div className="italic text-sm">
                    Owned by {formattedSellerAddress}
                  </div>
                  <Image
                    loader={() => imageURI}
                    src={imageURI}
                    width="200"
                    height="200"
                  />
                  <div className="font-bold">
                    {ethers.utils.formatUnits(price, 'ether')} ETH
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
