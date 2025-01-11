"use client";


import { Button } from './button';
import { Dialog, DialogOverlay,DialogContent, DialogDescription, DialogTitle } from './dialog';
import React from 'react';

const WalletSelectModal = ({ isOpen, onClose, onConnect }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay className="fixed inset-0 bg-black opacity-30" />
            <DialogContent className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <DialogTitle className="text-lg font-bold mb-4">Select Wallet</DialogTitle>
                    <DialogDescription className="mb-4">
                        Please choose a wallet extension to connect:
                    </DialogDescription>
                    <Button onClick={() => onConnect('metamask')} className="w-full mb-2">
                        MetaMask
                    </Button>
                    <Button onClick={() => onConnect('coinbase')} className="w-full mb-2">
                        Coinbase Wallet
                    </Button>
                    {/* Add more wallets as needed */}
                    <Button variant="secondary" onClick={onClose} className="w-full">
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WalletSelectModal;
