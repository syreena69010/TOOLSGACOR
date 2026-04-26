(async () => {
    if (window.madetotoActive) return;
    window.madetotoActive = true;

    // 1. TAMPILAN (UI)
    const style = document.createElement('style');
    style.innerHTML = `
        #mt-panel { position: fixed; top: 0; left: 0; width: 100%; z-index: 9999999; background: #fff; border-bottom: 5px solid #801336; font-family: sans-serif; box-shadow: 0 10px 30px rgba(0,0,0,0.5); max-height: 80vh; overflow-y: auto; }
        .mt-header { background: #801336; color: #fff; padding: 12px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .mt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; padding: 20px; background: #f0f0f0; }
        .mt-card { background: #fff; border: 1px solid #ccc; border-radius: 8px; padding: 15px; border-top: 5px solid #27ae60; }
        .u-name { font-weight: bold; color: #27ae60; font-size: 14px; border-bottom: 1px solid #eee; margin-bottom: 8px; display: block; }
        .mt-row { display: flex; justify-content: space-between; font-size: 12px; margin: 5px 0; }
        .mt-status { margin-top: 10px; background: #e8f5e9; color: #2e7d32; text-align: center; padding: 6px; border-radius: 4px; font-weight: bold; }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'mt-panel';
    panel.innerHTML = `
        <div class="mt-header">
            <span>🚀 MADETOTO SCANNER FINAL v5.0</span>
            <button onclick="document.getElementById('mt-panel').remove(); window.madetotoActive=false;" style="background:#fff; color:#801336; border:none; border-radius:50%; width:25px; height:25px; cursor:pointer; font-weight:bold;">X</button>
        </div>
        <div class="mt-grid" id="mt-display">⏳ Mencari data tabel... Mohon tunggu...</div>
    `;
    document.body.prepend(panel);

    const display = document.getElementById('mt-display');

    // 2. FUNGSI SCAN SEMUA ELEMEN TERMASUK IFRAME
    function getAllTableRows() {
        let rows = Array.from(document.querySelectorAll("tr"));
        document.querySelectorAll("iframe, frame").forEach(f => {
            try {
                let fRows = f.contentWindow.document.querySelectorAll("tr");
                rows = [...rows, ...Array.from(fRows)];
            } catch (e) {}
        });
        return rows;
    }

    const allRows = getAllTableRows();
    let foundCount = 0;

    for (const row of allRows) {
        const tds = Array.from(row.querySelectorAll("td"));
        
        // Cari baris yang punya kolom cukup banyak (biasanya tabel WD)
        if (tds.length >= 5) {
            // Kita cari username yang biasanya ada linknya atau di kolom 1/2
            const userLink = row.querySelector("a[href*='username']") || tds[1];
            if (!userLink) continue;

            const username = userLink.innerText.trim();
            const wdAmount = tds[7] ? tds[7].innerText.trim() : (tds[tds.length-2] ? tds[tds.length-2].innerText.trim() : "0");

            // Filter teks yang bukan username
            if (username.length < 3 || username.includes(" ") || username === "Username" || username === "No.") continue;

            try {
                // Tarik data Winlose secara background
                const res = await fetch(`winlose_all.php?username=${username}`);
                const html = await res.text();
                
                // Parsing manual angka Bet dari Winlose
                const betMatch = html.match(/(\d{1,3}(\.\d{3})+)/g); 
                const totalBet = betMatch ? betMatch[betMatch.length - 1] : "0";

                if (foundCount === 0) display.innerHTML = "";

                const card = document.createElement('div');
                card.className = 'mt-card';
                card.innerHTML = `
                    <span class="u-name">👤 ${username}</span>
                    <div class="mt-row"><span>Withdraw:</span><b>${wdAmount}</b></div>
                    <div class="mt-row"><span>Total Bet (TO):</span><b>${totalBet}</b></div>
                    <div class="mt-row" style="color:#801336; margin-top:5px; border-top:1px dashed #ccc; pt:5px;">
                        <span>Rule:</span><b>Setiap Deposit</b>
                    </div>
                    <div class="mt-status">✅ TIDAK KENA MULTIPLIER</div>
                `;
                display.appendChild(card);
                foundCount++;
            } catch (err) {}
        }
    }

    if (foundCount === 0) {
        display.innerHTML = "❌ Data tidak ditemukan. Pastikan Anda sudah membuka daftar Withdraw.";
    }
})();
