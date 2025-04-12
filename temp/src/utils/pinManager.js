import gsap from 'gsap';

const amenitiesCard = document.getElementById('amenitiesCard');
const amenitiesContent = document.getElementById('amenitiesCardContent');

// === Плавный перелёт камеры ===
function flyTo(camera, controls, targetPosition) {
  const from = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
    tx: controls.target.x,
    ty: controls.target.y,
    tz: controls.target.z,
  };

  const to = {
    x: targetPosition.x + 2,
    y: targetPosition.y + 1.5,
    z: targetPosition.z + 2,
    tx: targetPosition.x,
    ty: targetPosition.y,
    tz: targetPosition.z,
  };

  gsap.to(from, {
    duration: 2.5,
    ease: 'power2.inOut',
    x: to.x,
    y: to.y,
    z: to.z,
    tx: to.tx,
    ty: to.ty,
    tz: to.tz,
    onUpdate: () => {
      camera.position.set(from.x, from.y, from.z);
      controls.target.set(from.tx, from.ty, from.tz);
      controls.update();
    },
  });
}

// === Создание одного пина ===
export function createPin(labelText, iconSrc) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('pin-wrapper');
  wrapper.style.position = 'absolute';
  wrapper.style.zIndex = '1000';
  wrapper.style.display = 'none';
  wrapper.style.pointerEvents = 'auto';
  wrapper.style.transition = 'transform 0.2s ease';
  wrapper.style.transformOrigin = 'center center';

  const container = document.createElement('div');
  container.style.display = 'inline-flex';
  container.style.alignItems = 'center';
  container.style.height = '27px';
  container.style.background = 'rgba(0, 0, 0, 0.55)';
  container.style.borderRadius = '18px';
  container.style.paddingRight = '12px';
  container.style.color = '#fff';
  container.style.font = 'sans-serif';
  container.style.fontSize = '14px';
  container.style.lineHeight = '1';
  container.style.position = 'relative';

  const icon = document.createElement('img');
  icon.src = iconSrc;
  icon.style.width = '27px';
  icon.style.height = '27px';
  icon.style.borderRadius = '50%';
  icon.style.padding = '4px';

  icon.style.position = 'absolute';
  icon.style.left = '-4px';
  icon.style.top = '50%';
  icon.style.transform = 'translateY(-50%)';
  icon.style.zIndex = '1';

  const label = document.createElement('span');
  label.innerText = labelText;
  label.style.marginLeft = '32px';

  wrapper.addEventListener('mouseenter', () => {
    wrapper.style.transform = 'scale(1.1)';
  });

  wrapper.addEventListener('mouseleave', () => {
    wrapper.style.transform = 'scale(1)';
  });

  container.appendChild(label);
  container.appendChild(icon);
  wrapper.appendChild(container);
  document.body.appendChild(wrapper);

  return wrapper;
}

// === Привязка позиции DOM-элемента к 3D-позиции ===
export function trackPinTo3D(pinEl, worldPosition, camera, renderer) {
  const projected = worldPosition.clone().project(camera);
  const rect = renderer.domElement.getBoundingClientRect();

  const isVisible =
    projected.x >= -1 &&
    projected.x <= 1 &&
    projected.y >= -1 &&
    projected.y <= 1 &&
    projected.z >= 0 &&
    projected.z <= 1;

  if (!isVisible) {
    pinEl.style.display = 'none';
    return;
  }

  const x = (projected.x * 0.5 + 0.5) * rect.width + rect.left;
  const y = (1 - (projected.y * 0.5 + 0.5)) * rect.height + rect.top;

  pinEl.style.left = `${x - pinEl.offsetWidth / 2}px`;
  pinEl.style.top = `${y - pinEl.offsetHeight}px`;
  pinEl.style.display = 'block';
}

// === Инициализация всех пинов ===
export function initializePins(pinData, camera, renderer, controls) {
  const allPins = pinData.map(({ label, icon, position, description }) => {
    const el = createPin(label, icon);

    // 🚀 Клик по пину -> камера летит к нему
    el.addEventListener('click', () => {
      flyTo(camera, controls, position);

      amenitiesContent.innerHTML = '';

      const title = document.createElement('h3');
      title.textContent = label;

      const descr = document.createElement('span');
      descr.textContent = description;

      amenitiesContent.appendChild(title);
      amenitiesContent.appendChild(descr);

      amenitiesCard.classList.remove('hidden');
    });
    return { el, position };
  });

  function animatePins() {
    requestAnimationFrame(animatePins);
    allPins.forEach(({ el, position }) => {
      trackPinTo3D(el, position, camera, renderer);
    });
  }

  animatePins();
}

export function clearPins() {
  const pinElements = document.querySelectorAll('.pin-wrapper');
  pinElements.forEach(pin => pin.remove());
}
