Frontend using moralis api's to integrate the nft marketplace smartcontract.


# Moralis

For local hardhat environment, download reverse proxy from here:
https://github.com/fatedier/frp/releases

start frp with:
```./frpc -c frpc.ini```

## Moralis admin cli

```yarn global add moralis-admin-cli```

# Run locally

- Backend: `hh node`
- Frontend: `yarn moralis:sync`
- Frontend: `yarn dev`
- Moralis: make sure that dev chain proxy is connected
