const navItems = document.querySelectorAll('.navlist__item');
const amenitiesCard = document.getElementById('amenitiesCard');
const apartmentsCard = document.getElementById('apartmentsCard');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(el => el.classList.remove('active'));
    item.classList.add('active');

    const text = item.textContent.trim();
    amenitiesCard.classList.add('hidden');
    apartmentsCard.classList.add('hidden');

    if (text === 'Amenities') {
      amenitiesCard.classList.remove('hidden');
    } else if (text === 'Apartments') {
      apartmentsCard.classList.remove('hidden');
    }
  });
});
