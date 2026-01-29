import { describe, it, expect } from "vitest";
import { canonicalize } from "./canonicalize";

describe("Core Utilities", () => {
    it("canonicalize should trim and lowercase", () => {
        expect(canonicalize("  Hello WORLD  ")).toBe("hello world");
    });
});
