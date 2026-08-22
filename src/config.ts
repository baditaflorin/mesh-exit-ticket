import { createMeshConfig } from "@baditaflorin/mesh-common";

export const config = createMeshConfig({
  appName: "Mesh Exit Ticket",
  description: "A browser-local end-of-session feedback board.",
  accentHex: "#f07167",
  version: __APP_VERSION__,
  commit: __GIT_COMMIT__,
});
