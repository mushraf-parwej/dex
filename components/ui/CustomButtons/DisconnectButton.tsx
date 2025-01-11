import { PowerOff, PowerOffIcon } from 'lucide-react';
import React from 'react'
import { useDisconnect } from 'wagmi';


const DisconnectButton = () => {
    const { connectors, disconnect } = useDisconnect()
  return (
    <div>
      {connectors.map((connector) => (
        <button key={connector.id} onClick={() => disconnect({ connector })}>
         <PowerOff />
        </button>
      ))}
    </div>
  )
}

export default DisconnectButton