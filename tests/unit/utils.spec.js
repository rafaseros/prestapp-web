import { describe, it, expect } from "vitest";

// Utility functions to test
function formatCurrency(value) {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
  }).format(value || 0);
}

function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-BO");
}

function calculateFlatInterest(principal, rate, term) {
  const totalInterest = principal * (rate / 100) * (term / 12);
  const totalAmount = principal + totalInterest;
  const installmentAmount = totalAmount / term;
  return {
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    installmentAmount: Math.round(installmentAmount * 100) / 100,
  };
}

describe("Utility Functions", () => {
  describe("formatCurrency", () => {
    it("should format currency correctly", () => {
      const result = formatCurrency(1000);
      expect(result).toContain("1.000");
      expect(result).toContain("Bs");
    });

    it("should handle zero", () => {
      const result = formatCurrency(0);
      expect(result).toContain("0");
    });

    it("should handle null/undefined", () => {
      const result = formatCurrency(null);
      expect(result).toContain("0");
    });

    it("should format decimals", () => {
      const result = formatCurrency(1234.56);
      expect(result).toContain("1.234");
    });
  });

  describe("formatDate", () => {
    it("should format date correctly", () => {
      const result = formatDate("2026-01-15");
      // Check format contains day, month and year (timezone may vary)
      expect(result).toMatch(/\d{1,2}\/\d{1,2}\/2026/);
    });

    it("should return dash for null", () => {
      expect(formatDate(null)).toBe("-");
    });

    it("should return dash for undefined", () => {
      expect(formatDate(undefined)).toBe("-");
    });
  });

  describe("calculateFlatInterest", () => {
    it("should calculate flat interest correctly", () => {
      // 10000 at 12% for 12 months
      const result = calculateFlatInterest(10000, 12, 12);

      expect(result.totalInterest).toBe(1200);
      expect(result.totalAmount).toBe(11200);
      expect(result.installmentAmount).toBe(933.33);
    });

    it("should handle zero principal", () => {
      const result = calculateFlatInterest(0, 12, 12);

      expect(result.totalInterest).toBe(0);
      expect(result.totalAmount).toBe(0);
    });

    it("should handle different terms", () => {
      // 10000 at 12% for 6 months
      const result = calculateFlatInterest(10000, 12, 6);

      expect(result.totalInterest).toBe(600);
      expect(result.totalAmount).toBe(10600);
      expect(result.installmentAmount).toBe(1766.67);
    });
  });
});
