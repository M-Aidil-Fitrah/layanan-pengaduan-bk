"use client";

import { complaintCategories } from "../constants";
import { useComplaintJourney } from "./complaint-journey-context";

function CategoryIcon({ name }: { name: (typeof complaintCategories)[number]["icon"] }) {
  const paths = {
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v15h4.5a2.5 2.5 0 0 1 2.5 2.5v-15Z" /></>,
    dots: <><circle cx="6" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="18" cy="12" r="1" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    spark: <path d="m12 3-1.6 4.4L6 9l4.4 1.6L12 15l1.6-4.4L18 9l-4.4-1.6L12 3Zm-6 11-.9 2.1L3 17l2.1.9L6 20l.9-2.1L9 17l-2.1-.9L6 14Z" />,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
}

export function CategoryGrid() {
  const { selectCategory, selectedCategory } = useComplaintJourney();

  function chooseCategory(category: (typeof complaintCategories)[number]["value"]) {
    selectCategory(category);
    document.getElementById("pengaduan")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="category-grid">
      {complaintCategories.map((category, index) => (
        <button
          aria-pressed={selectedCategory === category.value}
          className="category-card"
          key={category.value}
          onClick={() => chooseCategory(category.value)}
          type="button"
        >
          <span className={`category-icon category-icon-${index + 1}`}>
            <CategoryIcon name={category.icon} />
          </span>
          <span className="category-copy">
            <strong>{category.label}</strong>
            <small>{category.description}</small>
          </span>
          <span aria-hidden="true" className="category-arrow">↗</span>
        </button>
      ))}
    </div>
  );
}
