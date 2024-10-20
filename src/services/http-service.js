function getErrorMessage(payload, fallbackMessage) {
  if (!payload) {
    return fallbackMessage;
  }

  if (typeof payload === "string") {
    return payload;
  }

  if (typeof payload.error?.message === "string") {
    return payload.error.message;
  }

  if (typeof payload.msg === "string") {
    return payload.msg;
  }

  return fallbackMessage;
}

export async function requestJson(url, options = {}, fallbackMessage) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : fallbackMessage);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, fallbackMessage));
  }

  return payload;
}
