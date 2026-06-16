import { useState } from "react";
import styles from "./input.module.css";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
const Input = ({
  label,
  required,
  labelStyles,
  error,
  type,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  readOnly,
  maxLength,
  minLength,
  autoComplete,
  autoFocus,
  onFocus,
  onBlur,
  onKeyDown,
  className,
  style,
  onChangeText,
  isPassword,
  extraLabel,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (event) => {
    if (!disabled && !readOnly && onChange) {
      onChange(event);
      onChangeText?.(event.target.value);
    }
  };

  const handleShowPassword = () => setShowPassword((prev) => !prev);
  return (
    <div
      className={`${styles.inputContainer} ${className} ${error ? styles.error : ""}`}
      style={style}
    >
      <div className={styles.labelContainer}>
        {label && (
          <label className={styles.label} style={labelStyles}>
            {label}
          </label>
        )}
        {extraLabel && extraLabel}
      </div>

      {isPassword ? (
        <div className={styles.inputWrapper}>
          <input
            name={name}
            type={showPassword ? "text" : "password"}
            value={value || ""}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            maxLength={maxLength}
            minLength={minLength}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            readOnly={readOnly}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            className={`${styles.input} ${disabled ? styles.disabled : ""} ${readOnly ? styles.readOnly : ""}`}
          />
          <div className={styles.eyeIcon} onClick={handleShowPassword}>
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </div>
        </div>
      ) : (
        <input
          name={name}
          type={type}
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          readOnly={readOnly}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className={`${styles.input} ${disabled ? styles.disabled : ""} ${readOnly ? styles.readOnly : ""}`}
        />
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default Input;
