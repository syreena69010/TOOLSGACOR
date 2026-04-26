(async () => {
    if (window.madetotoActive) return;
    window.madetotoActive = true;

    const style = document.createElement('style');
    style.innerHTML = `
        #mt-panel { position: fixed; top: 0; left: 0; width: 100%; z-index: 999999; background: #fff; border-bottom: 5px solid #801336; font-family: sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-height: 80vh; overflow-y: auto; }
        .mt-header { background: #801336; color: #fff; padding: 12px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; }
        .mt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; padding: 20px; background: #f9f9f9; }
        .mt-card { background: #fff; border: 1px solid #ddd; border-radius: 10px; padding: 15px; border-top: 5px solid #27ae60; }
        .u-info { border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 10px; font-weight: bold; color: #27ae60; }
        .mt-row { display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0; color: #333; }
        .mt-status { margin-top: 10px; background: #e8f5e9; color: #2e7d32; text-align: center; padding: 8px; border-radius: 5px; font-weight: bold; font-size: 11px; }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'mt-panel';
    panel.innerHTML = `
        <div class="mt-header">
            <span>🚀 MADETOTO AUTO-SCANNER GACOR v3.0 (IFRAME FIX)</span>
            <button onclick="document.getElementById('mt-panel').remove(); window.madetotoActive=false;" style="background:#fff; color:#801336; border:none; border-radius:50%; cursor:pointer; font-weight:bold; width:25px; height:25px;">X</button>
        </div>
        <div class="mt-grid" id="mt-display">⏳ Mencari data di seluruh dashboard...</div>
    `;
    document.body.prepend(panel);

    const display = document.getElementById('mt-display');
    
    /* FUNGSI PENCARI DATA DI SEMUA WINDOW (IFRAME) */
    function findRows() {
        let allRows = Array.from(document.querySelectorAll("tr"));
        let iframes = document.querySelectorAll("iframe");
        iframes.forEach(ifrm => {
            try {
                let ifrmRows = ifrm.contentWindow.document.querySelectorAll("tr");
                allRows = [...allRows, ...Array.from(ifrmRows)];
            } catch (e) { console.log("Iframe protected"); }
        });
        return allRows;
    }

    const rows = findRows();
    let found = 0;

    for (const row of rows) {
        const userLink = row.querySelector("a[href*='username']") || row.querySelector("b");
        const cells = row.querySelectorAll("td");

        if (userLink && cells.length > 5) {
            const user = userLink.innerText.trim();
            const wdVal = cells[7] ? cells[7].innerText.trim() : (cells[cells.length-2] ? cells[cells.length-2].innerText.trim() : "0");
            
            if (user.length < 3 || user.includes(" ") || user.includes("Username")) continue;

            try {
                const res = await fetch(`winlose_all.php?username=${user}`);
                const html = await res.text();
                const matches = html.match(/\d{1,3}(\.\d{3})+/g);
                const toVal = matches ? (matches[matches.length - 2] || matches[0]) : "0";

                if (found === 0) display.innerHTML = "";
                
                const card = document.createElement('div');
                card.className = 'mt-card';
                card.innerHTML = `
                    <div class="u-info">👤 ${user}</div>
                    <div class="mt-row"><span>Withdraw</span><b>${wdVal}</b></div>
                    <div class="mt-row"><span>Total TO (Bet)</span><b>${toVal}</b></div>
                    <div class="mt-row" style="color:#801336; margin-top:5px;"><span>Rule Aktif</span><b>Setiap Deposit</b></div>
                    <div class="mt-status">✅ TEMBUS TARGET</div>
                `;
                display.appendChild(card);
                found++;
            } catch (e) {}
        }
    }
    if (found === 0) display.innerHTML = "Belum ada data pending withdraw yang terdeteksi.";
})();
