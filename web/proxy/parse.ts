/**
 * Extracts environment name and version number from the URL hostname.
 *
 *   "example.com" => ["prod", undefined]
 *   "test.example.com" => ["test", undefined]
 *   "123-test.example.com" => ["test", "123"]
 *
 * @copyright 2016-present Kriasoft (https://git.io/vMINh)
 */

export function parseHostname(
  hostname: string,
): ["prod" | "test" | "dev", string | undefined] {
  const prefix = hostname.substring(0, hostname.indexOf("."));

  for (const env of ["test", "dev"] as Array<"test" | "dev">) {
    if (prefix === env) {
      return [env, undefined];
    }

    if (prefix.endsWith(`-${env}`)) {
      return [env, prefix.substring(0, prefix.length - env.length - 1)];
    }
  }

  return ["prod", undefined];
}
