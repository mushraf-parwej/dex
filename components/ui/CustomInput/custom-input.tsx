import React, { ChangeEvent, useCallback } from "react";
import { Input } from "../input";

export const TextInput = ({
  className,
  value,
  onUserInput,
  placeholder,
  fontSize,
}: {
  className?: string;
  value: string;
  onUserInput: (value: string) => void;
  placeholder: string;
  fontSize: string;
}) => {
  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onUserInput(event.target.value);
    },
    [onUserInput]
  );
  return (
    <div className={className}>
      <Input
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        placeholder={placeholder || ""}
        onChange={handleInput}
        value={value}
        style={{
          fontSize: fontSize,
        }}
      />
    </div>
  );
};
