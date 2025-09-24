import { TextField, InputAdornment, CircularProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { memo } from "react";

const SearchInputField = memo(
  ({ mode, value, onChange, isLoading, placeholder }) => {
    const inputProps = {
      style: { textAlign: "right", direction: "rtl" },
      ...(mode === "id" && {
        type: "number",
        min: "1",
      }),
      ...(mode === "name" && {
        minLength: 2,
        maxLength: 50,
      }),
    };

    return (
      <TextField
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonIcon sx={{ color: "#90caf9" }} />
            </InputAdornment>
          ),
          endAdornment: isLoading ? (
            <CircularProgress color="inherit" size={20} />
          ) : null,
          sx: { direction: "rtl", textAlign: "right" },
        }}
        inputProps={inputProps}
      />
    );
  }
);

SearchInputField.displayName = "SearchInputField";
export default SearchInputField;
