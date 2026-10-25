"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

import type { ComplaintCategoryValue } from "../constants";

type ComplaintJourneyContextValue = {
  selectedCategory: ComplaintCategoryValue | "";
  selectCategory: (category: ComplaintCategoryValue | "") => void;
};

const ComplaintJourneyContext = createContext<ComplaintJourneyContextValue | null>(
  null,
);

export function ComplaintJourneyProvider({
  children,
  initialCategory = "",
}: {
  children: ReactNode;
  initialCategory?: ComplaintCategoryValue | "";
}) {
  const [selectedCategory, setSelectedCategory] =
    useState<ComplaintCategoryValue | "">(initialCategory);

  const value = useMemo(
    () => ({ selectedCategory, selectCategory: setSelectedCategory }),
    [selectedCategory],
  );

  return (
    <ComplaintJourneyContext value={value}>
      {children}
    </ComplaintJourneyContext>
  );
}

export function useComplaintJourney(): ComplaintJourneyContextValue {
  const context = useContext(ComplaintJourneyContext);

  if (!context) {
    throw new Error("Complaint journey provider is missing.");
  }

  return context;
}
