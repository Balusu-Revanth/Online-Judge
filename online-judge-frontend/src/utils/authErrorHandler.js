export const generateFirebaseAuthErrorMessage = (error) => {
  switch (error?.code) {
    case "auth/invalid-email":
      return "Invalid email address. Please enter a valid email.";
    case "auth/user-not-found":
      return "User not found. Please check the email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "Email already in use. Please try another email.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/operation-not-allowed":
      return "Operation not allowed. Please try again later.";
    case "auth/invalid-verification-code":
      return "Invalid verification code. Please try again.";
    case "auth/invalid-verification-id":
      return "Invalid verification ID. Please try again.";
    case "auth/code-expired":
      return "Code expired. Please try again.";
    case "auth/invalid-action-code":
      return "Invalid action code. Please try again.";
    case "auth/user-disabled":
      return "User disabled. Please contact support.";
    case "auth/invalid-credential":
      return "Invalid credential. Please try again.";
    case "auth/invalid-continue-uri":
      return "Invalid continue URL. Please try again.";
    case "auth/unauthorized-continue-uri":
      return "Unauthorized continue URL. Please try again.";
    case "auth/missing-continue-uri":
      return "Missing continue URL. Please try again.";
    case "auth/missing-verification-code":
      return "Missing verification code. Please try again.";
    case "auth/missing-verification-id":
      return "Missing verification ID. Please try again.";
    case "auth/captcha-check-failed":
      return "Captcha check failed. Please try again.";
    case "auth/invalid-phone-number":
      return "Invalid phone number. Please try again.";
    case "auth/missing-phone-number":
      return "Missing phone number. Please try again.";
    case "auth/quota-exceeded":
      return "Quota exceeded. Please try again.";
    case "auth/missing-app-credential":
      return "Missing app credential. Please try again.";
    case "auth/invalid-app-credential":
      return "Invalid app credential. Please try again.";
    case "auth/session-expired":
      return "Session expired. Please try again.";
    case "auth/missing-or-invalid-nonce":
      return "Missing or invalid nonce. Please try again.";
    case "auth/missing-client-identifier":
      return "Missing client identifier. Please try again.";
    case "auth/key-retrieval-failed":
      return "Key retrieval failed. Please try again.";
    case "auth/invalid-oauth-provider":
      return "Invalid OAuth provider. Please try again.";
    case "auth/invalid-oauth-client-id":
      return "Invalid OAuth client ID. Please try again.";
    case "auth/invalid-cert-hash":
      return "Invalid cert hash. Please try again.";
    case "auth/invalid-user-token":
      return "Invalid user token. Please try again.";
    case "auth/invalid-custom-token":
      return "Invalid custom token. Please try again.";
    case "auth/app-deleted":
      return "App deleted. Please try again.";
    case "auth/app-not-authorized":
      return "App not authorized. Please try again.";
    case "auth/argument-error":
      return "Argument error. Please try again.";
    case "auth/invalid-api-key":
      return "Invalid API key. Please try again.";
    case "auth/network-request-failed":
      return "Network request failed. Please try again.";
    case "auth/requires-recent-login":
      return "Requires recent login. Please try again.";
    case "auth/too-many-requests":
      return "Too many requests. Please try again.";
    case "auth/unauthorized-domain":
      return "Unauthorized domain. Please try again.";
    case "auth/user-token-expired":
      return "User token expired. Please try again.";
    case "auth/web-storage-unsupported":
      return "Web storage unsupported. Please try again.";
    case "auth/account-exists-with-different-credential":
      return "Account exists with different credential. Please try again.";
    case "auth/auth-domain-config-required":
      return "Auth domain config required. Please try again.";
    case "auth/cancelled-popup-request":
      return "Cancelled popup request. Please try again.";
    case "auth/credential-already-in-use":
      return "Credential already in use. Please try again.";
    case "auth/custom-token-mismatch":
      return "Custom token mismatch. Please try again.";
    case "auth/provider-already-linked":
      return "Provider already linked. Please try again.";
    case "auth/timeout":
      return "Timeout. Please try again.";
    case "auth/missing-android-pkg-name":
      return "Missing Android package name. Please try again.";
    case "auth/missing-ios-bundle-id":
      return "Missing iOS bundle ID. Please try again.";
    case "auth/invalid-dynamic-link-domain":
      return "Invalid dynamic link domain. Please try again.";
    case "auth/invalid-persistence-type":
      return "Invalid persistence type. Please try again.";
    case "auth/unsupported-persistence-type":
      return "Unsupported persistence type. Please try again.";
    case "auth/invalid-oauth-client-secret":
      return "Invalid OAuth client secret. Please try again.";
    case "auth/invalid-argument":
      return "Invalid argument. Please try again.";
    case "auth/invalid-creation-time":
      return "Invalid creation time. Please try again.";
    case "auth/invalid-disabled-field":
      return "Invalid disabled field. Please try again.";
    case "auth/invalid-display-name":
      return "Invalid display name. Please try again.";
    case "auth/invalid-email-verified":
      return "Invalid email verified. Please try again.";
    case "auth/invalid-hash-algorithm":
      return "Invalid hash algorithm. Please try again.";
    case "auth/invalid-hash-block-size":
      return "Invalid hash block size. Please try again.";
    case "auth/invalid-hash-derived-key-length":
      return "Invalid hash derived key length. Please try again.";
    case "auth/invalid-hash-key":
      return "Invalid hash key. Please try again.";
    case "auth/invalid-hash-memory-cost":
      return "Invalid hash memory cost. Please try again.";
    case "auth/invalid-hash-parallelization":
      return "Invalid hash parallelization. Please try again.";
    case "auth/invalid-hash-rounds":
      return "Invalid hash rounds. Please try again.";
    case "auth/invalid-hash-salt-separator":
      return "Invalid hash salt separator. Please try again.";
    case "auth/invalid-id-token":
      return "Invalid ID token. Please try again.";
    case "auth/invalid-last-sign-in-time":
      return "Invalid last sign in time. Please try again.";
    case "auth/invalid-page-token":
      return "Invalid page token. Please try again.";
    case "auth/invalid-password":
      return "Invalid password. Please try again.";
    case "auth/invalid-password-hash":
      return "Invalid password hash. Please try again.";
    case "auth/invalid-password-salt":
      return "Invalid password salt. Please try again.";
    case "auth/invalid-photo-url":
      return "Invalid photo URL. Please try again.";
    case "auth/invalid-provider-id":
      return "Invalid provider ID. Please try again.";
    case "auth/invalid-session-cookie-duration":
      return "Invalid session cookie duration. Please try again.";
    case "auth/invalid-uid":
      return "Invalid UID. Please try again.";
    case "auth/invalid-user-import":
      return "Invalid user import. Please try again.";
    case "auth/invalid-provider-data":
      return "Invalid provider data. Please try again.";
    case "auth/maximum-user-count-exceeded":
      return "Maximum user count exceeded. Please try again.";
    case "auth/missing-hash-algorithm":
      return "Missing hash algorithm. Please try again.";
    case "auth/missing-uid":
      return "Missing UID. Please try again.";
    case "auth/reserved-claims":
      return "Reserved claims. Please try again.";
    case "auth/session-cookie-revoked":
      return "Session cookie revoked. Please try again.";
    case "auth/uid-already-exists":
      return "UID already exists. Please try again.";
    case "auth/email-already-exists":
      return "Email already exists. Please try again.";
    case "auth/phone-number-already-exists":
      return "Phone number already exists. Please try again.";
    case "auth/project-not-found":
      return "Project not found. Please try again.";
    case "auth/insufficient-permission":
      return "Insufficient permission. Please try again.";
    case "auth/internal-error":
      return "Internal error. Please try again.";

    default:
      return "Oops! Something went wrong. Please try again later.";
  }
};
