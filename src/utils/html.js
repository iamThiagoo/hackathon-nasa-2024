const allowedTags = new Set(["A", "BR", "H1", "LI", "P", "STRONG", "UL"]);
const allowedProtocols = new Set(["http:", "https:"]);

export function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function stripCodeFences(value) {
  return value
    .replace(/^```(?:html)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function isSafeLink(href) {
  try {
    const url = new URL(href, window.location.origin);
    return allowedProtocols.has(url.protocol);
  } catch {
    return false;
  }
}

function sanitizeNode(node, ownerDocument) {
  if (node.nodeType === Node.TEXT_NODE) {
    return ownerDocument.createTextNode(node.textContent ?? "");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  if (!allowedTags.has(node.tagName)) {
    const fragment = ownerDocument.createDocumentFragment();

    node.childNodes.forEach((childNode) => {
      const sanitizedChild = sanitizeNode(childNode, ownerDocument);

      if (sanitizedChild) {
        fragment.appendChild(sanitizedChild);
      }
    });

    return fragment;
  }

  const cleanElement = ownerDocument.createElement(node.tagName.toLowerCase());

  if (node.tagName === "A") {
    const href = node.getAttribute("href");

    if (href && isSafeLink(href)) {
      cleanElement.setAttribute("href", href);
      cleanElement.setAttribute("rel", "noopener noreferrer");
      cleanElement.setAttribute("target", "_blank");
    }
  }

  node.childNodes.forEach((childNode) => {
    const sanitizedChild = sanitizeNode(childNode, ownerDocument);

    if (sanitizedChild) {
      cleanElement.appendChild(sanitizedChild);
    }
  });

  return cleanElement;
}

export function sanitizeGeneratedHtml(value) {
  const parser = new DOMParser();
  const parsedDocument = parser.parseFromString(
    `<body>${stripCodeFences(value)}</body>`,
    "text/html"
  );
  const container = document.createElement("div");

  parsedDocument.body.childNodes.forEach((childNode) => {
    const sanitizedChild = sanitizeNode(childNode, document);

    if (sanitizedChild) {
      container.appendChild(sanitizedChild);
    }
  });

  return container.innerHTML.trim();
}
