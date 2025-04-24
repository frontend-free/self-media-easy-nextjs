"use client";
import electron from "@/electron";

function Api() {
  return (
    <div>
      <button
        onClick={async () => {
          const res = electron.ipcRenderer.send("ping");
          console.log("ping res", res);
        }}
      >
        electron ping
      </button>
      <button
        onClick={async () => {
          electron.ipcRenderer.send("tiktok:auth");
        }}
      >
        tiktok:auth
      </button>
    </div>
  );
}

export default Api;
