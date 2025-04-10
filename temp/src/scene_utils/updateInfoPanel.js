export function updateInfoPanel(textElement, floorNum) {
    textElement.innerHTML = `
      <strong>Info for Floor ${floorNum}</strong><br>
      • Offices: ${floorNum * 2}<br>
      • People: ${floorNum * 5}<br>
      • Elevators: ${floorNum % 3 + 1}
    `;
  }
  