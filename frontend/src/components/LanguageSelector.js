import React from "react";
import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const LanguageSelector = ({ selectedLanguages, setSelectedLanguages }) => {
  const availableLanguages = [
    { code: "en", label: "English" },
    { code: "bn", label: "Bangla" },
    { code: "es", label: "Spanish" }
  ];

  const handleChange = (event) => {
    setSelectedLanguages(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Select Languages</InputLabel>
      <Select
        multiple
        value={selectedLanguages}
        onChange={handleChange}
        renderValue={(selected) =>
          selected.map((code) => availableLanguages.find((lang) => lang.code === code)?.label).join(", ")
        }
      >
        {availableLanguages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {lang.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
