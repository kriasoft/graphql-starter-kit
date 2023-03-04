/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

const getScript = (env: Bindings) => `
<script type="module">
  import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

  const app = initializeApp({
    projectId: "${env.GOOGLE_CLOUD_PROJECT}",
    appId: "${env.FIREBASE_APP_ID}",
    apiKey: "${env.FIREBASE_API_KEY}",
    authDomain: "${env.FIREBASE_AUTH_DOMAIN}"
  });

  window.auth = getAuth(app);

  AltairGraphQL.init({
    endpointURL: "/api",
    initialEnvironments: {
      base: {
        title: "Environment",
        variables: { token: "" }
      }
    },
    initialHeaders: {
      ["Authorization"]: "Bearer {{token}}"
    },
    initialQuery: "query {\\n  me {\\n    id\\n    email\\n  }\\n}",
    initialPreRequestScript: [
      "if (auth.currentUser) {",
      "  const token = await auth.currentUser.getIdToken();",
      "  altair.helpers.setEnvironment(\\"token\\", token);",
      "}"
    ].join("\\n"),
  });
</script>
`;

export function transform(res: Response, env: Bindings) {
  return new HTMLRewriter()
    .on("base:first-of-type", {
      element(el) {
        el.setAttribute("href", "/api/");
      },
    })
    .on("body", {
      element(el) {
        el.append(getScript(env), { html: true });
      },
    })
    .transform(res);
}
