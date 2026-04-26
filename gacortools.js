(async function() {
    /* 1. Cegah Panel Double */
    if (document.getElementById('gacor-panel')) document.getElementById('gacor-panel').remove();

    /* 2. Style UI (Warna Maroon & Green) */
    const style = document.createElement('style');
    style.innerHTML = `
        #gacor-panel { position: fixed; top: 0; left: 0; width: 100%; z-index: 9999999; background: #fff; font-family: Arial, sans-serif; border-bottom: 4px solid #801336; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
        .g-head { background: #801336; color: #fff; padding: 10px; font-weight: bold; display: flex; justify-content: space-between; }
        .g-body { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; padding: 15px; background: #f4f4f4; max-height: 70vh; overflow-y: auto; }
        .g-card { background: #fff; border-radius: 8px; padding: 12px; border: 1px solid #ddd; border-top: 5px solid #27ae60; }
        .g-user { font-weight: bold; color: #27ae60; border-bottom: 1px solid #eee; margin-bottom: 8px; display: block; }
        .g-row { display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0; }
        .g-status { background: #e8f5e9; color: #2e7d32; text-align: center; padding: 5px; border-radius: 4px; font-weight: bold; font-size: 11px; margin-top: 8px; }
    `;
    document.head.appendChild(style);

    /* 3. Bikin Panel */
    const panel = document.createElement('div');
    panel.id = 'gacor-panel';
    panel.innerHTML = `
        <div class="g-head"><span>🚀 MADETOTO SCANNER GACOR</span><b style="cursor:pointer" onclick="this.parentElement.parentElement.remove()">X</b></div>
        <div class="g-body" id="g-display">⏳ Sedang memproses tabel...</div>
    `;
    document.body.prepend(panel);

    /* 4. Logika Scan (Tembus Frame & Iframe) */
    const display = document.getElementById('g-display');
    const getDocs = () => {
        let docs = [document];
        document.querySelectorAll('iframe, frame').forEach(f => {
            try { if (f.contentDocument) docs.push(f.contentDocument); } catch (e) {}
        });
        return docs;
    };

    let found = 0;
    getDocs().forEach(doc => {
        doc.querySelectorAll('tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 7) {
                const user = cells[1]?.innerText.trim();
                const wd = cells[7]?.innerText.trim() || '0';
                const bet = cells[5]?.innerText.trim() || '0';

                if (user && user.length > 2 && !user.includes('Username')) {
                    if (found === 0) display.innerHTML = '';
                    const card = document.createElement('div');
                    card.className = 'g-card';
                    card.innerHTML = `
                        <span class="g-user">👤 ${user}</span>
                        <div class="g-row"><span>Withdraw:</span><b>${wd}</b></div>
                        <div class="g-row"><span>Total Bet:</span><b>${bet}</b></div>
                        <div class="g-status">✅ TEMBUS TARGET</div>
                    `;
                    display.appendChild(card);
                    found++;
                }
            }
        });
    });

    if (found === 0) display.innerHTML = "Gagal deteksi. Pastikan buka menu Withdraw/Winlose.";
})();
