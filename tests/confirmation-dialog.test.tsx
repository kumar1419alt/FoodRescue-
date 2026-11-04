import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

const renderDialog = (onConfirm: () => void | Promise<void>) => render(<ConfirmationDialog description="This cannot be undone." onConfirm={onConfirm} title="Confirm action" trigger={<button type="button">Open confirmation</button>} />);
describe("ConfirmationDialog", () => {
  test("opens with accessible content and closes on Cancel and Escape", () => { renderDialog(vi.fn()); fireEvent.click(screen.getByText("Open confirmation")); expect(screen.getByRole("dialog")).toHaveAccessibleName("Confirm action"); fireEvent.click(screen.getByText("Cancel")); expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); fireEvent.click(screen.getByText("Open confirmation")); fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" }); expect(screen.queryByRole("dialog")).not.toBeInTheDocument(); });
  test("closes after successful confirmation and prevents repeat clicks", async () => { let resolve!: () => void; const action = vi.fn(() => new Promise<void>((done) => { resolve = done; })); renderDialog(action); fireEvent.click(screen.getByText("Open confirmation")); fireEvent.click(screen.getByText("Confirm")); expect(screen.getByText("Working…")).toBeDisabled(); fireEvent.click(screen.getByText("Working…")); expect(action).toHaveBeenCalledTimes(1); resolve(); await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument()); });
  test("keeps the dialog open and explains failed confirmation", async () => { renderDialog(() => Promise.reject(new Error("failed"))); fireEvent.click(screen.getByText("Open confirmation")); fireEvent.click(screen.getByText("Confirm")); expect(await screen.findByRole("alert")).toHaveTextContent("We could not complete that action"); expect(screen.getByRole("dialog")).toBeInTheDocument(); });
});
