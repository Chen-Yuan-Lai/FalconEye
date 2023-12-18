import crypto from 'crypto';

const genHash = data => {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest('base64');
};

export default genHash;
