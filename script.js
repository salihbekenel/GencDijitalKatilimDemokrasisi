

const kararlar = [
    {
        id: 1,
        kararNo: "2024/15",
        baslik: "Küçükyalı Sahil Yolu Projesi: Araç Şeridi Yerine Bisiklet Yolu ve Yürüyüş Parkuru",
        ozet: "Maltepe Belediyesi, Küçükyalı sahil yolundaki iki araç şeridini kaldırarak, yerine ayrılmış bisiklet yolu, yürüyüş parkuru ve dinlenme alanları yapmayı planlıyor. Amaç: trafik yoğunluğunu azaltmak, vatandaşlara sağlıklı yaşam alanı oluşturmak.",
        tarih: "2024-01-15",
        kategori: "altyapi"
    },
    {
        id: 2,
        kararNo: "2024/22",
        baslik: "\"MaltepeGençLAB\" Açılışı: Ücretsiz Kodlama ve Dijital Tasarım Atölyeleri",
        ozet: "Belediye, Zübeyde Hanım Gençlik Merkezi'nde gençlere yönelik ücretsiz yazılım geliştirme (Python, Web Tasarım), 3B modelleme ve oyun geliştirme atölyeleri açma kararı aldı. Bütçe: 1.5 Milyon TL.",
        tarih: "2024-02-10",
        kategori: "egitim"
    },
    {
        id: 3,
        kararNo: "2024/18",
        baslik: "Maltepe İlçesine Yeni Elektrikli Belediye Otobüsü Seferleri",
        ozet: "Çevre kirliliğini azaltmak amacıyla, M5 hattına (Marmaray Bağlantı Yolu) entegre, 10 adet yeni elektrikli otobüs alınacak ve ücretsiz olarak hizmete sunulacak.",
        tarih: "2024-01-28",
        kategori: "ulasim"
    },
    {
        id: 4,
        kararNo: "2024/09",
        baslik: "Türkan Saylan Kültür Merkezi'nde Üniversiteli Gençlere %50 İndirim",
        ozet: "Tiyatro, sinema gösterimi ve konser etkinliklerinde, 18-25 yaş aralığındaki üniversite öğrencilerine biletlerde %50 indirim uygulanması kararlaştırıldı.",
        tarih: "2024-02-05",
        kategori: "kultur"
    },
    {
        id: 5,
        kararNo: "2024/30",
        baslik: "Cumartesi Günleri Araç Girişine Kapatılan \"Maltepe Sokakları\" Projesi",
        ozet: "Her cumartesi 09:00-19:00 saatleri arasında, seçilecek 3 cadde araç trafiğine kapatılarak; vatandaşların yürüyüş, sokak oyunları ve açık hava etkinlikleri yapabileceği bir alana dönüştürülecek.",
        tarih: "2024-02-15",
        kategori: "yasam"
    }
];

let mevcutSayfa = 1;
const sayfaBasinaKarar = 2;
let filtrelenmisKararlar = [...kararlar];

document.addEventListener('DOMContentLoaded', function() {
    kararlariYukle();
    sayfaGoster();
    istatistikleriGuncelle();
    eventListenerlariEkle();
});

function eventListenerlariEkle() {
    
    document.getElementById('arama-input').addEventListener('input', function(e) {
        filtreleKararlari(e.target.value);
    });

    
    document.getElementById('sirala-select').addEventListener('change', function(e) {
        siralaKararlari(e.target.value);
    });
}

function kararlariYukle() {
   
    kararlar.forEach(karar => {
        if (!localStorage.getItem(`karar_${karar.id}`)) {
            localStorage.setItem(`karar_${karar.id}`, JSON.stringify({
                evet: 0,
                hayir: 0,
                yorumlar: []
            }));
        }
    });
}

function filtreleKararlari(aramaMetni) {
    const aramaKucuk = aramaMetni.toLowerCase();
    filtrelenmisKararlar = kararlar.filter(karar => 
        karar.baslik.toLowerCase().includes(aramaKucuk) ||
        karar.ozet.toLowerCase().includes(aramaKucuk) ||
        karar.kararNo.toLowerCase().includes(aramaKucuk)
    );
    
    mevcutSayfa = 1;
    sayfaGoster();
}

