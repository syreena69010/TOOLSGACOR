(function() {
    /* 1. HAPUS PANEL LAMA JIKA ADA */
    const old = document.getElementById('gacor-panel');
    if (old) old.remove();

    /* 2. STYLE PANEL (MAROON & GACOR STYLE) */
    const style = document.createElement('style');
    style.innerHTML = `
        #gacor-panel { position: fixed; top: 0; left: 0; width: 100%; z-index: 9999999; background: #fff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-bottom: 5px solid #801336; box-shadow: 0 10px 50px rgba(0,0,0,0.5); max-height: 90vh; overflow-y: auto; }
        .g-head { background: #801336; color: #fff; padding: 15px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; font-size: 18px; }
        .g-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; padding: 20px; background: #eeeeee; }
        .g-card { background: #fff; border-radius: 12px; padding: 15px; border: 1px solid #ddd; border-top: 6px solid #27ae60; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .g-user { font-weight: bold; color: #27ae60; font-size: 16px; border-bottom: 2px solid #f4f4f4; margin-bottom: 10px; display: block; padding-bottom: 5px; }
        .g-row { display: flex; justify-content: space-between; font-size: 13px; margin: 6px 0; color: #333; }
        .g-row b { color: #000; }
        .g-status { background: #d4edda; color: #155724; text-align: center; padding: 8px; border-radius: 6px; font-weight: bold; font-size: 12px; margin-top: 10px; border: 1px solid #c3e6cb; }
    `;
    document.head.appendChild(style);

    /* 3. STRUKTUR PANEL */
    const panel = document.createElement('div');
    panel.id = 'gacor-panel';
    panel.innerHTML = `
        <div class="g-head">
            <span>🚀 MADETOTO AUTO-SCANNER V.FINAL</span>
            <button onclick="document.getElementById('gacor-panel').remove()" style="background:#fff; color:#801336; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer; font-weight:bold; font-size:16px;">X</button>
        </div>
        <div class="g-grid" id="g-display">⏳ Mencari data member... Pastikan tabel sudah muncul di layar.</div>
    `;
    document.body.prepend(panel);

    /* 4. LOGIKA TEMBUS TABEL (SANGAT AGRESIF) */
    const display = document.getElementById('g-display');
    
    function scanTabel() {
        let baris = [];
        // Scan semua dokumen (termasuk di dalam iframe/frame)
        const docs = [document];
        document.querySelectorAll('iframe, frame').forEach(f => {
            try { if (f.contentDocument) docs.push(f.contentDocument); } catch (e) {}
        });

        docs.forEach(d => {
            baris = [...baris, ...Array.from(d.querySelectorAll('tr'))];
        });

        let ketemu = 0;
        baris.forEach(row => {
            const cells = row.querySelectorAll('td');
            // Fokus ke tabel yang punya banyak kolom (ciri khas tabel WD/Winlose)
            if (cells.length >= 7) {
                const user = cells[1]?.innerText.trim();
                const wd = cells[7]?.innerText.trim() || '0';
                const bet = cells[5]?.innerText.trim() || '0';

                // Filter agar tidak mengambil header tabel
                if (user && user.length > 2 && !user.includes('Username') && !user.includes('No.')) {
                    if (ketemu === 0) display.innerHTML = '';
                    const card = document.createElement('div');
                    card.className = 'g-card';
                    card.innerHTML = `
                        <span class="g-user">👤 ${user}</span>
                        <div class="g-row"><span>Withdraw:</span><b>${wd}</b></div>
                        <div class="g-row"><span>Total Bet (TO):</span><b>${bet}</b></div>
                        <div class="g-row" style="color:#801336; border-top:1px dashed #ccc; margin-top:5px; padding-top:5px;">
                            <span>Rule:</span><b>Setiap Deposit</b>
                        </div>
                        <div class="g-status">✅ TEMBUS TARGET</div>
                    `;
                    display.appendChild(card);
                    ketemu++;
                }
            }
        });

        if (ketemu === 0) display.innerHTML = "❌ Tidak ada data terdeteksi. Buka halaman Withdraw/Winlose lalu klik lagi.";
    }

    // Jalankan scan
    scanTabel();
})();
