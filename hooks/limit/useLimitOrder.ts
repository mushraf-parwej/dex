import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import SwapRouter02ExecutorABI from '@/.github/config/SwapRouter02Executor.json';
import { useAccount, useChainId, useContractWrite } from 'wagmi';
import { waitForTransaction } from '@wagmi/core';
import { LimitOrderParams, LimitOrder } from '@/types/limit-order';

export const useLimitOrder = () => {
  const { address, connector } = useAccount();
  const chainId = useChainId();
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<LimitOrder[]>([]);

  const ROUTER_ADDRESS = "0xeD3e638A3B7Fdba6a290cB1bc2572913fe841d71";

  const { write: createLimitOrder } = useContractWrite({
    address: ROUTER_ADDRESS as `0x${string}`,
    abi: SwapRouter02ExecutorABI.abi,
    functionName: 'execute',
  });

  const { write: cancelOrder } = useContractWrite({
    address: ROUTER_ADDRESS as `0x${string}`,
    abi: SwapRouter02ExecutorABI.abi,
    functionName: 'cancelOrder', // Replace with your actual cancel function name
  });

  const submitLimitOrder = useCallback(
    async (params: LimitOrderParams) => {
      if (!address) {
        setError('Wallet not connected');
        return;
      }

      if (!chainId) {
        setError('Network not connected');
        return;
      }

      try {
        validateOrderParams(params);
        setIsLoading(true);
        setError(null);

        const order = {
          info: {
            reactor: ROUTER_ADDRESS,
            swapper: address,
            nonce: Date.now(),
            deadline: params.deadline,
            additionalValidationContract: ethers.constants.AddressZero,
            additionalValidationData: '0x',
          },
          input: {
            token: params.tokenIn,
            amount: ethers.utils.parseUnits(params.amountIn, 18),
            maxAmount: ethers.utils.parseUnits(params.amountIn, 18),
          },
          outputs: [{
            token: params.tokenOut,
            amount: ethers.utils.parseUnits(
              (Number(params.amountIn) * Number(params.targetPrice)).toString(),
              18
            ),
            recipient: address,
          }],
        };

        const signature = await signOrder(order);

        const tx = await createLimitOrder({
          args: [{
            order: ethers.utils.defaultAbiCoder.encode(
              ['tuple(tuple(address,address,uint256,uint256,address,bytes),tuple(address,uint256,uint256),tuple(address,uint256,address)[],bytes,bytes32)'],
              [order]
            ),
            sig: signature
          }, '0x']
        });

        if (tx.hash) {
          setIsConfirming(true);
          await waitForTransaction({
            hash: tx.hash,
          });
          setIsConfirming(false);
        }

        setOrders((prevOrders) => [...prevOrders, order]);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create limit order');
      } finally {
        setIsLoading(false);
        setIsConfirming(false);
      }
    },
    [address, chainId, createLimitOrder]
  );

  const cancelLimitOrder = useCallback(async (orderId: number) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      await cancelOrder({
        args: [orderId], // Pass the order ID or nonce
      });

      // Handle transaction confirmation
      if (cancelOrder.data?.hash) {
        setIsConfirming(true);
        await waitForTransaction({
          hash: cancelOrder.data.hash,
        });
        setIsConfirming(false);
      }

      // Remove the order from the state
      setOrders((prevOrders) => prevOrders.filter(order => order.info.nonce !== orderId));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel limit order');
    } finally {
      setIsLoading(false);
    }
  }, [address, cancelOrder]);

  const validateOrderParams = (params: LimitOrderParams) => {
    if (!params.tokenIn || !params.tokenOut) {
      throw new Error('Tokens must be specified.');
    }
    if (parseFloat(params.amountIn) <= 0) {
      throw new Error('Amount must be greater than zero.');
    }
    if (parseFloat(params.targetPrice) <= 0) {
      throw new Error('Target price must be greater than zero.');
    }
    if (params.deadline <= Date.now()) {
      throw new Error('Deadline must be in the future.');
    }
  };

  useEffect(() => {
    const savedOrders = localStorage.getItem('limitOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('limitOrders', JSON.stringify(orders));
  }, [orders]);

  return {
    submitLimitOrder,
    cancelLimitOrder,
    isLoading: isLoading || isConfirming,
    error,
    orders,
  };
};

async function signOrder(order: any): Promise<string> {
  if (!window.ethereum) {
    throw new Error('No crypto wallet found. Please install it.');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const domain = {
    name: 'UniswapX',
    version: '1',
    chainId: await signer.getChainId(),
    verifyingContract: order.info.reactor,
  };

  const types = {
    Order: [
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

  const signature = await signer._signTypedData(domain, types, order);
  return signature;
}