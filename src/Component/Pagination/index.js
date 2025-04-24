import React from "react";
import { Button } from "react-bootstrap";

const Pagination = ({
  currentPage,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}) => {
  if (totalPages <= 1) return null; // Hide pagination if only 1 page

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap mt-4 p-3 border rounded shadow-sm bg-light">
      {/* Previous Button */}
      <Button
        variant="primary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &larr; Previous
      </Button>

      {/* Page Info */}
      <span className="fw-semibold text-secondary">
        Page <strong className="text-dark">{currentPage}</strong> of{" "}
        <strong className="text-dark">{totalPages}</strong>
      </span>

      {/* Next Button */}
      <Button
        variant="primary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &rarr;
      </Button>

      {/* Items per Page Selector */}
      <div className="ms-3">
        <select
          className="form-select border-primary"
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          style={{ width: "auto" }}
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
