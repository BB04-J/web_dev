document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('togglebtn');
    const sidebar = document.getElementById('sidebar');
    const colorPanel = document.getElementById('color-panel');
    const openPopup = document.getElementById('openPopup');
    const popup = document.getElementById('popup');
    const colorPicker = document.getElementById('colorPicker');
    const previewColor = document.getElementById('previewColor');
    const addColor = document.getElementById('addColor');
    const cancel = document.getElementById('cancel');
    const colorNameInput = document.getElementById('colorName');
    const body = document.body;

    // Default colors 
    let colors = [
        { value: '#ff0000', name: 'Red' },
        { value: '#00ff00', name: 'Green' },
        { value: '#0000ff', name: 'Blue' },
        { value: '#ffff00', name: 'Yellow' },
        { value: '#ff00ff', name: 'Magenta' },
        { value: '#00ffff', name: 'Cyan' }
    ];

    // Load custom colors from localStorage
    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
        const customColors = JSON.parse(savedColors);
        colors = colors.concat(customColors);
    }

    // Function to create color buttons
    function createColorButtons() {
        colorPanel.innerHTML = '';
        colors.forEach((color, index) => {
            const btnContainer = document.createElement('div');
            btnContainer.className = 'color-btn-container';

            const btn = document.createElement('button');
            btn.className = 'color-btn';
            btn.style.backgroundColor = color.value;
            btn.textContent = color.name;
            btn.addEventListener('click', () => {
                body.style.backgroundColor = color.value;
            });

            btnContainer.appendChild(btn);

            // Add delete button for custom colors (index >= 6)
            if (index >= 6) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = '×';
                deleteBtn.addEventListener('click', () => {
                    colors.splice(index, 1);
                    localStorage.setItem('customColors', JSON.stringify(colors.slice(6)));
                    createColorButtons();
                });
                btnContainer.appendChild(deleteBtn);
            }

            colorPanel.appendChild(btnContainer);
        });
    }

    // Initial render
    createColorButtons();

    // Toggle sidebar
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Open popup
    openPopup.addEventListener('click', () => {
        popup.classList.add('active');
    });

    // Preview color
    previewColor.addEventListener('click', () => {
        const selectedColor = colorPicker.value;
        body.style.backgroundColor = selectedColor;
    });

    // Add color
    addColor.addEventListener('click', () => {
        const selectedColor = colorPicker.value;
        const colorName = colorNameInput.value.trim() || selectedColor.toUpperCase();
        if (!colors.some(c => c.value === selectedColor)) {
            colors.push({ value: selectedColor, name: colorName });
            localStorage.setItem('customColors', JSON.stringify(colors.slice(6)));
            createColorButtons();
        }
        popup.classList.remove('active');
    });

    // Cancel
    cancel.addEventListener('click', () => {
        popup.classList.remove('active');
    });
});