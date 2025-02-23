export interface LimitOrderInfo {
  reactor: string;
  swapper: string;
  nonce: number;
  deadline: number;
  additionalValidationContract: string;
  additionalValidationData: string;
}

export interface InputToken {
  token: string;
  amount: string;
  maxAmount: string;
}

export interface OutputToken {
  token: string;
  amount: string;
  recipient: string;
}

export interface LimitOrder {
  info: LimitOrderInfo;
  input: InputToken;
  outputs: OutputToken[];
}

export interface SignedOrder {
  order: LimitOrder;
  signature: string;
} 