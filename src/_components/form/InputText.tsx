import styles from "./formInput.module.css";

type InputType =
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search";

interface FormInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
}

export function FormInput({
                              label,
                              error,
                              helperText,
                              required = false,
                              id,
                              className,
                              ...props
                          }: FormInputProps) {
    const inputId = id ?? `input-${props.name}`;
    const classNames = [
        styles.inputContainer,
        className ?? "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={classNames}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}

                    {required && (
                        <span className={styles.required}>*</span>
                    )}
                </label>
            )}

            <div className={styles.inputLine}>
                <input
                    {...props}
                    id={inputId}
                    required={required}
                    className={`${styles.input} ${error ? styles.error : ""}`}
                    aria-invalid={!!error}
                    aria-describedby={
                        error
                            ? `${inputId}-error`
                            : helperText
                                ? `${inputId}-helper`
                                : undefined
                    }
                />
            </div>

            {error && (
                <span
                    id={`${inputId}-error`}
                    className={styles.errorMessage}
                >
          {error}
        </span>
            )}
            {!error && helperText && (
                <span
                    id={`${inputId}-helper`}
                    className={styles.helperText}
                >
          {helperText}
        </span>
            )}
        </div>
    );
}