function setView(viewType) {
  const container = document.getElementById('wishlist-container');
  if (!container) return;

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

function validateForm(event, formId) {
  event.preventDefault(); 
  const form = document.getElementById(formId);
  if (!form) return;

  let isValid = true;
  const errors = form.querySelectorAll('.error-msg');
  errors.forEach(err => err.style.display = 'none');
  
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    if (input.hasAttribute('required') && input.value.trim() === '') {
      showError(input, "This field is required.");
      isValid = false;
    }
    
    if (input.type === 'email' && input.value.trim() !== '') {
      if (!input.value.includes('@') || !input.value.includes('.')) {
        showError(input, "Please enter a valid email address.");
        isValid = false;
      }
    }
  });
  
  if (isValid) {

    if (formId === 'loginForm') {
      const roleSelect = document.getElementById('roleSelect');
      const role = roleSelect ? roleSelect.value : 'student';
      if (role === 'student') window.location.href = 'dashboard-student.html';
      else window.location.href = 'dashboard-student.html';
    } else {
      alert('Form submitted successfully!');
      form.reset();
    }
  }
}

function showError(inputElement, message) {
  let errorSpan = inputElement.nextElementSibling;
  if (!errorSpan || !errorSpan.classList.contains('error-msg')) {
    errorSpan = inputElement.parentElement.querySelector('.error-msg');
  }
  
  if (errorSpan) {
    errorSpan.innerText = message;
    errorSpan.style.display = 'block';
  }
}
