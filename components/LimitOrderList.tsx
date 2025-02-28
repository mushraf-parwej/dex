import React from 'react';
import { LimitOrder } from '@/types/limit-order';

const LimitOrderList = ({ orders, onCancel }) => {
  return (
    <div>
      <h2>Your Limit Orders</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            {order.input.amount} {order.input.token} at {order.outputs[0].amount} {order.outputs[0].token}
            <button onClick={() => onCancel(order.info.nonce)}>Cancel Order</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LimitOrderList; 