import React, { useEffect, useState } from "react";
import { FormState } from "./Form";

interface Props {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  onPlaceholderChange?: (placeholder: string) => void;
  errorMessage?: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const PhoneNumberInput: React.FC<Props> = ({
  setFormState,
  formState,
  onPlaceholderChange,
  errorMessage,
  setError,
}) => {
  const [placeholder, setPlaceholder] = useState("(000) 000-0000");

  const handleCountryChange = (phoneLength: string) => {
    const length = parseInt(phoneLength, 10);
    let newPlaceholder = "";

    if (length <= 6) {
      newPlaceholder = "0".repeat(length);
    } else if (length === 10) {
      newPlaceholder = `(000) 000-0000`;
    } else {
      newPlaceholder = "0".repeat(length);
    }

    setPlaceholder(newPlaceholder);
    onPlaceholderChange?.(newPlaceholder);
  };

  useEffect(() => {
    if (formState.country.phone_length) {
      handleCountryChange(formState.country.phone_length);
    }
  }, [formState.country.phone_length]);

  return (
    <div className="phone-number-container">
      <input
        type="tel"
        value={formState.phoneNumber}
        onChange={(e) => {
          setError("");
          setFormState((prev) => ({ ...prev, phoneNumber: e.target.value }));
        }}
        className="phone-number-input"
        placeholder={placeholder}
      />
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
};

export default PhoneNumberInput;
