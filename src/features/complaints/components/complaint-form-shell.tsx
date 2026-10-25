"use client";

import { useSearchParams } from "next/navigation";
import { useSyncExternalStore } from "react";

import { complaintCategories, type ComplaintCategoryValue } from "../constants";
import { ComplaintForm } from "./complaint-form";
import { ComplaintJourneyProvider } from "./complaint-journey-context";

const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function readCategory(value: string | null): ComplaintCategoryValue | "" {
  return complaintCategories.some((category) => category.value === value)
    ? value as ComplaintCategoryValue
    : "";
}

export function ComplaintFormShell() {
  const searchParams = useSearchParams();
  const isHydrated = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const category = isHydrated ? readCategory(searchParams.get("category")) : "";

  return (
    <ComplaintJourneyProvider initialCategory={category} key={category || "empty"}>
      <ComplaintForm />
    </ComplaintJourneyProvider>
  );
}
