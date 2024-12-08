"use client";

import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { QRCodeSVG } from "qrcode.react";

type token = {
  id: string;
};
export default function Page() {
  const authToken = getCookie("auth");
  if (authToken) {
    const decoded = jwtDecode<token>(authToken.toString());
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl font-semibold">
          This is your check-in qr code:
        </h1>
        <QRCodeSVG
          className="w-60 h-60 rounded-md border border-muted"
          value={decoded.id}
        />
      </div>
    );
  }

  return <div>Something went wrong</div>;
}
