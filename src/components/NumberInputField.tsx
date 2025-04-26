import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

type NumberInputFieldProps = {
  id: string;
  label: string;
  value: string | undefined;
  setFormData: (value: string) => void;
  min: number;
  max: number;
  validateAsInt?: boolean;
  adornment?: string;
  required?: boolean;
  size?: "small" | "medium";
};

const NumberInputField: React.FC<NumberInputFieldProps> = ({
  id,
  label,
  value,
  setFormData,
  min,
  max,
  validateAsInt = false,
  adornment = "",
  required = false,
  size = "small",
}) => {
  const handleChange = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = event.target as {
      value: string;
    };
    if (value === "") {
      setFormData(value);
    } else if (validateAsInt) {
      const intValue = parseInt(value);
      if (intValue >= min && intValue <= max) {
        setFormData(intValue.toFixed(0));
      }
    } else {
      const floatValue = parseFloat(value);
      if (floatValue >= min && floatValue <= max) {
        setFormData((Math.round(floatValue * 100) / 100).toString());
      }
    }
  };

  return (
    <TextField
      required={required}
      id={id}
      label={label}
      type="number"
      name={id}
      value={value || ""}
      onChange={handleChange}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">{adornment}</InputAdornment>
          ),
        },
      }}
      size={size}
    />
  );
};

export default NumberInputField;
