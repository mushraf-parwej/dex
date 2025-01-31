import { ConnectButton } from "@rainbow-me/rainbowkit";

interface ActionButtonProps {
  isConnected: boolean;
}

export const ActionButton = ({ isConnected }: ActionButtonProps) =>
  isConnected ? (
    <button className="red-btn">Swap</button>
  ) : (
    <div className="flex justify-center">
      <ConnectButton />
    </div>
  );
