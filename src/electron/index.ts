"use client";

let electron: any = null;

if (typeof window !== "undefined") {
  // @ts-ignore
  electron = window.electron;
}

export default electron;
