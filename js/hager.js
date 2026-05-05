function setView(viewType) {
  const container = document.getElementById('wishlist-container');
  if (!container) return;

  document.querySelectorAll('[data-view-button]').forEach(button => {
    button.classList.toggle('active', button.dataset.viewButton === viewType);
  });

  container.className = 'grid-container';
  const cards = container.querySelectorAll('.card');
  cards.forEach(card => {
    const desc = card.querySelector('.course-desc');
    if (desc) desc.style.display = 'none';
  });

  if (viewType === 'list') {
    container.classList.add('view-list');
  } else if (viewType === 'details') {
    cards.forEach(card => {
      const desc = card.querySelector('.course-desc');
      if (desc) desc.style.display = 'block';
    });
  }
}
