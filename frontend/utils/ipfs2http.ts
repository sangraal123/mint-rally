export const ipfs2http = (ipfs: string) => {
  const rootCid = ipfs.split("ipfs://")[1]?.split("/")[0];
  const domain = "gateway.pinata.cloud";
  const fileName = ipfs.split("ipfs://")[1]?.split("/")[1];
  return `https://${domain}/ipfs/${rootCid}/${fileName}`;
};
