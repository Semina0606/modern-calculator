<div align="center">

# ✨ NovaCalc — Modern & Bilimsel Web Hesap Makinesi

<p align="center">
  <strong>Göz alıcı Glassmorphism tasarımı, dinamik renk temaları, dokunsal ses efektleri ve gelişmiş bilimsel hesaplama motoru.</strong>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-22c55e?style=for-the-badge&logo=github)](https://pages.github.com/)

<br>

![NovaCalc Mockup Preview](assets/preview.png)

</div>

---

## 🌟 Öne Çıkan Özellikler

- **🎨 Ultra Modern Glassmorphism Tasarımı:**
  - Akrilik buzlu cam efekti (`backdrop-filter: blur(28px)`), katmanlı kenar vurguları ve yumuşak ortam aydınlatması (Ambient Glow Blobs).
- **🎭 4 Farklı Renk Teması:**
  - 🌌 **Gece Mavisi (Midnight Obsidian):** Elektrik camgöbeği & derin uzay tonları.
  - 🔮 **Cyberpunk Neon:** Neon fuşya, elektrik sarısı ve mor parıltılar.
  - 🌅 **Gün Batımı (Sunset Aura):** Sıcak şeftali, amber ve gül kurusu geçişleri.
  - ❄️ **Buzul Cam (Aurora):** Kuzey ışıkları zümrütü ve buz mavisi.
- **🔬 Bilimsel Hesaplama Paneli (`fx` butonu):**
  - Trigonometri: $\sin, \cos, \tan$ ve $\text{DEG} / \text{RAD}$ açı modu geçişi.
  - Üs ve Kök: $\sqrt{x}, x^2, x^y$.
  - Logaritmalar: $\ln, \log_{10}$.
  - Özel İşlemler: Faktöriyel ($n!$), tersini alma ($1/x$), mutlak değer ($|x|$).
  - Matematiksel sabitler: $\pi, e$ ve parantezli işlem desteği.
- **⚡ Canlı Önizleme (Live Preview):**
  - Eşittir (`=`) butonuna basmadan önce alt satırda anlık matematiksel sonuç görüntülenir.
- **🔊 Dokunsal Ses Efektleri (Web Audio API):**
  - Her tuş vuruşunda gerçekçi ve hafif mekanik tıklama sesleri.
  - Eşittir ve temizleme tuşları için özel ses tınıları.
  - İstenildiğinde tek tıkla sessize alma.
- **🧠 Hafıza Fonksiyonları (Memory Register):**
  - `MC` (Temizle), `MR` (Çağır), `M+` (Ekle), `M-` (Çıkar), `MS` (Kaydet).
  - Aktif hafıza durumu ekranda **M** rozeti ile gösterilir.
- **📜 İşlem Geçmişi (Tape Drawer):**
  - Yapılan son 30 işlem yerel hafızada (`localStorage`) saklanır.
  - Geçmişteki herhangi bir sonuca tıklayarak mevcut ekrana geri çağırabilirsiniz.
- **⌨️ Tam Fiziksel Klavye Desteği:**
  - Klavye ve Numpad tuşları ile tam uyumlu; basılan tuş arayüzde gerçek zamanlı olarak parlar.
- **📋 Tek Tıkla Panoya Kopyalama:**
  - Hesaplanan sonucu bildirim eşliğinde doğrudan panoya kopyalar.
- **📱 %100 Duyarlı (Responsive) Tasarım:**
  - Masaüstü, tablet ve mobil cihazlarla tam uyumludur.

---

## ⌨️ Klavye Kısayolları

| Tuş | İşlev |
| :--- | :--- |
| `0 - 9` | Rakam girişi |
| `,` veya `.` | Ondalık virgülü |
| `+` | Toplama işlemi |
| `-` | Çıkarma işlemi |
| `*` | Çarpma işlemi ($\times$) |
| `/` | Bölme işlemi ($\div$) |
| `%` | Yüzde işlemi |
| `^` | Üs alma işlemi ($x^y$) |
| `(` ve `)` | Parantez aç / kapat |
| `Enter` veya `=` | Hesapla / Sonuç |
| `Backspace` | Son karakteri / işlemi sil |
| `Escape` | Hepsini temizle (`AC`) |

---

## 🚀 Hızlı Başlangıç

Projeyi bilgisayarınızda çalıştırmak için harici bir bağımlılık (npm kütüphanesi vs.) yüklemenize gerek yoktur.

### Yöntem 1: Doğrudan Tarayıcıda Açma
`index.html` dosyasına çift tıklayarak herhangi bir modern tarayıcıda hemen çalıştırabilirsiniz.

### Yöntem 2: Node.js ile Çalıştırma
```bash
# Proje klasörüne gidin
cd modern-calculator

# Dahili sunucuyu başlatın
node server.js
```
Ardından tarayıcınızda [http://127.0.0.1:5173/](http://127.0.0.1:5173/) adresine gidin.

### Yöntem 3: Python ile Çalıştırma
```bash
python -m http.server 3000
```
[http://localhost:3000/](http://localhost:3000/) adresinden erişebilirsiniz.

---

## 📁 Proje Dizin Yapısı

```text
modern-calculator/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Otomatik GitHub Pages dağıtım akışı
├── assets/
│   └── preview.png           # Depo kapak görseli
├── index.html                # Semantik HTML5 arayüz yapısı
├── style.css                 # Glassmorphism & dinamik renk tema stilleri
├── app.js                    # Hesaplama motoru, sesler, klavye ve geçmiş
├── server.js                 # Sıfır bağımlılıklı yerel Node.js statik sunucusu
├── package.json              # Proje metaverileri ve betikler
├── LICENSE                   # MIT Açık Kaynak Lisansı
└── README.md                 # Proje dokümantasyonu
```

---

## 🌐 GitHub Pages ile Canlıya Alma

Bu repo, içine eklenmiş hazır GitHub Actions iş akışına sahiptir:

1. Bu projeyi GitHub'da bir repoya yükleyin (`push`).
2. Deponuzun **Settings > Pages** sekmesine gidin.
3. **Build and deployment > Source** seçeneğini **GitHub Actions** olarak ayarlayın.
4. Kodunuzu `main` dalına her gönderdiğinizde, siteniz otomatik olarak `https://<kullanici-adiniz>.github.io/<repo-adi>/` adresinde canlıya çıkacaktır!

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır. Dilediğiniz gibi kullanabilir, değiştirebilir ve geliştirebilirsiniz.

<div align="center">
  <sub>❤️ ile geliştirildi — Geri bildirimleriniz ve katkılarınız (Pull Request) memnuniyetle karşılanır.</sub>
</div>
