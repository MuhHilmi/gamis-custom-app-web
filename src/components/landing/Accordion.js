"use client";

import { useId, useState } from "react";

// Accordion yang bisa diklik, dipakai untuk "Kenapa pilih kami" dan FAQ.
// Panel dianimasikan dengan transisi grid-template-rows (0fr -> 1fr) supaya
// tinggi berubah mulus tanpa perlu mengukur piksel. Ikon chevron berputar
// mengikuti status terbuka.
export default function Accordion({
  items,
  defaultOpenFirst = false,
  allowMultiple = false,
  titleClassName = "text-base font-semibold",
}) {
  const [openItems, setOpenItems] = useState(() =>
    defaultOpenFirst ? new Set([0]) : new Set()
  );
  const baseId = useId();

  function toggle(index) {
    setOpenItems((previous) => {
      const next = new Set(previous);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) next.clear();
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="divide-y divide-garis border-y border-garis">
      {(items || []).map((item, index) => {
        const isOpen = openItems.has(index);
        const buttonId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.title || index}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className={
                  "flex min-h-14 w-full items-center justify-between gap-4 py-2 text-left transition-colors hover:text-zaitun " +
                  titleClassName
                }
              >
                <span>{item.title}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={
                    "shrink-0 text-zaitun transition-transform duration-300 " +
                    (isOpen ? "rotate-180" : "")
                  }
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={
                "grid transition-[grid-template-rows] duration-300 ease-out " +
                (isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
              }
            >
              <div className="overflow-hidden">
                <p className="pb-4 text-sm text-teks-sekunder">{item.text}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
