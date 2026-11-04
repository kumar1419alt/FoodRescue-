import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SiteHeader } from "@/components/layout/site-header";

describe("mobile navigation", () => {
  test("opens with an accessible control and closes after navigation", () => { render(<SiteHeader />); const menu = screen.getByLabelText("Open navigation"); expect(menu).toHaveAttribute("aria-expanded", "false"); fireEvent.click(menu); expect(screen.getByLabelText("Close navigation")).toHaveAttribute("aria-expanded", "true"); const navigation = screen.getByLabelText("Mobile navigation"); expect(navigation).toBeInTheDocument(); fireEvent.click(screen.getAllByText("Safety")[1]); expect(screen.queryByLabelText("Mobile navigation")).not.toBeInTheDocument(); });
});
