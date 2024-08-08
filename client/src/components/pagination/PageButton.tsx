import { Button } from "../ui";

type PageButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    pageNumber: number;
};

export function PageButton({ pageNumber, ...props }: PageButtonProps) {
    return (
        <Button className="page-button" {...props}>
            {pageNumber}
        </Button>
    );
}
