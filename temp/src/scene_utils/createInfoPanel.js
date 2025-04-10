export function createInfoPanel() {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '180px',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      display: 'none',
      zIndex: '1001',
      fontFamily: 'sans-serif',
      background: 'transparent'
    });
  
    const photo = document.createElement('div');
    Object.assign(photo.style, {
      height: '120px',
      backgroundImage: 'url(https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    });
  
    const text = document.createElement('div');
    Object.assign(text.style, {
      background: 'rgba(0, 0, 0, 0.65)',
      color: 'white',
      padding: '12px',
      fontSize: '14px',
      lineHeight: '1.4'
    });
  
    panel.append(photo, text);
    document.body.appendChild(panel);
  
    panel.textSection = text; // reference for updates
    return panel;
  }