const CONTRACT_ADDRESS = "Xgiftpump";

const copyBtn = document.getElementById("copy-ca");
const caText = document.getElementById("ca-text");

if (caText) {
  caText.textContent = CONTRACT_ADDRESS;
}

if (copyBtn && caText) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      copyBtn.classList.add("copied");
      const label = copyBtn.querySelector(".copy-label");
      const icon = copyBtn.querySelector(".copy-icon");
      if (label) label.textContent = "COPIED!";
      if (icon) icon.textContent = "✅";

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        if (label) label.textContent = "COPY";
        if (icon) icon.textContent = "📋";
      }, 2000);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(caText);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
}
