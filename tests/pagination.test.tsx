import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Pagination } from "@/components/ui/table";

describe("Pagination", () => {
  test("enforces boundaries and invokes valid callbacks", () => { const change = vi.fn(); render(<Pagination onPageChange={change} page={1} pages={3} />); expect(screen.getByLabelText("Previous page")).toBeDisabled(); fireEvent.click(screen.getByLabelText("Next page")); expect(change).toHaveBeenCalledWith(2); });
  test("normalizes invalid values and disables actions without navigation", () => { render(<Pagination page={Number.NaN} pages={0} />); expect(screen.getByText("Page 1 of 1")).toBeInTheDocument(); expect(screen.getByLabelText("Previous page")).toBeDisabled(); expect(screen.getByLabelText("Next page")).toBeDisabled(); });
  test("uses supplied page destinations", () => { render(<Pagination getPageHref={(page) => `/items?page=${page}`} page={2} pages={3} />); expect(screen.getByLabelText("Previous page")).toHaveAttribute("href", "/items?page=1"); expect(screen.getByLabelText("Next page")).toHaveAttribute("href", "/items?page=3"); });
});
