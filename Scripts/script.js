// ===== Trip Experiences → City Sections =====
fetch('tripData.json')
    .then(res => res.json())
    .then(data => {
    if (!data.tripExperiences) return;

    const renderCityCard = (elId, exp, accentColor) => {
        const el = document.getElementById(elId);
        if (!el) return;

        const card = document.createElement('div');
        card.className = `bg-slate-700/60 border border-slate-600 rounded-2xl p-4`;

        card.innerHTML = `
        <div class="flex justify-between items-start mb-2">
            <p class="font-semibold">${exp.name}</p>
            ${exp.mustDo ? '<span class="text-xs bg-orange-500 px-2 py-1 rounded-full font-bold">MUST</span>' : ''}
        </div>
        <p class="text-xs text-slate-400 mb-2">${exp.type || ''} ${exp.intensity ? '• ' + exp.intensity : ''}</p>
        ${exp.notes ? `<p class="text-sm text-slate-300 mb-3">${exp.notes}</p>` : ''}
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
        const location = exp.location?.toLowerCase() || '';

        if (location.includes('big sur') || location.includes('carmel')) {
        renderCityCard('day1Suggestions', exp, 'orange');
        }

        if (location.includes('yosemite')) {
        renderCityCard('day2Suggestions', exp, 'green');
        }

        if (
        location.includes('tahoe') ||
        (location.includes('lake') && location.includes('tahoe')) ||
        exp.name?.toLowerCase().includes('tahoe')
        ) {
        renderCityCard('tahoeSuggestions', exp, 'blue');
        }
    });

    // ===== LA Restaurant Cards =====
    const container = document.getElementById('laSpotsContainer');
    if (!data.laSpots || !container) return;

    const sortedSpots = [...data.laSpots].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

    sortedSpots.forEach(place => {
        const card = document.createElement('div');
        card.className = "bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-orange-100 flex flex-col justify-between";

        card.innerHTML = `
        <div>
            <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-bold">${place.name}</h3>
            ${place.priority === 1 ? '<span class="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-bold">HIGH PRIORITY</span>' : ''}
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

// ===== Route Strategy Rendering =====
fetch('../routeData.json')
  .then(res => res.json())
  .then(data => {
    if (!data.routes) return;

    const container = document.getElementById('routesContainer');
    if (!container) return;

    data.routes.forEach(route => {
      const section = document.createElement('div');

      const accent = route.summary.complexity === "Low"
        ? "border-green-400"
        : route.summary.complexity === "Moderate"
        ? "border-yellow-400"
        : "border-red-400";

      section.className = `
        bg-white rounded-3xl shadow-xl border-t-4 ${accent}
        border-l border-r border-b border-slate-200
        p-10 md:p-14 space-y-10
        hover:-translate-y-2 hover:shadow-2xl
        transition-all duration-300
      `;

      section.innerHTML = `
        <div>
          <h3 class="text-3xl md:text-4xl font-bold mb-4">${route.name}</h3>
          ${route.flightLogic ? `<p class="text-sm uppercase tracking-widest text-slate-400 mt-1">${route.flightLogic}</p>` : ''}
          ${route.notes ? `<p class="text-slate-500 max-w-3xl">${route.notes}</p>` : ''}
        </div>

        ${route.mapEmbed ? `
        <div class="rounded-3xl overflow-hidden shadow-inner border border-slate-100">
          <div class="aspect-video w-full">
            <iframe
              src="${route.mapEmbed}"
              class="w-full h-full"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
        ` : ''}

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-10">

          <div>
            <p class="text-xs uppercase tracking-widest text-slate-400">Driving Load</p>
            <p class="text-6xl md:text-7xl font-black text-orange-500 leading-none">
              ${route.summary.driveHours}h
            </p>
            <p class="text-sm text-slate-500 mt-2">
              ${route.summary.distanceMiles} miles total
            </p>
          </div>

          <div>
            <span class="
              px-5 py-2 rounded-full text-sm font-bold
              ${route.summary.complexity === 'Low' ? 'bg-green-100 text-green-700' :
                route.summary.complexity === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'}
            ">
              ${route.summary.complexity} Complexity
            </span>
          </div>

        </div>
      `;

      container.appendChild(section);
    });
  })
  .catch(err => console.error('Failed to load routeData.json', err));


// ===== Dynamic Budget Rendering =====
fetch('../routeData.json')
  .then(res => res.json())
  .then(data => {
    if (!data.routes) return;

    const routes = data.routes;

    const cardsContainer = document.getElementById('budgetCardsContainer');
    const tableHead = document.getElementById('budgetTableHead');
    const tableBody = document.getElementById('budgetTableBody');

    if (!cardsContainer || !tableHead || !tableBody) return;

    // ---------- Render Budget Cards ----------
    routes.forEach((route, index) => {

      if (!route.budget) return;

      const total = route.budget.estimatedTotal ??
        (route.budget.flight + route.budget.carAndGas + route.budget.miscFood);

      const card = document.createElement('div');

      // Dynamic Accent Colors
      const accentColors = [
        {
          border: "border-orange-400",
          bg: "from-orange-50 to-white",
          pill: "bg-orange-500 text-white",
          total: "text-orange-500"
        },
        {
          border: "border-blue-400",
          bg: "from-blue-50 to-white",
          pill: "bg-blue-500 text-white",
          total: "text-blue-500"
        },
        {
          border: "border-green-400",
          bg: "from-green-50 to-white",
          pill: "bg-green-500 text-white",
          total: "text-green-500"
        }
      ];

      const accent = accentColors[index % accentColors.length];

      card.className = `
        route-card
        bg-gradient-to-br ${accent.bg}
        rounded-[2.5rem]
        p-6 md:p-8
        border-t-4 ${accent.border}
        border-l border-r border-b border-slate-200
        shadow-lg
        hover:-translate-y-2 hover:shadow-2xl
        transition-all duration-300
        flex flex-col
      `;

      card.innerHTML = `
        <div class="mb-6">
          <span class="${accent.pill} px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Option ${index + 1}
          </span>
          <h3 class="text-3xl mt-4 mb-1">${route.name}</h3>
          <p class="text-slate-400 text-xs italic">${route.flightLogic ?? ''}</p>
        </div>

        <div class="space-y-3 mb-8 flex-grow">
          <div class="flex justify-between text-sm border-b border-slate-50 pb-2">
            <span class="text-slate-500">Flight</span>
            <span class="font-bold">~$${route.budget.flight}</span>
          </div>
          <div class="flex justify-between text-sm border-b border-slate-50 pb-2">
            <span class="text-slate-500">Car + Gas</span>
            <span class="font-bold">~$${route.budget.carAndGas}</span>
          </div>
          <div class="flex justify-between text-sm border-b border-slate-50 pb-2">
            <span class="text-slate-500">Misc / Food</span>
            <span class="font-bold">~$${route.budget.miscFood}</span>
          </div>
          <div class="flex justify-between items-center pt-2">
            <span class="font-bold">Total Est.</span>
            <span class="text-2xl font-black ${accent.total}">~$${total}</span>
          </div>
        </div>

        <div class="bg-slate-50 rounded-2xl p-4 space-y-3">
          <div class="flex items-start gap-3">
            <i class="fa-solid fa-car text-slate-400 mt-1"></i>
            <div>
              <p class="text-sm font-bold">${route.summary.distanceMiles} Miles</p>
              <p class="text-[11px] text-slate-500">${route.summary.driveHours} driving</p>
            </div>
          </div>
        </div>
      `;

      cardsContainer.appendChild(card);
    });

    // ---------- Dynamic Comparison Table ----------

    // Header Row
    let headHTML = `<tr><th class="px-6 py-4">Metric</th>`;
    routes.forEach(route => {
      headHTML += `<th class="px-6 py-4">${route.name}</th>`;
    });
    headHTML += `</tr>`;
    tableHead.innerHTML = headHTML;

    // Metrics Rows
    const metrics = [
      { label: "Flight Logic", key: "flightLogic" },
      { label: "Driving Hours", key: "driveHours" },
      { label: "Total Est. Cost", key: "total" }
    ];

    metrics.forEach(metric => {
      let row = `<tr class="border-b border-slate-50"><td class="px-6 py-4 font-bold">${metric.label}</td>`;

      routes.forEach(route => {
        let value;

        if (metric.key === "driveHours") {
          value = route.summary.driveHours;
        } else if (metric.key === "total") {
          value = `$${route.budget?.estimatedTotal ??
            (route.budget.flight + route.budget.carAndGas + route.budget.miscFood)}`;
        } else {
          value = route[metric.key] ?? "-";
        }

        row += `<td class="px-6 py-4">${value}</td>`;
      });

      row += `</tr>`;
      tableBody.innerHTML += row;
    });

  })
  .catch(err => console.error('Budget rendering failed:', err));