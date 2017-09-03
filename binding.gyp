{
  "targets": [
    {
      "target_name": "native",
      "sources": [
        "src/utils/password_hash.cc",
        "src/utils/password_verify.cc",
        "binding.cc"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "/usr/include/sodium"
      ],
      "dependencies": ["<!(node -p \"require('node-addon-api').gyp\")"],
      "libraries": ["/usr/lib/libsodium.so.18"],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_CPP_EXCEPTIONS"]
    }
  ]
}
