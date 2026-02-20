document.addEventListener('DOMContentLoaded', () => {
    // Get model ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const modelId = urlParams.get('model');

    if (!modelId || typeof models === 'undefined') {
        window.location.href = 'index.html'; // Redirect if clean or no data
        return;
    }

    // Find the model data
    // Note: models is defined in models.js
    const model = models.find(m => m.id === modelId || m.name.toLowerCase() === modelId.toLowerCase());
    // Also try to match name property if id property is missing in some previous version logic check
    // But we standardized it in models.js.

    // Actually, in models.js we used keys like "911", "taycan", etc. as IDs.
    // The filter above handles it. But let's be robust.
    // If we used array index-like logic previously, finding by name is safer.

    // In models.js:
    // { id: "911", name: "911", ... }

    const selectedModel = models.find(m => m.id === modelId);

    if (!selectedModel) {
        document.getElementById('detail-main').innerHTML = '<div class="container"><h1>Model Not Found</h1><a href="index.html" class="btn-primary">Return Home</a></div>';
        return;
    }

    const detailMain = document.getElementById('detail-main');
    detailMain.innerHTML = `
        <section class="detail-hero" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.8)), url('${selectedModel.image}');">
            <div class="detail-content container">
                <a href="index.html" class="back-btn">&larr; Back to all models</a>
                <div class="detail-header">
                    <div>
                        <h1>${selectedModel.name}</h1>
                        <p class="detail-subtitle" style="font-size: 1.5rem; color: #ccc;">${selectedModel.description}</p>
                    </div>
                    <div class="detail-price">
                        Starting at ${selectedModel.price}
                    </div>
                </div>
            </div>
        </section>

        <section class="container">
            <div class="specs-grid">
                <div class="spec-item">
                    <span class="spec-value">${selectedModel.specs.power}</span>
                    <span class="spec-label">Power (PS)</span>
                </div>
                <div class="spec-item">
                    <span class="spec-value">${selectedModel.specs.acceleration}</span>
                    <span class="spec-label">0-60 mph</span>
                </div>
                <div class="spec-item">
                    <span class="spec-value">${selectedModel.specs.topSpeed}</span>
                    <span class="spec-label">Top Speed</span>
                </div>
            </div>
        </section>
        
        <!-- 360 Animation Banner -->
        <section style="padding: 2rem 5%; text-align: center;">
            <a href="3d-scroll.html" style="
                display: inline-flex;
                align-items: center;
                gap: 1rem;
                padding: 1.5rem 3rem;
                background: linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04));
                border: 1px solid rgba(212,175,55,0.35);
                border-radius: 8px;
                text-decoration: none;
                color: #D4AF37;
                font-size: 1rem;
                letter-spacing: 3px;
                text-transform: uppercase;
                font-weight: 600;
                transition: all 0.3s;
                width: 100%;
                max-width: 700px;
                margin: 0 auto;
                justify-content: center;
            "
            onmouseover="this.style.background='linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.08))'; this.style.boxShadow='0 0 40px rgba(212,175,55,0.2)'; this.style.transform='translateY(-2px)'"
            onmouseout="this.style.background='linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))'; this.style.boxShadow='none'; this.style.transform='translateY(0)'"
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 8v4l3 3"/><path d="M16 2l4 4-4 4"/></svg>
                360° Scroll Animation — See Top, Side &amp; Underbody
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
        </section>

        <section class="container" style="padding: 2rem 5%; text-align: center; display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            <a href="3d-model.html?model=${selectedModel.id}" class="btn-primary" style="background: var(--primary-color); border-color: var(--primary-color);">View in 3D</a>
            <a href="#" class="btn-primary">Build Your Own</a>
        </section>
    `;
});
