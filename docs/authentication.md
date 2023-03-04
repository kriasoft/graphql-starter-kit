# Authentication

This project is using [Google Identity Platform](https://cloud.google.com/identity-platform) — a cloud-based customer identity and access management platform.

### Cloud Resources

- [Users](https://console.cloud.google.com/customer-identity/users?project=example) ([test](https://console.cloud.google.com/customer-identity/users?project=example-test))
- [Providers](https://console.cloud.google.com/customer-identity/providers?project=example) ([test](https://console.cloud.google.com/customer-identity/providers?project=example-test))
- [Settings](https://console.cloud.google.com/customer-identity/settings?project=example) ([test](https://console.cloud.google.com/customer-identity/settings?project=example-test))
- [Firestore: `users`](https://console.cloud.google.com/firestore/data/panel/users?project=example) ([test](https://console.cloud.google.com/firestore/data/panel/users?project=example-test))

### How to check the user's authentication state?

```ts
import { getAuth } from "firebase/auth";

const me = getAuth().currentUser;
```

... or, using React hook:

```tsx
import { useCurrentUser } from "../core/auth.js";

function Example(): JSX.Element {
  const me = useCurrentUser();
}
```

### How to authenticate HTTP requests to the GraphQL API?

By passing `Authorization: Bearer <IdToken>` HTTP header, for example:

```ts
const idToken = await auth.currentUser?.getIdToken();
const res = await fetch("/api", {
  method: "POST",
  headers: {
    ["Authorization"]: idToken ? `Bearer ${idToken}` : undefined,
  },
  ...
});
```

See [`app/core/relay.ts`](../app/core/relay.ts).

### How to authenticate HTTP requests on the server-side?

```ts
import { getAuth } from "firebase-admin/auth";

const app = express();

app.use(function (req, res, next) {
  const idToken = req.headers.authorization?.match(/^[Bb]earer (\S+)/)?.[1];

  if (idToken) {
    const auth = getAuth();
    const user = await auth.verifyIdToken(idToken, true);
    ...
  }

  next();
});
```

See [`api/core/session.ts`](../api/core/session.ts).

### How to access the user's OAuth credentials upon signing in?

We use a [Cloud Function](https://cloud.google.com/identity-platform/docs/blocking-functions) that triggers each time the user signs in or registers a new account, saving user credentials (`access` and `refresh` tokens) to the `users/{uid}/credentials` [Firestore](https://firebase.google.com/docs/firestore) collection. See [`/auth`](../auth/) package.

### References

- [Signing in with Google](https://cloud.google.com/identity-platform/docs/web/google)
- [Signing in with Microsoft](https://cloud.google.com/identity-platform/docs/web/microsoft)
- [Signing in with Salesforce](https://cloud.google.com/identity-platform/docs/web/oidc)
- [Signing in with SAML](https://cloud.google.com/identity-platform/docs/web/saml)
- [Signing in users from a Chrome extension](https://cloud.google.com/identity-platform/docs/web/chrome-extension)
