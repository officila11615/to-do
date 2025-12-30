// static/js/script.js
document.addEventListener('DOMContentLoaded', function () {
    // 1. Notification Permission
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }

    // 2. Custom Cursor Logic
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-glow');
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorGlow);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Dot follows instantly
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Glow follows with lag (Lerp)
    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.15;
        cursorY += dy * 0.15;

        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .task, #toggleFormBtn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hovering');
            cursorGlow.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hovering');
            cursorGlow.classList.remove('hovering');
        });
    });

    // 3. Task Due Date Highlight Logic
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        const dateEl = task.querySelector('strong');
        if (dateEl) {
            const dueDate = dateEl.textContent.replace('Due: ', '');
            const today = new Date();
            const taskDate = new Date(dueDate);

            if (taskDate < today) {
                task.classList.add('overdue');
            } else if (taskDate - today < 24 * 60 * 60 * 1000) { // 24 hours
                task.classList.add('due-soon');
            }
        }
    });

    // 4. Form Toggle Logic
    const toggleBtn = document.getElementById('toggleFormBtn');
    const formContainer = document.getElementById('formContainer');

    if (toggleBtn && formContainer) {
        toggleBtn.addEventListener('click', function () {
            formContainer.classList.toggle('active');
            if (formContainer.classList.contains('active')) {
                toggleBtn.textContent = '❌ Close Form';
                toggleBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)';
            } else {
                toggleBtn.textContent = '➕ Add New Task';
                toggleBtn.style.background = 'linear-gradient(135deg, #f72585 0%, #7209b7 100%)';
            }
        });
    }
});
