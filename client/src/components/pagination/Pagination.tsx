import { PageButton } from "./PageButton";

type PaginationProps = {
    totalPages: number;
    // currentPage: number;
    setPage: (page: number) => void;
};

export function Pagination({ totalPages, setPage }: PaginationProps) {
    const pageNumbers = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        pageNumbers.push(1, 2, 3, "...", totalPages - 2, totalPages - 1, totalPages);
    }

    return (
        <div className="pagination">
            {pageNumbers.map((page, index) =>
                typeof page === "number" ? (
                    <PageButton
                        key={index}
                        pageNumber={page}
                        onClick={() => {
                            setPage(page);
                        }}
                    />
                ) : (
                    <div className="pagination__dots">...</div>
                )
            )}
        </div>
    );
}
