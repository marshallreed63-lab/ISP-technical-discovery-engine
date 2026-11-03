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

describe("Shared lifecycle navigation and preserved form behavior", () => {
  it("opens the selected account from shared phase navigation and returns to research", () => {
    fireEvent.click(row("sonic"));
    fireEvent.click(document.querySelector("#stageNav [data-stage='outcome']")!);
    expect(document.querySelector("#view-account")).not.toHaveClass("hidden");
    expect(document.querySelector(".ws-head h2")).toHaveTextContent("Sonic");
    expect(document.querySelector("#lifecycleNav [data-stage='outcome']")).toHaveAttribute(
      "aria-current",
      "page",
    );
    fireEvent.click(document.querySelector("#lifecycleNav [data-stage='research']")!);
    expect(document.querySelector("#view-research")).not.toHaveClass("hidden");
    expect(document.querySelector("#accountInspector h2")).toHaveTextContent("Sonic");
  });

  it("keeps all sources accessible, offers three personas, and opens the selected persona", () => {
    expect(document.querySelectorAll("#accountInspector .evidence-node")).toHaveLength(3);
    expect(document.querySelectorAll("[data-inspector-role]")).toHaveLength(3);
    const persona = document.querySelector<HTMLButtonElement>(
      "[data-inspector-role='CTO / VP Technology']",
    )!;
    fireEvent.click(persona);
    expect(document.querySelector(".seg button.on")).toHaveTextContent("CTO / VP Technology");
    expect(document.querySelectorAll(".dq")).toHaveLength(3);
  });

  it("keeps a focused note textarea mounted while updating workflow progress", () => {
    fireEvent.click(row("citywest").querySelector("button")!);
    const note = document.querySelector<HTMLTextAreaElement>("textarea[data-f='notes']")!;
    note.focus();
    fireEvent.input(note, { target: { value: "Prospect described their operating requirements" } });
    expect(document.querySelector("textarea[data-f='notes']")).toBe(note);
    expect(note).toHaveFocus();
    expect(note).toHaveValue("Prospect described their operating requirements");
    expect(document.querySelector("#wfSteps")).toHaveTextContent("stages with recorded progress");
  });

  it("applies the source review filter without altering research priority", () => {
    const before = row("citywest").querySelector(".score-num")!.textContent;
    fireEvent.change(document.querySelector("#evidenceFilter")!, { target: { value: "reviewed" } });
    expect(row("citywest").querySelector(".score-num")).toHaveTextContent(before!);
    expect(document.querySelector("#tableCount")).toHaveTextContent("accounts");
    fireEvent.change(document.querySelector("#evidenceFilter")!, { target: { value: "all" } });
    expect(document.querySelectorAll("#accountsTable tr[data-id]")).toHaveLength(5);
  });
});
