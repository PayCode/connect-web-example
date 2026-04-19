"use client";

import { type PayCodeConnect, setup } from "@paycode/connect";
import { useEffect, useState } from "react";

export function usePayCode() {
  const [pc, setPc] = useState<PayCodeConnect | null>(null);

  useEffect(() => {
    setup().then(setPc);
  }, []);

  return pc;
}
