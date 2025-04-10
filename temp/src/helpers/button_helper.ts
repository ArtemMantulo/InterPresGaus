import { Console } from 'console';
import * as THREE from 'three';

export const BLACK_BUTTON_COLORS = {
  buttonName: 'Dark',
  backgroundColor: '#222',
  textColor: '#FFFFFF',
  hoverColor: '#444',
};

export const GREY_BUTTON_COLORS = {
  buttonName: 'Grey',
  backgroundColor: '#EAEAEA', // Light grey
  textColor: '#000000', // Black text
  hoverColor: '#D6D6D6', // Slightly darker grey
};


function animateCameraTo(camera, controls, newPosition, target) {
  const duration = 1000; // Animation duration in milliseconds
  const start = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
  const end = { x: newPosition[0], y: newPosition[1], z: newPosition[2] };
  const delta = { x: end.x - start.x, y: end.y - start.y, z: end.z - start.z };
  const startTime = performance.now();

  function step() {
    const currentTime = performance.now();
    const elapsed = Math.min((currentTime - startTime) / duration, 1);

    camera.position.set(
      start.x + delta.x * elapsed,
      start.y + delta.y * elapsed,
      start.z + delta.z * elapsed
    );

    if (controls) controls.target.set(...target);

    if (elapsed < 1) {
      requestAnimationFrame(step);
    } else {
      camera.position.set(end.x, end.y, end.z);
      if (controls) controls.update();
    }
  }

  step();
}

export function createMoveButton(reducedDistance, title, subtitle, position, target, buttonContainer, camera, controls, animateCameraTo) {
  console.log('createMoveButton called'); // Debugging
  const button = document.createElement('div');
  button.style.display = 'flex';
  button.style.flexDirection = 'column';
  button.style.alignItems = 'flex-start';
  button.style.padding = '10px 15px';
  button.style.marginBottom = '10px';
  button.style.background = 'rgba(0, 0, 0, 0.7)';
  button.style.color = 'white';
  button.style.border = '1px solid rgba(255, 255, 255, 0.5)';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.transition = 'transform 0.2s ease, background 0.3s ease';

  // Add hover effect (use JavaScript for event listeners)
  button.addEventListener('mouseover', () => {
    button.style.transform = 'scale(1.05)';
    button.style.background = 'rgba(0, 0, 0, 0.9)';
  });
  button.addEventListener('mouseout', () => {
    button.style.transform = 'scale(1)';
    button.style.background = 'rgba(0, 0, 0, 0.7)';
  });

  const titleElement = document.createElement('div');
  titleElement.style.fontSize = '16px';
  titleElement.style.fontWeight = 'bold';
  titleElement.innerText = title;
  button.appendChild(titleElement);

  const subtitleElement = document.createElement('div');
  subtitleElement.style.fontSize = '12px';
  subtitleElement.style.color = 'rgba(255, 255, 255, 0.7)';
  subtitleElement.innerText = subtitle;
  button.appendChild(subtitleElement);

  button.onclick = () => {
    const targetVector = new THREE.Vector3(...target);
    const positionVector = new THREE.Vector3(...position);
    const direction = positionVector.clone().sub(targetVector).normalize();

    const closerPosition = targetVector.clone().add(direction.multiplyScalar(reducedDistance));
    animateCameraTo(camera, controls, [closerPosition.x, closerPosition.y, closerPosition.z], target);
  };

  buttonContainer.appendChild(button);
}

export function createRedirectButton(label, url, container) {
  if (!(container instanceof HTMLElement)) {
    console.error('Invalid container:', container);
    return;
  }

  const button = document.createElement('button');
  button.textContent = label; // ✅ Set label correctly
  button.style.display = 'inline-block';
  button.style.padding = '10px 15px';
  button.style.marginBottom = '10px';
  button.style.background = 'rgba(0, 0, 0, 0.7)';
  button.style.color = 'white';
  button.style.border = '1px solid rgba(255, 255, 255, 0.5)';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.transition = 'transform 0.2s ease, background 0.3s ease';
  button.style.fontSize = '16px';
  button.style.textAlign = 'center';

  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#45a049';
    button.style.transform = 'scale(1.05)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    button.style.transform = 'scale(1)';
  });

  button.addEventListener('click', () => {
    window.location.href = url;
  });

  container.appendChild(button);
}

