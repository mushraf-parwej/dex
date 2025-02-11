import { ConnectButton } from "@rainbow-me/rainbowkit";

interface ActionButtonProps {
  isConnected: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}

export const ActionButton = ({
  isConnected,
  handleSubmit,
  disabled,
}: ActionButtonProps) =>
  isConnected ? (
    <button
      onClick={handleSubmit}
      className="red-btn disabled:cursor-not-allowed disabled:opacity-75 w-full"
      disabled={disabled}
    >
      Swap
    </button>
  ) : (
    <div className="flex justify-center">
      <ConnectButton accountStatus="avatar" />
    </div>
  );
