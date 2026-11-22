import styles from "./text.module.css";

type TextElement =
    | "p"
    | "span"
    | "div"
    | "label"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6";

type TextSize =
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl";

type TextWeight =
    | "regular"
    | "medium"
    | "semibold"
    | "bold";

type TextAlign = "left" | "center" | "right";

type TextColor =
    | "primary"
    | "secondary"
    | "muted"
    | "success"
    | "warning"
    | "error"
    | "info";

interface TextProps {
    children: React.ReactNode;
    as?: TextElement;
    size?: TextSize;
    weight?: TextWeight;
    align?: TextAlign;
    color?: TextColor;
    className?: string;
    nowrap?: boolean;
    lineClamp?: number;
}

export function Text({
                         children,
                         as = "p",
                         size = "md",
                         weight = "regular",
                         align = "left",
                         color = "primary",
                         className,
                         nowrap = false,
                         lineClamp,
                     }: TextProps) {
    const Component = as;

    const classNames = [
        styles.text,
        styles[size],
        styles[weight],
        styles[align],
        styles[color],
        nowrap ? styles.nowrap : "",
        lineClamp ? styles.lineClamp : "",
        className ?? "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <Component
            className={classNames}
            style={
                lineClamp
                    ? ({
                        "--line-clamp": lineClamp,
                    } as React.CSSProperties)
                : undefined
            }
        >
            {children}
        </Component>
    );
}