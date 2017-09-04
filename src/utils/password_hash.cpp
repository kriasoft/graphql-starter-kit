#include <napi.h>
#include <sodium.h>

using namespace Napi;

class PasswordHashWorker : public AsyncWorker
{
public:
  static void PasswordHash(const CallbackInfo &info)
  {
    Function cb = info[1].As<Function>();
    PasswordHashWorker *worker = new PasswordHashWorker(cb);
    worker->password = info[0].As<String>().Utf8Value();
    worker->Queue();
  }

protected:
  void Execute() override
  {
    // https://download.libsodium.org/doc/password_hashing/the_argon2i_function.html
    int result = crypto_pwhash_str(
        hash,
        password.c_str(),
        password.size(),
        crypto_pwhash_OPSLIMIT_INTERACTIVE,
        crypto_pwhash_MEMLIMIT_INTERACTIVE);

    if (result < 0)
    {
      SetError("The 'passwordHash(password)' method failed. The operating system most likely refused to allocate the required memory.");
    }
  }

  void OnOK() override
  {
    Callback().MakeCallback(
        Receiver().Value(),
        std::initializer_list<napi_value>{
            Env().Null(),
            String::New(Env(), hash, crypto_pwhash_STRBYTES)});
  }

private:
  PasswordHashWorker(Function cb) : AsyncWorker(cb) {}
  std::string password;
  char hash[crypto_pwhash_STRBYTES];
};

Function InitPasswordHash(Env env)
{
  return Function::New(env, PasswordHashWorker::PasswordHash);
}
