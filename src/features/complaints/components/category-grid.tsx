import Link from "next/link";

import { complaintCategories } from "../constants";

export function CategoryGrid() {
  return (
    <div className="topic-list">
      {complaintCategories.map((category, index) => (
        <Link className="topic-link" href={{ pathname: "/pengaduan", query: { category: category.value } }} key={category.value}>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span><strong>{category.label}</strong><small>{category.description}</small></span>
          <span aria-hidden="true">→</span>
        </Link>
      ))}
    </div>
  );
}
