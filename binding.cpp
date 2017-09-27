#include "napi.h"

using namespace Napi;

Function InitPasswordHash(Env env);
Function InitPasswordVerify(Env env);

Object Init(Env env, Object exports)
{
  exports.Set("passwordHash", InitPasswordHash(env));
  exports.Set("passwordVerify", InitPasswordVerify(env));
  return exports;
}

NODE_API_MODULE(addon, Init);
