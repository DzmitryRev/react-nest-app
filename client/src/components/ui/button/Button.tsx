import { PropsWithChildren } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {};

export function Button({ children, className = "", ...props }: PropsWithChildren<ButtonProps>) {
    return (
        <button className={"button " + className} {...props}>
            {children}
        </button>
    );
}
