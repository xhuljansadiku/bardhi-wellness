  document.getElementById('btnLogout')?.addEventListener('click', (e)=>{
    e.preventDefault();
    // pas backend-it: hiq tokenin/sessionin
    localStorage.removeItem('authToken');
    // opsionalisht hiq çdo pending order
    localStorage.removeItem('pendingOrder');
    location.href = 'index.html';
  });
