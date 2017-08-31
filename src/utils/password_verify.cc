#include <napi.h>
#include <sodium.h>

using namespace Napi;

class PasswordVerifyWorker : public AsyncWorker
{
public:
  static void PasswordVerify(const CallbackInfo &info)
  {
    Function cb = info[2].As<Function>();
    PasswordVerifyWorker *worker = new PasswordVerifyWorker(cb);
    worker->password = info[0].As<String>().Utf8Value();
    worker->hash = info[1].As<String>().Utf8Value();
    worker->Queue();
  }

protected:
  void Execute() override
  {
    // https://download.libsodium.org/doc/password_hashing/the_argon2i_function.html
    int result = crypto_pwhash_str_verify(
        hash.c_str(),
        password.c_str(),
        password.size());
    verified = result == 0;
  }

  void OnOK() override
  {
    Callback().MakeCallback(
        Receiver().Value(),
        std::initializer_list<napi_value>{
            Env().Null(),
            Boolean::New(Env(), verified)});
  }

private:
  PasswordVerifyWorker(Function cb) : AsyncWorker(cb) {}
  std::string password;
  std::string hash;
  bool verified = false;
};

Function InitPasswordVerify(Env env)
{
  return Function::New(env, PasswordVerifyWorker::PasswordVerify);
}
