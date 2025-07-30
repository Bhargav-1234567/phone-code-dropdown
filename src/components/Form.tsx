import React, { useEffect, useState } from "react";
import CountryDropdown from "./CountryDropdown";
import PhoneNumberInput from "./PhoneNumberInput";
import useApiCall from "../hooks/useApiCall";

export type Country = {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
};

export type FormState = {
  country: Country;
  phoneNumber: string;
};
type PhoneCheckQuery = {
  country_id: number;
  phone_number: number;
};

type PhoneCheckResponse = {
  country_id: string;
  phone_number: string;
};

const Form = () => {
  const [formState, setFormState] = useState<FormState>({
    country: {
      id: "",
      name: "",
      calling_code: "",
      phone_length: "",
    },
    phoneNumber: "",
  });
  const { fetchData, data, loading } = useApiCall<
    PhoneCheckResponse,
    undefined,
    PhoneCheckQuery
  >(
    "challenges/two_factor_auth",
    {
      method: "POST",
    },
    false
  );
  const [phonePlaceholder, setPhonePlaceholder] = useState("(000) 000-0000");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const digitsOnly = formState.phoneNumber.replace(/\D/g, "");
    const requiredDigits = parseInt(formState.country.phone_length, 10);
    if (formState.phoneNumber.length === 0) {
      setError(`Phone number is required`);
      return;
    }
    if (formState.phoneNumber.length > 0 && !formState.country.id) {
      setError(`Please select a Country`);
      return;
    }
    if (digitsOnly.length !== requiredDigits) {
      setError(`Invalid Phone number`);
      return;
    }

    setError("");
    if (fetchData) {
      await fetchData({
        queryParams: {
          phone_number: formState.phoneNumber,
          country_id: formState.country.id,
        },
      });
    }
  };

  useEffect(() => {
    if (data) {
      setFormState({
        country: {
          id: "",
          name: "",
          calling_code: "",
          phone_length: "",
        },
        phoneNumber: "",
      });
      alert(
        `you have submitted ${data?.country_id} && ${data?.phone_number}, Authentication Successful`
      );
    }
  }, [data]);
  return (
    <div className="form-container">
      <form className="phone-input-container">
        <CountryDropdown
          onSelect={(e) =>
            setFormState({ ...formState, country: e, phoneNumber: "" })
          }
          setError={setError}
        />
        <PhoneNumberInput
          setFormState={setFormState}
          formState={formState}
          onPlaceholderChange={setPhonePlaceholder}
          errorMessage={error}
          setError={setError}
        />
      </form>
      <button
        type="submit"
        className="submit-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Submitting..." : " Submit"}
      </button>
    </div>
  );
};

export default Form;
