#include "napi.h"

using namespace Napi;

Function InitPasswordHash(Env env);
Function InitPasswordVerify(Env env);

void Init(Env env, Object exports, Object module)
{
  exports.Set("passwordHash", InitPasswordHash(env));
  exports.Set("passwordVerify", InitPasswordVerify(env));
}

NODE_API_MODULE(addon, Init);
