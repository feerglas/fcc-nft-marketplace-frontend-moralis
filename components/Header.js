import { ConnectButton } from 'web3uikit';
import Link from 'next/link';

export default function Header() {
  return (
    <nav>
      <Link href="/">
        <a href="">NFT Marketplace</a>
      </Link>

      <Link href="/sell-nft">
        <a href="">Sell NFT</a>
      </Link>

      <ConnectButton moralisAuth={false} />
    </nav>
  );
}
