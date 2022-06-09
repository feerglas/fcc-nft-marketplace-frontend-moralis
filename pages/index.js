// How to get all listed NFTs? They are stored in the contract in a mapping...
// -> We will index the events off-chain and then read from our database.
// -> Setup a server to listen for those events to be fired, and add them to a
// database to query

export default function Home() {
  return <div>nft</div>;
}
