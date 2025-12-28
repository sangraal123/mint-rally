import Link from "next/link";
import Image from "next/image";
import { FC } from "react";
import { useEnsName } from "../../../hooks/useEnsName";
import { Tooltip, Link as ChakraUILink, Flex } from "@chakra-ui/react";

type Props = {
  address: string;
  enableUserLink?: boolean;
  enableEtherScanLink?: boolean;
};

const ENSName: FC<Props> = ({
  address,
  enableEtherScanLink,
  enableUserLink,
}) => {
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID!;
  const { ensName } = useEnsName(address);
  const UserName = (
    <>
      {enableUserLink ? (
        <Link href={`/users/${address}`}>
          <ChakraUILink color="mint.subtle1">{ensName || address}</ChakraUILink>
        </Link>
      ) : (
        <>{ensName || address}</>
      )}
    </>
  );

  return (
    <Flex alignItems="center" gap={2}>
      {UserName}
      {enableEtherScanLink && (
        <>
          <Link
            href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL ||
              "https://sepolia.etherscan.io"
              }/address/${address}`}
            target="_blank"
          >
            <Tooltip
              label="View on Etherscan"
              aria-label="A tooltip"
              placement="right-start"
            >
              <span style={{ position: "relative" }}>
                <Image
                  src="/images/etherscan.svg"
                  alt="View on Etherscan"
                  width={20}
                  height={20}
                />
              </span>
            </Tooltip>
          </Link>
        </>
      )}
    </Flex>
  );
};

export default ENSName;
