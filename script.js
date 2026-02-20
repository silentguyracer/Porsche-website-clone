document.addEventListener('DOMContentLoaded', () => {
    const modelGrid = document.getElementById('model-grid');

    // models is defined in models.js
    if (typeof models === 'undefined') {
        console.error('Models data not loaded!');
        return;
    }

    models.forEach(model => {
        const card = document.createElement('div');
        card.classList.add('model-card');

        // Make the whole card clickable or just the image/button
        // Here we make the image clickable as requested
        card.innerHTML = `
            <a href="${model.link}">
                <img src="${model.image}" alt="Porsche ${model.name}" class="model-image">
            </a>
            <div class="model-info">
                <h3>${model.name}</h3>
                <p>${model.description}</p>
                <a href="${model.link}" class="btn-secondary">Explore</a>
            </div>
        `;

        modelGrid.appendChild(card);
    });
});
