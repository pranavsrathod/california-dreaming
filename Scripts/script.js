// ===== Trip Experiences → Stop Sections =====
fetch('tripData.json')
    .then(res => res.json())
    .then(data => {
        if (!data.tripExperiences) return;

        const renderStopCard = (elId, exp, accentColor) => {
            const el = document.getElementById(elId);
            if (!el) return;

            const card = document.createElement('div');
            card.className = `bg-[#1f3d28]/60 border border-[#3a5e42]/50 rounded-2xl p-4`;

            card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <p class="font-semibold text-white">${exp.name}</p>
                ${exp.mustDo ? '<span class="text-xs bg-orange-500 px-2 py-1 rounded-full font-bold">MUST</span>' : ''}
            </div>
            <p class="text-xs text-slate-400 mb-2">${exp.type || ''}${exp.intensity ? ' · ' + exp.intensity : ''}</p>
            ${exp.notes ? `<p class="text-sm text-slate-300 mb-3 leading-relaxed">${exp.notes}</p>` : ''}
            ${exp.map ? `
                <div class="flex justify-end mt-3">
                    <a href="${exp.map}" target="_blank"
                        class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-${accentColor}-500/20 text-${accentColor}-400 border border-${accentColor}-500/30 hover:bg-${accentColor}-500 hover:text-white transition duration-300">
                        <i class="fa-solid fa-location-dot"></i>
                        Open in Maps
                    </a>
                </div>
            ` : ''}
            `;

            el.appendChild(card);
        };

        data.tripExperiences.forEach(exp => {
            const location = (exp.location || '').toLowerCase();

            // Big Sur
            if (location.includes('big sur') || location.includes('carmel')) {
                renderStopCard('bigSurSuggestions', exp, 'orange');
            }

            // Yosemite scenic day (no "hike" in location)
            if (location.includes('yosemite') && !location.includes('hike')) {
                renderStopCard('yosemiteDay1Suggestions', exp, 'green');
            }

            // Yosemite hike day
            if (location.includes('yosemite') && location.includes('hike')) {
                renderStopCard('yosemiteHikeSuggestions', exp, 'green');
            }

            // St Helena / Napa
            if (location.includes('helena') || location.includes('napa')) {
                renderStopCard('stHelenaSuggestions', exp, 'purple');
            }
        });

        // ===== Food Cards =====
        const container = document.getElementById('foodSpotsContainer');
        if (!data.laSpots || !container || data.laSpots.length === 0) {
            if (container) {
                container.innerHTML = `
                <div class="col-span-full text-center py-16 text-slate-400">
                    <i class="fa-solid fa-utensils text-4xl mb-4 opacity-30"></i>
                    <p class="text-lg font-semibold">Food details coming soon</p>
                    <p class="text-sm mt-2">Fill in the Food section of trip_recap.txt</p>
                </div>`;
            }
            return;
        }

        const sortedSpots = [...data.laSpots].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

        sortedSpots.forEach(place => {
            const card = document.createElement('div');
            card.className = "bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-orange-100 flex flex-col justify-between";

            card.innerHTML = `
            <div>
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-2xl font-bold">${place.name}</h3>
                    ${place.priority === 1 ? '<span class="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-bold">HIGHLIGHT</span>' : ''}
                </div>
                ${place.category ? `<p class="text-sm uppercase tracking-wider text-slate-400 mb-2">${place.category}</p>` : ''}
                ${place.mustTry ? `<p class="text-orange-600 font-semibold mb-3">Must Try: ${place.mustTry}</p>` : ''}
                <p class="text-slate-600 mb-6">${place.notes ?? ''}</p>
            </div>
            ${place.map ? `
            <a href="${place.map}" target="_blank" rel="noopener noreferrer"
                class="mt-auto inline-block text-center bg-orange-500 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition">
                Open in Maps
            </a>
            ` : ''}
            `;

            container.appendChild(card);
        });
    })
    .catch(err => console.error('Failed to load tripData.json', err));


// ===== Route Section Rendering =====
fetch('routeData.json')
    .then(res => res.json())
    .then(data => {
        if (!data.routes || !data.routes.length) return;

        const container = document.getElementById('routesContainer');
        if (!container) return;

        const route = data.routes[0];

        const complexityStyle =
            route.summary.complexity === 'Low'    ? { border: 'border-green-400',  pill: 'bg-green-100 text-green-700' } :
            route.summary.complexity === 'Moderate' ? { border: 'border-orange-400', pill: 'bg-orange-100 text-orange-700' } :
                                                      { border: 'border-red-400',    pill: 'bg-red-100 text-red-700' };

        const section = document.createElement('div');
        section.className = `
            bg-white rounded-3xl shadow-xl border-t-4 ${complexityStyle.border}
            border-l border-r border-b border-slate-200
            p-10 md:p-14 space-y-8
        `;

        section.innerHTML = `
            <div>
                <h3 class="text-3xl md:text-4xl font-bold mb-3">${route.name}</h3>
                ${route.flightLogic ? `<p class="text-sm uppercase tracking-widest text-slate-400">${route.flightLogic}</p>` : ''}
                ${route.notes ? `<p class="text-slate-500 max-w-3xl mt-4 leading-relaxed">${route.notes}</p>` : ''}
            </div>

            <div class="flex flex-wrap gap-8 items-end">
                <div>
                    <p class="text-xs uppercase tracking-widest text-slate-400 mb-1">Miles Driven</p>
                    <p class="text-6xl md:text-7xl font-black text-orange-500 leading-none">
                        ${route.summary.distanceMiles.toLocaleString()}
                    </p>
                </div>
                <div>
                    <p class="text-xs uppercase tracking-widest text-slate-400 mb-1">Behind the Wheel</p>
                    <p class="text-6xl md:text-7xl font-black text-[#4d7358] leading-none">
                        ${route.summary.driveHours}h
                    </p>
                </div>
                <div>
                    <span class="px-5 py-2 rounded-full text-sm font-bold ${complexityStyle.pill}">
                        ${route.summary.complexity} Complexity
                    </span>
                </div>
            </div>
        `;

        container.appendChild(section);
    })
    .catch(err => console.error('Failed to load routeData.json', err));


// ===== Budget Section Rendering =====
fetch('routeData.json')
    .then(res => res.json())
    .then(data => {
        if (!data.routes || !data.routes.length) return;

        const budget = data.routes[0].budget;
        if (!budget) return;

        const container = document.getElementById('spendCardsContainer');
        if (!container) return;

        const items = [
            { label: 'Car Rental',     value: `$${budget.carRental}`,     sub: '5 days · 2026 Lincoln Nautilus', color: '#f97316' },
            { label: 'Accommodation',  value: `~$${budget.accommodation}`, sub: 'per person',                     color: '#4d7358' },
            { label: 'Wine Passport',  value: `$${budget.winePassport}`,   sub: 'per person · 4 vineyards',       color: '#7c3aed' },
            { label: 'Park Pass',      value: `$${budget.parkPass}`,       sub: 'Yosemite weekly',                color: '#0ea5e9' },
        ];

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-3xl p-8 shadow-sm';
            card.style.borderTop = `4px solid ${item.color}`;

            card.innerHTML = `
                <p class="text-xs uppercase tracking-wider text-slate-400 mb-2">${item.label}</p>
                <p class="text-4xl font-black leading-none" style="color:${item.color}">${item.value}</p>
                <p class="text-slate-500 text-sm mt-2">${item.sub}</p>
            `;

            container.appendChild(card);
        });
    })
    .catch(err => console.error('Budget rendering failed:', err));
