// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

import {ISwapRouter} from 'lib/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import {TransferHelper} from 'lib/v3-periphery/contracts/libraries/TransferHelper.sol';
import {IERC20} from 'lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol';
import {Ownable} from 'lib/openzeppelin-contracts/contracts/access/Ownable.sol';
import {ReentrancyGuard} from "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

/// @title Token-Agnostic Swapping Contract for Uniswap V3
/// @notice This contract provides functionality to swap any ERC20 tokens using Uniswap V3
/// @dev Implements single-hop swaps with exact input and exact output for any token pair

abstract contract Swap is Ownable, ReentrancyGuard {
    ISwapRouter public immutable swapRouter;

    uint24 public defaultPoolFee;

    uint256 public constant DEADLINE_EXTENSION = 300; // 5 minutes

    /// @notice Emitted when a token swap occurs
    /// @param tokenIn The address of the input token
    /// @param tokenOut The address of the output token
    /// @param amountIn The amount of input tokens swapped
    /// @param amountOut The amount of output tokens received
    event TokenSwapped(address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut);

    /// @notice Emitted when the default pool fee is updated
    /// @param newPoolFee The new default pool fee
    event DefaultPoolFeeUpdated(uint24 newPoolFee);

    /// @notice Initializes the TokenAgnosticSwapping contract
    /// @param _swapRouter The address of the Uniswap V3 SwapRouter
    /// @param _defaultPoolFee The default pool fee for swaps
    constructor(ISwapRouter _swapRouter, uint24 _defaultPoolFee) {
        swapRouter = _swapRouter;
        defaultPoolFee = _defaultPoolFee;
    }

    /// @notice Swaps an exact amount of input tokens for a minimum amount of output tokens
    /// @param tokenIn The address of the input token
    /// @param tokenOut The address of the output token
    /// @param amountIn The exact amount of input tokens to swap
    /// @param amountOutMinimum The minimum amount of output tokens to receive
    /// @param poolFee The fee tier of the pool to use for the swap (optional, uses default if 0)
    /// @return amountOut The actual amount of output tokens received

    function swapExactInputSingle(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 amountOutMinimum,
        uint24 poolFee
    ) external nonReentrant returns (uint256 amountOut) {
        require(tokenIn != address(0) && tokenOut != address(0), "Invalid token addresses");
        require(amountIn > 0, "Amount must be greater than 0");

        if (poolFee == 0) {
            poolFee = defaultPoolFee;
        }

        TransferHelper.safeTransferFrom(tokenIn, msg.sender, address(this), amountIn);
        TransferHelper.safeApprove(tokenIn, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: poolFee,
            recipient: msg.sender,
            deadline: block.timestamp + DEADLINE_EXTENSION,
            amountIn: amountIn,
            amountOutMinimum: amountOutMinimum,
            sqrtPriceLimitX96: 0
        });

        amountOut = swapRouter.exactInputSingle(params);
        emit TokenSwapped(tokenIn, tokenOut, amountIn, amountOut);
    }

    /// @notice Swaps a maximum amount of input tokens for an exact amount of output tokens
    /// @param tokenIn The address of the input token
    /// @param tokenOut The address of the output token
    /// @param amountOut The exact amount of output tokens to receive
    /// @param amountInMaximum The maximum amount of input tokens to swap
    /// @param poolFee The fee tier of the pool to use for the swap (optional, uses default if 0)
    /// @return amountIn The actual amount of input tokens swapped

    function swapExactOutputSingle(
        address tokenIn,
        address tokenOut,
        uint256 amountOut,
        uint256 amountInMaximum,
        uint24 poolFee
    ) external nonReentrant returns (uint256 amountIn) {
        require(tokenIn != address(0) && tokenOut != address(0), "Invalid token addresses");
        require(amountOut > 0, "Amount must be greater than 0");

        if (poolFee == 0) {
            poolFee = defaultPoolFee;
        }

        TransferHelper.safeTransferFrom(tokenIn, msg.sender, address(this), amountInMaximum);
        TransferHelper.safeApprove(tokenIn, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter.ExactOutputSingleParams({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            fee: poolFee,
            recipient: msg.sender,
            deadline: block.timestamp + DEADLINE_EXTENSION,
            amountOut: amountOut,
            amountInMaximum: amountInMaximum,
            sqrtPriceLimitX96: 0
        });

        amountIn = swapRouter.exactOutputSingle(params);

        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(tokenIn, address(swapRouter), 0);
            TransferHelper.safeTransfer(tokenIn, msg.sender, amountInMaximum - amountIn);
        }

        emit TokenSwapped(tokenIn, tokenOut, amountIn, amountOut);
    }

    /// @notice Updates the default pool fee used for swaps when not specified
    /// @param newPoolFee The new default pool fee to set
    function updateDefaultPoolFee(uint24 newPoolFee) external onlyOwner {
        require(newPoolFee > 0, "Invalid pool fee");
        defaultPoolFee = newPoolFee;
        emit DefaultPoolFeeUpdated(newPoolFee);
    }
}