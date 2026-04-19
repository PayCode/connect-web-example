"use client";
import Image from "next/image";
import QRCode from "qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePayCode } from "@/hooks/usePayCode";

export default function Home() {
  const [ticket, setTicket] = useState("");
  const [connected, setConnected] = useState(false);
  const pc = usePayCode();

  const didSetListeners = useRef(false);

  const onConnectionChange = useCallback((newConnected: boolean) => {
    setConnected(newConnected)
    console.log(`Node Connection Change: ${newConnected}`);
  }, []);

  const setupListeners = useCallback(() => {
    if (!pc) return;
    pc.on("connected", onConnectionChange);
  }, [pc, onConnectionChange]);

  useEffect(() => {
    if (pc && !didSetListeners.current) {
      setupListeners()
      didSetListeners.current = true;

      setTicket(pc.generateTicket());
    }

    return () => {
      if (pc) {
        pc.off("connected", onConnectionChange);
      }
    }
  }, [pc, setupListeners, onConnectionChange]);

  useEffect(() => {
    if (ticket) {
      QRCode.toCanvas(
        document.getElementById("qcanvas"),
        ticket,
        {},
      );
    }
  }, [ticket]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/logo.svg"
          alt="PayCode logo"
          width={156}
          height={24}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, scan the QR with a PoS.
          </h1>
          <canvas
            id="qcanvas"
            className="rounded-xl w-64 h-64 max-h-64 max-w-64"
            width={512}
            height={512}
          />
        </div>
        <p>{ticket}</p>
        <p>Connected: {connected}</p>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
