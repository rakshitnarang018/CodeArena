import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface EventsPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
}

export const EventsPagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
}: EventsPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasPrevPage) {
                  onPageChange(currentPage - 1);
                }
              }}
              className={!hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {/* Smart page number display */}
          {(() => {
            const pages = [];
            
            // Always show first page
            if (totalPages > 0) {
              pages.push(
                <PaginationItem key={1}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(1);
                    }}
                    className="cursor-pointer"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              );
            }

            // Add ellipsis if needed before current page range
            if (currentPage > 3) {
              pages.push(
                <PaginationItem key="ellipsis-start">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
              if (i !== 1 && i !== totalPages) {
                pages.push(
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i}
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange(i);
                      }}
                      className="cursor-pointer"
                    >
                      {i}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
            }

            // Add ellipsis if needed after current page range
            if (currentPage < totalPages - 2) {
              pages.push(
                <PaginationItem key="ellipsis-end">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            // Always show last page (if more than 1 page)
            if (totalPages > 1) {
              pages.push(
                <PaginationItem key={totalPages}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === totalPages}
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(totalPages);
                    }}
                    className="cursor-pointer"
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              );
            }

            return pages;
          })()}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (hasNextPage) {
                  onPageChange(currentPage + 1);
                }
              }}
              className={!hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
