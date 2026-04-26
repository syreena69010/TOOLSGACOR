javascript:(async () => {
    const style = document.createElement('style');
    style.innerHTML = `
        #mt-panel { position: fixed; top: 0; left: 0; width: 100%; z-index: 9999999; background: #fff; border-bottom: 5px solid #801336; font-family: sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-height: 80vh; overflow-y: auto; }
        .mt-header { background: #801336; color: #fff; padding: 12px; font-weight: bold; display: flex; justify-content: space-between; }
        .mt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; padding: 20px; background: #f0f0f0; }
        .mt-card { background: #fff; border: 1px solid #ccc; border-radius: 8px; padding: 15px; border-top: 5px solid #27ae60; }
        .u-name { font-weight: bold; color: #27ae60; font-size: 14px; border-bottom: 1px solid #eee; margin-bottom: 8px; display: block; }
        .mt-row { display: flex; justify-content: space-between; font-size: 12px; margin: 5px 0; }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'mt-panel';
    panel.innerHTML = `<div class="mt-header"><span>🚀 MADETOTO INSTANT SCANNER</span><button onclick="this.parentElement.parentElement.remove()">X</button></div><div class="mt-grid" id="mt-display"></div>`;
    document.body.prepend(panel);

    const display = document.getElementById('mt-display');
    const allRows = document.querySelectorAll("tr"); // Langsung sikat semua TR di layar

    let found = 0;
    allRows.forEach(row => {
        const tds = row.querySelectorAll("td");
        if (tds.length >= 7) {
            const user = tds[1]?.innerText.trim();
            const bet = tds[5]?.innerText.trim(); // Kolom Bet sesuai image_1f0ed5.png
            const wd = tds[7]?.innerText.trim() || "0";

            if (user && user.length > 2 && !user.includes("Username")) {
                const card = document.createElement('div');
                card.className = 'mt-card';
                card.innerHTML = `
                    <span class="u-name">👤 ${user}</span>
                    <div class="mt-row"><span>Withdraw:</span><b>${wd}</b></div>
                    <div class="mt-row"><span>Total Bet:</span><b>${bet}</b></div>
                    <div class="mt-row" style="color:#801336; border-top:1px dashed #ccc; margin-top:5px; padding-top:5px;"><span>Rule:</span><b>Setiap Deposit</b></div>
                `;
                display.appendChild(card);
                found++;
            }
        }
    });

    if (found === 0) display.innerHTML = "❌ Tidak ada data di halaman ini. Buka halaman Winlose dulu!";
})();
