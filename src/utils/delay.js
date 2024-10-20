export function delay(durationInMilliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationInMilliseconds);
  });
}
