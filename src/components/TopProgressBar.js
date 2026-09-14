"use client";

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function TopProgressBar() {
  return (
    <ProgressBar
      height="3px"
      color="#00C6A2"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
