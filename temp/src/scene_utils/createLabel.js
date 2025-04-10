export function createLabel() {
    const label = document.createElement('div');
    Object.assign(label.style, {
      position: 'absolute',
      padding: '4px 8px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      borderRadius: '4px',
      fontSize: '14px',
      pointerEvents: 'none',
      display: 'none',
      zIndex: '1000'
    });
    document.body.appendChild(label);
    return label;
  }
  