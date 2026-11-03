import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import { ISP_MARKUP } from "@/lib/isp-markup";
import { initIspApp } from "@/lib/isp-app";

const row = (id: string) => document.querySelector<HTMLTableRowElement>(`tr[data-id="${id}"]`)!;

beforeEach(() => {
  document.body.innerHTML = ISP_MARKUP;
  initIspApp();
});

describe("Shortlist inspector and discovery presentation", () => {
  it("inspects an account without leaving the shortlist, then opens its working plan", () => {
    fireEvent.click(row("sonic"));
    expect(document.querySelector("#accountInspector h2")).toHaveTextContent("Sonic");
    expect(document.querySelector("#view-research")).not.toHaveClass("hidden");
    fireEvent.click(row("sonic").querySelector("button")!);
    expect(document.querySelector("#view-account")).not.toHaveClass("hidden");
    expect(document.querySelector(".ws-head h2")).toHaveTextContent("Sonic");
    expect(document.querySelectorAll(".dq")).toHaveLength(3);
  });

  it("moves keyboard selection within filtered accounts and retains focus", () => {
    fireEvent.change(document.querySelector("#region")!, { target: { value: "Canada" } });
    const first = document.querySelector<HTMLTableRowElement>("#accountsTable tr[data-id]")!;
    fireEvent.keyDown(first, { key: "ArrowDown" });
    const selected = document.querySelector("#accountsTable tr[aria-selected='true']")!;
    expect(selected).toHaveFocus();
    expect(selected).not.toHaveAttribute("data-id", first.dataset.id);
    expect(document.querySelector("#view-research")).not.toHaveClass("hidden");
  });

  it("copies the actual question for the active persona", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    fireEvent.click(row("citywest").querySelector("button")!);
    fireEvent.click(document.querySelector(".seg button:last-child")!);
    const question = document.querySelector(".dq-text")!.textContent!.slice(1, -1);
    fireEvent.click(document.querySelector("[data-copy-question='0']")!);
    await Promise.resolve();
    expect(writeText).toHaveBeenCalledWith(question);
    expect(document.querySelectorAll(".seg button[aria-pressed='true']")).toHaveLength(1);
  });
});
