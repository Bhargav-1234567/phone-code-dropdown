import React, { useMemo, useRef, useState, useEffect } from "react";
import useApiCall from "../hooks/useApiCall";
import "./component.css";

export type Country = {
  id: string;
  name: string;
  calling_code: string;
  phone_length: string;
};

export type CountryResponse = Record<string, Country>;

const CountryDropdown = ({
  onSelect,
  setError,
}: {
  onSelect?: (country: Country) => void;
  setError: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {
    data,
    error,
    loading: loadingOptions,
  } = useApiCall<CountryResponse>(
    "challenges/countries",
    { method: "GET" },
    true
  );

  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedCountry = useMemo(() => {
    if (!selected || !data) return null;
    return data[selected];
  }, [selected, data]);

  const filteredCountries = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).filter(([code, country]) => {
      return (
        country.name.toLowerCase().includes(search.toLowerCase()) ||
        code.toLowerCase().includes(search.toLowerCase()) ||
        country.calling_code.includes(search)
      );
    });
  }, [data, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (code: string, country: Country) => {
    setSelected(code);
    setSearch("");
    setIsOpen(false);
    setError("");
    if (onSelect) onSelect(country);
  };

  const handleInputClick = () => {
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Focus search field when dropdown opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  return (
    <div className="country-dropdown" ref={dropdownRef}>
      <div className="dropdown-input-container">
        {selectedCountry && !isOpen ? (
          <div className="selected-country" onClick={handleInputClick}>
            <img
              src={`https://flagcdn.com/24x18/${selected?.toLowerCase()}.png`}
              alt={selectedCountry.name}
              className="selected-flag"
            />
            <span className="selected-code">
              {selectedCountry.calling_code}
            </span>
            <span className="dropdown-arrow">▾</span>
          </div>
        ) : (
          <>
            <input
              type="text"
              ref={inputRef}
              onFocus={handleInputFocus}
              placeholder="Code"
              className="dropdown-input"
              value={selectedCountry?.calling_code || ""}
              readOnly
              onClick={handleInputClick}
            />
            <div className="dropdown-arrow">
              <span>▾</span>
            </div>
          </>
        )}
      </div>

      {isOpen && (
        <div className="dropdown-options">
          <div className="dropdown-search-container">
            <input
              type="text"
              ref={searchRef}
              placeholder="Search countries..."
              className="dropdown-search-input"
              value={search}
              onChange={handleSearchChange}
            />
          </div>

          {loadingOptions && (
            <div className="dropdown-no-results">Loading...</div>
          )}
          {!loadingOptions && filteredCountries.length === 0 && (
            <div className="dropdown-no-results">No results found.</div>
          )}
          <div className="dropdown-options-list">
            {filteredCountries.map(([code, country]) => (
              <div
                key={code}
                title={country.name}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleSelect(code, country);
                }}
                className={`dropdown-option ${
                  selected === code ? "selected" : ""
                }`}
              >
                <img
                  src={`https://flagcdn.com/24x18/${code.toLowerCase()}.png`}
                  alt={country.name}
                  className="option-flag"
                  loading="lazy"
                />
                <span className="option-name">{country.name}</span>
                <span className="option-code">{country.calling_code}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryDropdown;
