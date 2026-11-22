import styles from "./button.module.css";

type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}

export function Button({
                           variant = "primary",
                           size = "md",
                           fullWidth = false,
                           loading = false,
                           disabled,
                           children,
                           className,
                           ...props
                       }: ButtonProps) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : "",
        loading ? styles.loading : "",
        className ?? "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            {...props}
            className={classNames}
            disabled={disabled || loading}
        >
            {loading ? (
                <span className={styles.spinner} aria-label="Loading" />
            ) : (
                children
            )}
        </button>
    );
}