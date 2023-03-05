export const saveSVG = (
  svgString: string,
  fileType: string,
  fileName: string
) => {
  const svg = svgString;
  if (!svg) return;

  const blob = new Blob([svg], { type: fileType });

  const a = document.createElement("a");
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(":");
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () {
    URL.revokeObjectURL(a.href);
  }, 1500);
};