function siralaKararlari(siralamaTuru) {
    switch(siralamaTuru) {
        case 'yeniden-eskiye':
            filtrelenmisKararlar.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));
            break;
        case 'eskiden-yeniye':
            filtrelenmisKararlar.sort((a, b) => new Date(a.tarih) - new Date(b.tarih));
            break;
        case 'cok-oy-alan':
            filtrelenmisKararlar.sort((a, b) => {
                const aData = JSON.parse(localStorage.getItem(`karar_${a.id}`));
                const bData = JSON.parse(localStorage.getItem(`karar_${b.id}`));
                return (bData.evet + bData.hayir) - (aData.evet + aData.hayir);
            });
            break;
        case 'az-oy-alan':
            filtrelenmisKararlar.sort((a, b) => {
                const aData = JSON.parse(localStorage.getItem(`karar_${a.id}`));
                const bData = JSON.parse(localStorage.getItem(`karar_${b.id}`));
                return (aData.evet + aData.hayir) - (bData.evet + bData.hayir);
            });
            break;
    }
    
    mevcutSayfa = 1;
    sayfaGoster();
}

function sayfaGoster() {
    const container = document.getElementById('kararlar-container');
    container.innerHTML = '';

    const baslangic = (mevcutSayfa - 1) * sayfaBasinaKarar;
    const bitis = baslangic + sayfaBasinaKarar;
    const sayfaKararlari = filtrelenmisKararlar.slice(baslangic, bitis);

    if (sayfaKararlari.length === 0) {
        container.innerHTML = `
            <div class="karar">
                <div class="karar-baslik">
                    <i class="fas fa-search"></i> Sonuç bulunamadı
                </div>
                <div class="karar-ozet">
                    Arama kriterlerinize uygun karar bulunamadı. Lütfen farklı bir arama terimi deneyin.
                </div>
            </div>
        `;
    } else {
        sayfaKararlari.forEach(karar => {
            const kararData = JSON.parse(localStorage.getItem(`karar_${karar.id}`));
            const toplamOy = kararData.evet + kararData.hayir;
            const evetYuzde = toplamOy > 0 ? (kararData.evet / toplamOy * 100) : 0;
            const hayirYuzde = toplamOy > 0 ? (kararData.hayir / toplamOy * 100) : 0;

            const kararHTML = `
                <div class="karar">
                    <div class="karar-baslik">
                        <span class="karar-no">${karar.kararNo}</span>
                        ${karar.baslik}
                    </div>
                    <div class="karar-ozet">${karar.ozet}</div>
                    
                    <div class="karar-meta">
                        <span class="karar-tarih"><i class="fas fa-calendar"></i> ${new Date(karar.tarih).toLocaleDateString('tr-TR')}</span>
                        <span class="karar-kategori"><i class="fas fa-tag"></i> ${karar.kategori.toUpperCase()}</span>
                    </div>
                    
                    <div class="oy-buttons">
                        <button class="btn btn-evet" onclick="oyVer(${karar.id}, 'evet')">
                            <i class="fas fa-thumbs-up"></i> KATILIYORUM
                        </button>
                        <button class="btn btn-hayir" onclick="oyVer(${karar.id}, 'hayir')">
                            <i class="fas fa-thumbs-down"></i> KATILMIYORUM
                        </button>
                    </div>
                    
                    <div class="istatistik">
                        <strong><i class="fas fa-chart-bar"></i> İstatistikler:</strong>
                        <div class="istatistik-bar">
                            <div class="evet-bar" style="width: ${evetYuzde}%">
                                ${evetYuzde > 0 ? `${evetYuzde.toFixed(1)}% EVET (${kararData.evet} oy)` : ''}
                            </div>
                            <div class="hayir-bar" style="width: ${hayirYuzde}%">
                                ${hayirYuzde > 0 ? `${hayirYuzde.toFixed(1)}% HAYIR (${kararData.hayir} oy)` : ''}
                            </div>
                        </div>
                    </div>
                    
                    <div class="yorum-bolumu">
                        <strong><i class="fas fa-comments"></i> Yorumlar (${kararData.yorumlar.length}):</strong>
                        <div class="yorum-form">
                            <textarea class="yorum-input" id="yorum-${karar.id}" placeholder="Düşüncelerinizi yazın..."></textarea>
                            <button class="btn btn-yorum" onclick="yorumEkle(${karar.id})">
                                <i class="fas fa-paper-plane"></i> Gönder
                            </button>
                        </div>
                        <div class="yorumlar-listesi" id="yorumlar-${karar.id}">
                            ${kararData.yorumlar.map(yorum => `
                                <div class="yorum">
                                    <div>${yorum.metin}</div>
                                    <div class="yorum-tarih">${new Date(yorum.tarih).toLocaleString('tr-TR')}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += kararHTML;
        });
    }

    const toplamSayfa = Math.ceil(filtrelenmisKararlar.length / sayfaBasinaKarar);
    document.getElementById('sayfa-bilgisi').textContent = `Sayfa ${mevcutSayfa} / ${toplamSayfa}`;
    document.getElementById('onceki-sayfa').disabled = mevcutSayfa === 1;
    document.getElementById('sonraki-sayfa').disabled = mevcutSayfa === toplamSayfa || toplamSayfa === 0;
    
    istatistikleriGuncelle();
}

