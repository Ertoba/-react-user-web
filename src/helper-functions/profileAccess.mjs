// A guest checkout ID is not an authenticated customer session.
// Public routes can still permit guests, but /profile requires a real token.
export const mayAccessRoute = ({ token, guestId, requireToken = false }) =>
  requireToken ? Boolean(token) : Boolean(token || guestId);
