<?php
include_once "constants.php";

// source: https://stackoverflow.com/a/57249681/9612603

/**
 * Encrypt:
 * 1. compute initialisation vector length and the vector itself
 * 2. compute cipher with the iv and private key
 * 3. compute the MAC with the private key
 * 4. base64 encode the iv + mac + cipher for db storage
 * Decrypt:
 * 1. base64 decode encrypted message
 * 2. extract the iv from the message (first iv_length characters)
 * 3. extract the MAC from the message (sha2_length = 32 + iv_length offset)
 * 4. extract the cipher (sha2_length + iv_length offset to the end)
 * 5. decrypt the cipher with the extracted iv and the private key 
 * 6. compute a MAC with the private key
 * 7. compare computed MAC with the extracted one. on match -> return the decrypted cipher. on mismatch -> return false 
 */
class Key
{
  static private $PRIVATE_KEY = "i am from bosnia take me to america i really want to see statue of liberty i can no longer wait take me to united states";
  static private $sha2_length = 32;

  public static function encode(string $message): string|bool
  {
    $iv_length = openssl_cipher_iv_length('AES-256-CBC');
    $iv = openssl_random_pseudo_bytes($iv_length);
    $cipher = openssl_encrypt(
      $message,
      'AES-256-CBC',
      passphrase: Key::$PRIVATE_KEY,
      options: OPENSSL_RAW_DATA,
      iv: $iv
    );

    if (!$cipher)
      return false;

    $hmac = hash_hmac('sha256', $cipher, Key::$PRIVATE_KEY, binary: true);
    return base64_encode($iv . $hmac . $cipher);
  }

  public static function decode(string $encrypted_message): string|bool
  {
    $encrypted_message = base64_decode($encrypted_message);

    $extracted_iv = substr($encrypted_message, offset: 0, length: openssl_cipher_iv_length('AES-256-CBC'));
    $extracted_hmac = substr($encrypted_message, offset: openssl_cipher_iv_length('AES-256-CBC'), length: Key::$sha2_length);
    $extracted_cipher = substr($encrypted_message, offset: openssl_cipher_iv_length('AES-256-CBC') + Key::$sha2_length);

    $decrypted_message = openssl_decrypt(
      $extracted_cipher,
      'AES-256-CBC',
      passphrase: Key::$PRIVATE_KEY,
      options: OPENSSL_RAW_DATA,
      iv: $extracted_iv
    );

    if (!$decrypted_message)
      return false;

    $mac = hash_hmac('sha256', $extracted_cipher, Key::$PRIVATE_KEY, binary: true);
    return hash_equals($extracted_hmac, $mac) ? $decrypted_message : false;
  }
}