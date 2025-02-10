import { Input } from "../ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
  ...props
}: SearchInputProps) => {
  return (
    <div className={`${className} relative w-full bg-white`}>
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`pl-9 pr-4 py-2 w-full bg-transparent border-none  focus:outline-none`}
        {...props}
      />
    </div>
  );
};
