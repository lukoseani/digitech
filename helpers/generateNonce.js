
import crypto from 'crypto';

const generateNonce = function() {
  const nonceLength = 16;
  return crypto.randomBytes(nonceLength).toString('base64');
}

export default generateNonce;