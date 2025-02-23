import { ethers } from 'ethers';
import { LimitOrder } from '@/types/limit-order';

export const LIMIT_ORDER_TYPE = {
  LimitOrder: [
    { name: 'info', type: 'OrderInfo' },
    { name: 'input', type: 'InputToken' },
    { name: 'outputs', type: 'OutputToken[]' },
  ],
  OrderInfo: [
    { name: 'reactor', type: 'address' },
    { name: 'swapper', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
    { name: 'additionalValidationContract', type: 'address' },
    { name: 'additionalValidationData', type: 'bytes' },
  ],
  InputToken: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'maxAmount', type: 'uint256' },
  ],
  OutputToken: [
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'recipient', type: 'address' },
  ],
};

export async function signOrder(
  order: LimitOrder,
  signer: ethers.Signer,
  chainId: number
): Promise<string> {
  const domain = {
    name: 'UniswapX',
    version: '1',
    chainId,
    verifyingContract: order.info.reactor,
  };

  const signature = await signer._signTypedData(
    domain,
    LIMIT_ORDER_TYPE,
    order
  );

  return signature;
} 