export function computePasswordEntropy(password: string) {
  let charProbabilities = 0;

  if (password.match(/[^a-zA-Z0-9]/)) {
    charProbabilities += 32;
  }

  if (password.match(/[a-z]/)) {
    charProbabilities += 26;
  }

  if (password.match(/[A-Z]/)) {
    charProbabilities += 26;
  }

  if (password.match(/\d/)) {
    charProbabilities += 10;
  }

  return Math.log2(charProbabilities ** password.length);
}
