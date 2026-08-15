"use client";

import { useState } from "react";

export function Newsletter() {
  const [done, setDone] = useState(false);

  return (
    <div className="newsletter">
      <h3>خليكي أول من يعرف</h3>
      <p>اشتركي في النشرة البريدية واستلمي العروض والمنتجات الجديدة أول بأول</p>
      <form
        className="nl-form"
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <input
          type="email"
          placeholder="بريدك الإلكتروني"
          required
          aria-label="بريدك الإلكتروني"
        />
        <button type="submit">{done ? "تم ✓" : "اشتراك"}</button>
      </form>
    </div>
  );
}