export function createGoToPreviousPageButton(label, url="back", container) {
  if (!(container instanceof HTMLElement)) {
    console.error('Invalid container:', container);
    return;
  }

  const button = document.createElement('button');
  button.textContent = label; // ✅ Set label correctly
  button.style.display = 'inline-block';
  button.style.padding = '10px 15px';
  button.style.marginBottom = '10px';
  button.style.background = 'rgba(0, 0, 0, 0.7)';
  button.style.color = 'white';
  button.style.border = '1px solid rgba(255, 255, 255, 0.5)';
  button.style.borderRadius = '5px';
  button.style.cursor = 'pointer';
  button.style.transition = 'transform 0.2s ease, background 0.3s ease';
  button.style.fontSize = '16px';
  button.style.textAlign = 'center';

  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = '#45a049';
    button.style.transform = 'scale(1.05)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    button.style.transform = 'scale(1)';
  });

  button.addEventListener('click', () => {
    if (url === 'back') {
      // ✅ Navigate back to the previous page
      console.log("Go to Previous Page!")
      history.back();
    } else {
      window.location.href = url;
    }
  });

  container.appendChild(button);
}

// ✅ Create and add loading image
export const createLoadingImage = (src) => {
  const loadingImage = document.createElement('img');
  loadingImage.src = src;
  loadingImage.style.position = 'absolute';
  loadingImage.style.top = '0';
  loadingImage.style.left = '0';
  loadingImage.style.width = '100vw';
  loadingImage.style.height = '100vh';
  loadingImage.style.objectFit = 'cover';
  loadingImage.style.zIndex = '1000';
  loadingImage.style.transition = 'opacity 1s ease';

  document.body.appendChild(loadingImage);
  return loadingImage;
};

// ✅ Create and add start button
export const createStartButton = (imageUrl: string, onClick: () => void) => {
  const startButton = document.createElement('button');

  // ✅ Initial styles (hidden initially)
  Object.assign(startButton.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    zIndex: '1000', // Keep consistent with the image's z-index
    backgroundColor: 'transparent',
    display: 'none', // Keep hidden until the image is loaded
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none', // Disable until visible
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)', // Более насыщенная тень
    filter: 'brightness(1.2) contrast(1.2)', // Увеличиваем насыщенность и контрастность
    backdropFilter: 'blur(20px)', // ✅ Размытие фона
    WebkitBackdropFilter: 'blur(20px)', // Для поддержки в Safari
  });

  // ✅ Preload the background image
  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    startButton.style.backgroundImage = `url(${imageUrl})`;
    startButton.style.display = 'block'; // Show after loading
    startButton.style.opacity = '1';
    startButton.style.pointerEvents = 'auto'; // Enable clicks after loading
  };

  img.onerror = () => {
    console.error(`Failed to load image: ${imageUrl}`);
  };

  // ✅ Hover effect
  startButton.addEventListener('mouseover', () => {
    startButton.style.opacity = '0.8';
  });

  startButton.addEventListener('mouseout', () => {
    startButton.style.opacity = '1';
  });

  // ✅ Handle click
  startButton.addEventListener('click', onClick);

  document.body.appendChild(startButton);

  return startButton;
};


// ✅ Create and add second image
export const createSecondImage = (src) => {
  const secondImage = document.createElement('img');
  secondImage.src = src;

  // ✅ Center the second image and set it to 50% of screen size
  secondImage.style.position = 'fixed';
  secondImage.style.top = '50%';
  secondImage.style.left = '50%';
  secondImage.style.width = '50vw'; // 50% of viewport width
  secondImage.style.height = '50vh'; // 50% of viewport height
  secondImage.style.transform = 'translate(-50%, -50%)';
  secondImage.style.objectFit = 'cover';
  secondImage.style.zIndex = '1000';
  secondImage.style.transition = 'opacity 1s ease';
  secondImage.style.display = 'none';

  // ✅ Styling improvements
  secondImage.style.borderRadius = '12px';
  secondImage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  secondImage.style.cursor = 'pointer';

  document.body.appendChild(secondImage);
  return secondImage;
};

export const createCustomLoader = () => {
  const loaderContainer = document.createElement('div');
  loaderContainer.style.position = 'fixed';
  loaderContainer.style.bottom = '0'; // Align to the very bottom
  loaderContainer.style.left = '0';
  loaderContainer.style.width = '100%';
  loaderContainer.style.height = '4px';
  loaderContainer.style.backgroundColor = '#444444';
  loaderContainer.style.zIndex = '9999';

  const loaderBar = document.createElement('div');
  loaderBar.style.width = '0%';
  loaderBar.style.height = '100%';
  loaderBar.style.backgroundColor = '#FFFFFF';
  loaderBar.style.transition = 'width 0.2s ease'; // Faster update for smoother effect

  loaderContainer.appendChild(loaderBar);
  document.body.appendChild(loaderContainer);

  return { loaderContainer, loaderBar };
};

type ButtonColors = {
  buttonName: string,
  backgroundColor: string;
  textColor: string;
  hoverColor: string;
};