function oyVer(kararId, oy) {
    const kararData = JSON.parse(localStorage.getItem(`karar_${kararId}`));
    kararData[oy]++;
    localStorage.setItem(`karar_${kararId}`, JSON.stringify(kararData));
    
   
    const button = event.currentTarget;
    const orijinalHTML = button.innerHTML;
    button.innerHTML = `<i class="fas fa-check"></i> OY VERİLDİ`;
    button.style.opacity = '0.8';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = orijinalHTML;
        button.style.opacity = '1';
        button.disabled = false;
        sayfaGoster();
    }, 1500);
}

function yorumEkle(kararId) {
    const yorumInput = document.getElementById(`yorum-${kararId}`);
    const yorumMetin = yorumInput.value.trim();
    
    if (yorumMetin) {
        const kararData = JSON.parse(localStorage.getItem(`karar_${kararId}`));
        kararData.yorumlar.unshift({
            metin: yorumMetin,
            tarih: new Date().toISOString()
        });
        
        localStorage.setItem(`karar_${kararId}`, JSON.stringify(kararData));
        yorumInput.value = '';
        
        
        const button = event.currentTarget;
        const orijinalHTML = button.innerHTML;
        button.innerHTML = `<i class="fas fa-check"></i> GÖNDERİLDİ`;
        
        setTimeout(() => {
            button.innerHTML = orijinalHTML;
            sayfaGoster();
        }, 1000);
    }
}

function oncekiSayfa() {
    if (mevcutSayfa > 1) {
        mevcutSayfa--;
        sayfaGoster();
    }
}

function sonrakiSayfa() {
    const toplamSayfa = Math.ceil(filtrelenmisKararlar.length / sayfaBasinaKarar);
    if (mevcutSayfa < toplamSayfa) {
        mevcutSayfa++;
        sayfaGoster();
    }
}

function istatistikleriGuncelle() {
    let toplamOy = 0;
    let toplamYorum = 0;
    let toplamKatilim = 0;
    
    kararlar.forEach(karar => {
        const kararData = JSON.parse(localStorage.getItem(`karar_${karar.id}`));
        toplamOy += kararData.evet + kararData.hayir;
        toplamYorum += kararData.yorumlar.length;
        
       
        if (kararData.evet + kararData.hayir > 0) {
            toplamKatilim++;
        }
    });
    
    const katilimOrani = ((toplamKatilim / kararlar.length) * 100).toFixed(1);
    
    document.getElementById('toplam-oy').textContent = toplamOy;
    document.getElementById('toplam-yorum').textContent = toplamYorum;
    document.getElementById('toplam-karar').textContent = kararlar.length;
    document.getElementById('katilim-orani').textContent = `${katilimOrani}%`;
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        const activeElement = document.activeElement;
        if (activeElement.classList.contains('yorum-input')) {
            const kararId = activeElement.id.split('-')[1];
            yorumEkle(parseInt(kararId));
        }
    }
});

window.addEventListener('load', function() {
    document.getElementById('arama-input').focus();
});