export const createNavigationButton = (
  container: HTMLElement,
  buttonName: string,
  disabled: boolean = false,
  colors: typeof BLACK_BUTTON_COLORS | typeof GREY_BUTTON_COLORS,
  url?: string,
) => {
  const button = document.createElement('button');
  button.innerText = buttonName;
  button.style.minWidth = '88px';
  button.style.padding = '8px 16px';
  button.style.borderRadius = '24px';
  button.style.backgroundColor = colors.backgroundColor;
  button.style.color = colors.textColor;
  button.style.border = 'none';
  button.style.transition = 'background-color 0.3s ease, transform 0.2s ease';

  // ✅ Общие стили для всех кнопок
  button.style.fontSize = '14px';
  button.style.fontStyle = 'normal';
  button.style.lineHeight = 'normal';
  button.style.font = 'Inter';

  // ✅ Устанавливаем font-weight в зависимости от цвета фона
  if (colors.buttonName === 'Dark') {
    button.style.fontWeight = '600'; // Черная кнопка - жирный текст
  } else if (colors.buttonName === 'Grey') {
    button.style.fontWeight = '400'; // Серая кнопка - обычный текст
  }

  if (disabled) {
    button.style.cursor = 'not-allowed';
    button.disabled = true;
    button.style.pointerEvents = 'none';
    button.style.opacity = '1';
    button.style.filter = 'none';

    // ✅ Ховер для заблокированной кнопки
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = colors.hoverColor;
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = colors.backgroundColor;
    });
  } else {
    button.style.cursor = 'pointer';

    // ✅ Ховер эффект
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = colors.hoverColor;
    });

    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = colors.backgroundColor;
    });

    // ✅ Клик по кнопке
    if (url) {
      button.addEventListener('click', () => {
        window.location.href = url;
      });
    }
  }

  container.appendChild(button);
};


/////////////////////////////////////////

// Метод для создания кнопки плюса/минуса
export const createZoomButton = (
  container: HTMLElement,
  buttonType: 'zoom-in' | 'zoom-out',
  colors: ButtonColors,
  url?: string
) => {
  const button = document.createElement('button');

  // Устанавливаем картинку в зависимости от типа кнопки
  const img = document.createElement('img');
  if (buttonType === 'zoom-in') {
    img.src = '/assets/Zoom_in_button.png'; 
  } else if (buttonType === 'zoom-out') {
    img.src = '/assets/Zoom_out_button.png'; 
  }

  img.alt = buttonType === 'zoom-in' ? 'Zoom In' : 'Zoom Out';
  img.style.width = '35px';  // Можно изменить размер иконки
  img.style.height = '35px';
  img.style.transition = 'transform 0.2s ease'; // Анимация для увеличения

  button.style.display = 'flex';
  button.style.width = '40px';
  button.style.height = '40px';
  button.style.justifyContent = 'center';
  button.style.alignItems = 'center';
  button.style.gap = '4px';
  button.style.flexShrink = '0';
  button.style.borderRadius = '40px';
  button.style.backgroundColor = colors.backgroundColor;
  button.style.color = colors.textColor;
  button.style.border = 'none';
  button.style.fontSize = '24px';
  button.style.fontWeight = 'bold';
  button.style.transition = 'background-color 0.3s ease, transform 0.2s ease';
  button.style.cursor = 'pointer';

  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = colors.hoverColor;
    img.style.transform = 'scale(1.2)'; // Увеличиваем картинку
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = colors.backgroundColor;
    img.style.transform = 'scale(1)'; // Возвращаем исходный размер картинки
  });

  if (url) {
    button.addEventListener('click', () => {
      window.location.href = url;
    });
  }

  // Добавляем изображение в кнопку
  button.appendChild(img);

  // Добавляем кнопку в контейнер
  document.body.appendChild(button);
button.style.position = 'fixed'; // Используем fixed, чтобы кнопка оставалась на месте
button.style.bottom = '32px'; // Сохраняем кнопку на 32 пикселя выше нижнего края
const mediaQuery = window.matchMedia('(max-width: 768px)');

// Функция для установки позиции кнопки
function updateButtonPosition() {
  console.log("We made it")
  console.log("We made it:" + mediaQuery.matches )
  if (mediaQuery.matches) {
    button.style.left = `calc(44% + ${container.offsetWidth / 2 + 10}px)`; // Для маленьких экранов
  } else {
    button.style.left = `calc(48% + ${container.offsetWidth / 2 + 10}px)`; // Для больших экранов
  }
}

// Вызываем сразу после загрузки
  updateButtonPosition();

// Добавляем обработчик изменения размера
    mediaQuery.addEventListener('change', updateButtonPosition);
};