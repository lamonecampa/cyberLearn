import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Shield,
  Zap,
  BookOpen,
  Lock,
  Unlock,
  MessageSquare,
  Send,
  RefreshCw,
  Play,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Award,
  TrendingUp,
  User,
  Skull,
  Code,
  Sparkles,
  HelpCircle,
  Check,
  Globe,
  Settings
} from 'lucide-react';

// Interfaces for our state
interface Lesson {
  id: string;
  phase: number;
  phaseName: string;
  title: string;
  description: string;
  content: string;
  challenge: string;
  challengeObjective: string;
  placeholder: string;
  expectedPattern: string;
  xp: number;
  initialCode?: string;
  vulnerableUrl?: string;
  caseStudy?: {
    victim: string;
    year: string;
    story: string;
    howItHappened: string;
    damage: string;
    mitigationLesson: string;
  };
}

// Full progressive cybersecurity curriculum (Phases 1-5)
const lessonsList: Lesson[] = [
  {
    id: "p1-l1",
    phase: 1,
    phaseName: "The Foundations (Zero)",
    title: "Protokol HTTP & Request/Response",
    description: "Memahami bagaimana client berkomunikasi dengan server melalui HTTP Method, Headers, Cookies, dan MIME types.",
    content: `Sebelum membajak sebuah sistem, kamu harus paham bagaimana sistem tersebut bertukar data. Setiap kali browser memuat halaman, ia mengirim sebuah **HTTP Request** ke server, dan server membalas dengan **HTTP Response**.

**Komponen utama Request:**
1. **Verb / Method**: \`GET\` (mengambil data), \`POST\` (mengirim data), \`PUT\` (memperbarui data), \`DELETE\` (menghapus data).
2. **Headers**: Metadata seperti \`User-Agent\`, \`Host\`, dan yang paling penting **Cookie** (yang sering memuat session token/identitas siber kamu).
3. **Body**: Data mentah yang dikirim (misal JSON atau parameter form).

*Ingat:* Cookie bertindak seperti tiket konser. Sekali kamu mendapatkannya setelah login, browser akan selalu menyertakannya agar server tahu siapa kamu tanpa perlu login berulang kali.`,
    challenge: "Perbaiki HTTP Request Header berikut agar server mengizinkan akses ke halaman admin sensitif menggunakan session token 'valid_admin_token'!",
    challengeObjective: "Tuliskan header Cookie yang tepat agar dapat mengakses session admin.",
    placeholder: "GET /admin HTTP/1.1\nHost: targetapp.com\n[Tulis header cookie di sini!]",
    expectedPattern: "cookie:\\s*session=valid_admin_token",
    xp: 100,
    initialCode: "GET /admin HTTP/1.1\nHost: targetapp.com\nUser-Agent: Mozilla/5.0\n",
    vulnerableUrl: "https://shop.cybertarget.com/admin",
    caseStudy: {
      victim: "Yahoo! Inc.",
      year: "2014 & 2016",
      story: "Aktor negara siber berhasil mencuri rahasia kriptografi internal Yahoo untuk memproduksi Cookie Sesi palsu. Ini memungkinkan mereka mengecoh sistem kontrol akses seolah-olah mereka adalah pemilik sah akun.",
      howItHappened: "Peretas mencuri basis data pengguna dan kode siber manajemen cookie. Menggunakan algoritma hash HMAC yang bocor, mereka secara independen mempublikasikan cookie valid tanpa sandi korbannya.",
      damage: "Lebih dari 32 juta akun pengguna Yahoo berhasil dirugikan dan diakses secara ilegal oleh mata-mata luar.",
      mitigationLesson: "Gunakan masa kedaluwarsa cookie yang ketat, rotasi kunci penandatanganan kriptografi (signing keys) secara teratur, serta pantau anomali geolokasi IP pembawa sesi."
    }
  },
  {
    id: "p1-l2",
    phase: 1,
    phaseName: "The Foundations (Zero)",
    title: "Linux CLI & Terminal Basics",
    description: "Menguasai terminal Linux untuk melakukan pemindaian, enumerasi direktori, dan membaca berkas target.",
    content: `Hampir seluruh server di internet berjalan di atas sistem operasi **Linux**, begitu juga sistem pemindaian (scanning machine) milikmu. Menguasai command line interface (CLI) adalah senjata utama seorang Bug Hunter.

**Command dasar yang wajib kamu hafal:**
- \`pwd\`: Menampilkan direktori kerja saat ini (*Print Working Directory*).
- \`ls -la\`: Menampilkan semua berkas termasuk berkas tersembunyi (*dotfiles*).
- \`cat <nama_file>\`: Membaca konten dari sebuah berkas teks.
- \`grep "search"\`: Mencari string spesifik dalam berkas atau output.
- \`find . -name "*.txt"\`: Mencari berkas berdasarkan format tertentu.`,
    challenge: "Cari file rahasia bernama 'flag.txt' di direktori saat ini dan baca isi file tersebut dengan perintah Linux CLI yang tepat!",
    challengeObjective: "Dapatkan isi flag dengan membaca file flag.txt menggunakan editor atau cat.",
    placeholder: "$ Tulis perintah terminal Linux di sini...",
    expectedPattern: "cat\\s+flag.txt",
    xp: 100,
    initialCode: "",
    vulnerableUrl: "tty://victim-server-01",
    caseStudy: {
      victim: "Apache Server Infrastructure",
      year: "2021",
      story: "Insiden 'Log4Shell' membuktikan bahwa pemahaman perintah Linux sangat vital. Sekali server Apache Java rentan terpapar, peretas masuk ke Linux CLI shell untuk mencari file file sensitif.",
      howItHappened: "Injeksi string sederhana pada log aplikasi memaksa server untuk mengunduh kode eksternal dan langsung membukakan sesi terminal interaktif (/bin/sh) di bawah server.",
      damage: "Hampir 1/3 dari seluruh server korporasi di dunia terancam bocor datanya, merugikan miliaran USD akibat cleanup.",
      mitigationLesson: "Batasi hak akses proses sistem web menggunakan privilege seminimal mungkin, dan pantau aktivitas perintah mencurigakan (shell spawning) di log kernel."
    }
  },
  {
    id: "p1-l3",
    phase: 1,
    phaseName: "The Foundations (Zero)",
    title: "Mindset Bug Hunter & Ethics",
    description: "Memahami batas etika siber, program Bug Bounty (HackerOne, Bugcrowd), serta cara melaporkan celah keamanan tanpa melanggar hukum.",
    content: `Perbedaan utama antara **Hacker Jahat (Black Hat)** dan **Bug Hunter / Ethical Hacker (White Hat)** bukanlah pada teknik yang digunakan, melainkan pada **Izin (Authorization)** and **Tujuan**.

Seorang Bug Hunter beroperasi di bawah payung program kompetisi resmi (Bug Bounty) atau mematuhi kebijakan **Responsible Disclosure**:
1. **Jangan Mengeksploitasi Berlebihan**: Cukup buktikan celah siber ada (misal pop-up alert siber, membaca user 'whoami'), jangan merusak server atau mengunduh data pribadi pengguna lain.
2. **Laporkan Secara Privat**: Beri waktu kepada perusahaan untuk memperbaikinya sebelum menyebarkannya ke publik.
3. **Patuhi Rules of Engagement**: Selalu perhatikan domain mana saja yang boleh diserang (*In-Scope*) dan mana yang tidak boleh disentuh (*Out-of-Scope*).`,
    challenge: "Skenario: Kamu menemukan bug SQL Injection kritis di situs e-commerce swasta. Langkah pertama yang paling etis dan legal adalah...",
    challengeObjective: "Pilih tindakan terbaik pertamamu yang sesuai dengan prinsip Responsible Disclosure siber.",
    placeholder: "Ketik jawabanmu di sini (misal: 'melaporkan secara privat ke tim keamanan')",
    expectedPattern: "(melaporkan|lapor|privat|security|hubungi|tim|email|kontak)",
    xp: 150,
    initialCode: "",
    vulnerableUrl: "https://hackerone.com/bug-reports",
    caseStudy: {
      victim: "Instagram (Meta Platforms)",
      year: "2019",
      story: "Peneliti keamanan Laxman Muthiyah mendeteksi kerentanan kritis pengambilalihan akun Instagram tanpa password. Alih-alih menjual bug ke pasar gelap demi uang cepat, ia mendokumentasikannya secara sopan.",
      howItHappened: "Ia merancang laporan pengujian konsep (PoC) resmi dan mengirimkannya lewat program Bug Bounty Meta. Kerentanan langsung ditutup dalam selang beberapa jam saja.",
      damage: "Kerugian nominal Rp 0 berhasil dicegah. Facebook menghargai etika tinggi Laxman dengan kompensasi resmi senilai $30,000.",
      mitigationLesson: "Hubungan harmonis perusahaan dengan peneliti White Hat mempercepat patching sebelum penjahat siber (cybercriminals) menemukan celah tersebut di alam liar."
    }
  },
  {
    id: "p2-l1",
    phase: 2,
    phaseName: "Client-Side Vulnerabilities (Beginner)",
    title: "Cross-Site Scripting (Reflected XSS)",
    description: "Menyisipkan kode JavaScript jahat yang dieksekusi langsung di browser korban melalui input URL parameter rentan.",
    content: `**Cross-Site Scripting (XSS)** terjadi ketika aplikasi menyertakan input penyerang ke dalam halaman web tanpa validasi atau penyandian (*escaping*), sehingga browser mengeksekusinya sebagai kode JavaScript aktif.

Celah XSS terbagi menjadi 3 jenis utama:
1. **Reflected XSS**: Payload disisipkan dalam parameter request (URL) dan langsung dipantulkan kembali pada response saat itu juga.
2. **Stored XSS**: Payload ditaruh di basis data (seperti komentar, username) dan dieksekusi setiap kali korban memuat halaman tersebut.
3. **DOM-based XSS**: Malicious script dieksekusi akibat manipulasi objek DOM di browser secara dinamis langsung oleh client-side JavaScript.

**Contoh Payload Klasik:**
- \`<script>alert(1)</script>\`
- \`<img src=x onerror=alert(1)>\`
- \`<svg onload=alert(1)>\``,
    challenge: "Kirimkan payload XSS yang valid ke browser simulasi kami untuk mengeksekusi alert(1) menggunakan parameter pencarian!",
    challengeObjective: "Eksekusi JavaScript alert(1) menggunakan tag HTML atau event handler yang valid.",
    placeholder: "<script>alert(1)</script>",
    expectedPattern: "(<script>.*alert\\(1\\).*</script>|onerror\\s*=\\s*['\"]?alert\\(1\\)['\"]?|onload\\s*=\\s*['\"]?alert\\(1\\)['\"]?)",
    xp: 200,
    initialCode: "https://vulnerable-shop.com/search?q=",
    vulnerableUrl: "https://vulnerable-shop.com/search",
    caseStudy: {
      victim: "British Airways",
      year: "2018",
      story: "Grup peretas legendaris 'Magecart' menyisipkan skrip malware siber JavaScript berbahaya pada kodingan file eksternal yang di-host maskapai penerbangan tersebut.",
      howItHappened: "Karena input eksternal tidak divalidasi dan dijalankan mentah-mentah di browser, skrip tersebut merekam keystroke data kartu kredit yang diinput pelanggan di situs.",
      damage: "Informasi sensitif kartu kredit 380,000 pelanggan bocor, melahirkan sanksi denda GDPR sebesar £20 Juta.",
      mitigationLesson: "Gunakan proteksi modern Content Security Policy (CSP) untuk mendikte domain mana saja yang boleh mengeksekusi JavaScript."
    }
  },
  {
    id: "p2-l2",
    phase: 2,
    phaseName: "Client-Side Vulnerabilities (Beginner)",
    title: "CSRF (Cross-Site Request Forgery)",
    description: "Memaksa browser korban untuk melakukan request state-changing berbahaya ke aplikasi tempat mereka terautentikasi.",
    content: `**CSRF (Cross-Site Request Forgery)** memanfaatkan kepercayaan aplikasi web terhadap browser korban yang secara otomatis melampirkan cookie sesi dalam setiap request ke situs asal, bahkan ketika request tersebut dipicu dari situs luar (pencuri sesi).

Misal, korban sedang login di \`bank.com\`. Korban mengunjungi situs berbahaya \`evil.com\`. Di \`evil.com\`, terdapat form tersembunyi yang otomatis mengirim transfer uang ke wallet penyerang melalui API bank. Browser korban otomatis melampirkan cookie bank, dan transfer pun berhasil!

**Bagaimana cara bertahan dari CSRF?**
1. **CSRF Token**: Token acak sekali pakai yang harus dikonfirmasi di setiap request POST/PUT yang mengubah status sistem.
2. **SameSite Cookies Attribute**: Pengaturan cookie (\`SameSite=Strict\` atau \`Lax\`) yang mencegah cookie dikirim dalam cross-site request.`,
    challenge: "Apakah pertahanan utama paling efektif untuk mencegah serangan CSRF pada form pengiriman dana di backend?",
    challengeObjective: "Tuliskan mekanisme pertahanan terbaik yang umum digunakan untuk mencegah serangan CSRF.",
    placeholder: "Tulis nama teknik pencegahannya (misal: 'Anti-CSRF Token')",
    expectedPattern: "(csrf token|anticsrf|same\\s*site|samesite|token)",
    xp: 200,
    initialCode: "",
    vulnerableUrl: "https://secure-bank.com/transfer",
    caseStudy: {
      victim: "Twitter Inc.",
      year: "2013",
      story: "Seorang bug hunter menemukan bahwa penulisan endpoint ubah email di Twitter tidak dilengkapi proteksi token anti-CSRF. Ini membahayakan jutaan pengguna.",
      howItHappened: "Sistem menerima request POST langsung dari browser tanpa kunci rahasia sekali pakai, bersandar murni pada session cookie yang otomatis terlampir.",
      damage: "Hanya satu klik link jebakan dari penyerang mampu memaksa akun Twitter pengguna dialihkan alamat email-nya ke penyerang tanpa password.",
      mitigationLesson: "Jangan pernah merancang sistem penata akun/dana tanpa token validasi dinamis (Custom CSRF Token) yang tidak bisa ditebak penyerang."
    }
  },
  {
    id: "p2-l3",
    phase: 2,
    phaseName: "Client-Side Vulnerabilities (Beginner)",
    title: "Open Redirect & Flaw",
    description: "Memanfaatkan parameter redirect yang tidak divalidasi untuk mengarahkan korban ke situs phising berbahaya.",
    content: `**Open Redirect** terjadi ketika aplikasi menerima input berupa URL tujuan pengalihan rute (redirect) tanpa melakukan validasi apakah URL tersebut milik internal domain terpercaya atau domain luar berbahaya.

Celah ini sering digunakan penyerang dalam skenario rekayasa sosial (*Social Engineering*) karena korban merasa mengklik tautan resmi perusahaan, namun setelah berhasil login, mereka diarahkan ke situs tiruan (phishing) yang mirip.

**Bentuk URL Rentan:**
\`https://targetapp.com/login?redirect=http://evil.com\`

**Teknik Bypass Umum:**
- Menggunakan double slash: \`//evil.com\`
- Menggunakan subdomain login: \`https://targetapp.com@evil.com\`
- Menggunakan backslash: \`https://targetapp.com\\evil.com\``,
    challenge: "Skenario: Buat payload Open Redirect agar parameter redirect di bawah mengalihkan user secara langsung ke domain 'evil.com'!",
    challengeObjective: "Tulis payload yang mengarahkan parameter redirect ke evil.com.",
    placeholder: "https://targetapp.com/login?redirect=[Tulis payload di sini]",
    expectedPattern: "(evil\\.com|//evil|https://evil)",
    xp: 200,
    initialCode: "https://targetapp.com/login?redirect=",
    vulnerableUrl: "https://targetapp.com/login",
    caseStudy: {
      victim: "Cloud & OAuth Providers",
      year: "2016",
      story: "Phishing dalam serangan email skala Pilpres AS sukses besar karena menautkan link login resmi Google OAuth yang memiliki filter redirect longgar.",
      howItHappened: "Dinas siber menyamarkan link kejahatan di belakang link authorized OAuth. Korban mengiyakan karena URL dasar aman, namun diarahkan ke server pengamat data pembajak setelah persetujuan login selesai.",
      damage: "Pencurian ribuan surat elektronik sensitif yang sangat mengacaukan geopolitik.",
      mitigationLesson: "Selalu validasi redirect destination terhadap whitelist domain internal statis saja (Strict URL Whitelisting)."
    }
  },
  {
    id: "p3-l1",
    phase: 3,
    phaseName: "Server-Side Vulnerabilities (Intermediate)",
    title: "SQL Injection (SQLi) - Auth Bypass",
    description: "Menyisipkan karakter kontrol SQL untuk merusak query logika autentikasi database, melompati verifikasi password.",
    content: `**SQL Injection (SQLi)** terjadi ketika input pengguna digabungkan secara langsung (*string concatenation*) ke dalam kueri SQL dinamis di runtime tanpa validasi atau preparasi kueri (*prepared statement*).

SQLi Authentication Bypass memanfaatkan kelemahan ini untuk memanipulasi kueri login agar selalu bernilai logis \`TRUE\`, mengizinkan penyerang masuk tanpa mengetahui kata sandi korban.

**Query SQL asli di server:**
\`SELECT * FROM users WHERE username = '\` + **username_input** + \`' AND password = '\` + **password_input** + \`'\`

Jika kita memasukkan payload: \`admin' OR '1'='1\`
Kueri yang terbentuk akan menjadi:
\`SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = '...'\`
Karena \`'1'='1'\` selalu bernilai benar, database mengembalikan data pengguna admin pertama yang ia temukan!`,
    challenge: "Masukkan payload SQL Injection di kolom username di bawah untuk melewati fungsi login dan masuk sebagai user 'admin' tanpa password!",
    challengeObjective: "Bypass form login admin dengan memotong command SQL (') dan melengkapi query dengan bernilai TRUE.",
    placeholder: "admin' --",
    expectedPattern: "admin'\\s*(or|OR).*--|admin'\\s*--(.*)|admin'\\s*(or|OR)\\s*['\"]1['\"]\\s*=\\s*['\"]1|'\\s*(or|OR)\\s*['\"]?1['\"]?\\s*=\\s*['\"]?1",
    xp: 300,
    initialCode: "Username: ",
    vulnerableUrl: "https://target-portal.com/login",
    caseStudy: {
      victim: "TalkTalk Telecom (UK)",
      year: "2015",
      story: "Kebocoran basis data TalkTalk dipelopori peretas berumur 15 tahun menggunakan software pemindai SQL Injection otomatis pada interface pencarian lama milik web.",
      howItHappened: "Server memproses input parameter mentah dalam query database SQL secara langsung tanpa fungsi bind parameter standar. Ini meloloskan enumerasi data tabel internal.",
      damage: "Data finansial dan pribadi dari 150,000 pelanggan diekstraksi mentah-mentah, kerugian reputasi senilai £77 Juta.",
      mitigationLesson: "Setiap developer web wajib menggunakan ORM modern atau memanfaatkan teknologi prepared statements/parameterized queries tanpa pengecualian."
    }
  },
  {
    id: "p3-l2",
    phase: 3,
    phaseName: "Server-Side Vulnerabilities (Intermediate)",
    title: "OS Command Injection",
    description: "Mengeksekusi perintah shell sewenang-wenang di sistem operasi server melalui input aplikasi rentan.",
    content: `**OS Command Injection** adalah celah yang sangat kritis di mana penyerang dapat mengeksekusi perintah langsung ke shell Server (\`/bin/sh\` atau \`cmd.exe\`) karena aplikasi melewatkan input user ke fungsi shell runner (seperti \`system()\`, \`exec()\`, atau \`shell_exec()\` di PHP/Node.js) secara tidak aman.

Biasanya terjadi pada fitur utilitas jaringan seperti modul alat uji ping, pengecekan ukuran gambar, atau backup server.

**Karakter Pemisah Command (Separator):**
- **Linux & Windows**: \`;\`, \`&&\`, \`||\`, \`|\`, \`\\n\`.

**Contoh Celah Ping Utility:**
Sistem menjalankan: \`ping -c 4 \` + **user_ip**
Jika kita menginput IP: \`8.8.8.8; whoami\`
Sistem akan mengeksekusi dua perintah:
1. \`ping -c 4 8.8.8.8\`
2. Lalu mengeksekusi perintah kedua kita \`whoami\` di komputer server!`,
    challenge: "Masukkan input IP teruji di bawah, lalu sisipkan perintah shell tambahan '; whoami' untuk mengetahui identitas akun pengguna server!",
    challengeObjective: "Lakukan injeksi perintah OS dengan separator titik koma (;) untuk menjalankan whoami.",
    placeholder: "127.0.0.1; whoami",
    expectedPattern: "(;|&&|\\|)\\s*whoami",
    xp: 300,
    initialCode: "Ping target: ",
    vulnerableUrl: "https://network-tools.site/ping",
    caseStudy: {
      victim: "Equifax Credit Bureau",
      year: "2017",
      story: "Insiden kebocoran data Equifax merupakan salah satu yang terbesar dalam sejarah siber AS disebabkan karena keterlambatan penambalan celah Remote Code Execution (RCE) di apache struts.",
      howItHappened: "Framework web Apache mengevaluasi string input di dalam HTTP request header 'Content-Type' dan mengeksekusinya sebagai instruksi command shell OS backend.",
      damage: "Pencurian identitas jaminan sosial (SSN) 143 juta warga siber AS, membuahkan denda dan ganti rugi USD 1,4 Miliar.",
      mitigationLesson: "Gunakan API bawaan bahasa pemrograman daripada mengeksekusi binary system secara raw, dan perbarui librari dependensi sistem secara berkala."
    }
  },
  {
    id: "p3-l3",
    phase: 3,
    phaseName: "Server-Side Vulnerabilities (Intermediate)",
    title: "BOLA & IDOR (Direct Reference)",
    description: "Mengakses rekaman data sensitif pengguna lain secara ilegal dengan memanipulasi referensi kunci ID internal dalam URL atau API request.",
    content: `**Broken Object Level Authorization (BOLA / IDOR)** terjadi ketika server aplikasi mengekspos tautan referensi ke objek database internal (seperti ID invoice, ID profil, ID berkas) dan tidak memverifikasi apakah akun pengguna saat ini memiliki hak otorisasi untuk mengakses objek data tersebut atau tidak.

Ini adalah salah satu celah yang paling sering ditemukan pada API modern!

**Contoh Skenario:**
Kamu login sebagai akun dengan ID \`120\`. Profilmu dimuat lewat endpoint:
\`GET /api/v1/users/120/invoice\`

Sebagai hunter, kamu iseng mengganti angka ID di URL tersebut menjadi \`119\`:
\`GET /api/v1/users/119/invoice\`

Jika server mengembalikan invoice milik user ID 119 begitu saja tanpa menolak, selamat! Kamu telah menemukan bug IDOR/BOLA yang berhadiah ribuan dolar!`,
    challenge: "Kamu terdaftar dengan Invoice ID '105'. Lakukan eksploitasi URL invoice berikut untuk membaca Invoice ID '101' milik pengguna lain!",
    challengeObjective: "Manipulasi referensi ID pada path URL agar mengarah ke invoice 101 milik user lain.",
    placeholder: "GET /api/v1/users/105/invoice",
    expectedPattern: "/api/v1/users/101/invoice",
    xp: 300,
    initialCode: "GET /api/v1/users/105/invoice",
    vulnerableUrl: "https://finance-api.host/api/v1/users/105/invoice",
    caseStudy: {
      victim: "Uber Rider/Partner Platform",
      year: "2020",
      story: "Seorang Bug Hunter ulung mendeteksi celah BOLA pada API internal Uber di mana ia mampu melihat koordinat perjalanan real-time, rincian billing, serta nomor HP dari penumpang lain.",
      howItHappened: "Aplikasi hanya memeriksa kecocokan format UUID pengguna tetapi tidak menjalankan otorisasi verifikasi silang (cross-check) apakah token aktif berhak membuka UUID tersebut.",
      damage: "Celah ditambal secara senyap demi menjaga kerahasiaan jutaan perjalanan elite di Asia Pasifik, penemu diganjar bounty USD $15,000.",
      mitigationLesson: "Setiap kueri database SELECT yang melibatkan data personal wajib dicocokkan dengan User ID yang terikat erat pada session token terautentikasi."
    }
  },
  {
    id: "p4-l1",
    phase: 4,
    phaseName: "Advanced Bug Hunting & Recon (Advanced)",
    title: "Seni Rekon & Port Scanning (Nmap)",
    description: "Melakukan pemetaan permukaan serangan eksternal dengan mencari port terbuka dan layanan yang berjalan di server target.",
    content: `Bug Hunting skala industri dimulai dari **Reconnaissance (Recon)**. Kamu tidak bisa menyerang apa yang kamu tidak ketahui ada. Di sinilah **Nmap (Network Mapper)** bertindak sebagai matamu.

Nmap mengirimkan paket data jaringan khusus ke port target dan menganalisis polanya untuk menentukan status port:
- **Port Open (Terbuka)**: Layanan aktif sedang mendengarkan (misal HTTP port 80/443, SSH port 22, FTP port 21). Ini adalah area entri potensial.
- **Port Closed (Tertutup)**: Port mengembalikan respons penolakan, tidak ada layanan berjalan.
- **Port Filtered (Terfilter)**: Detektor firewall menghalangi probe Nmap sebelum sampai di port.

**Perintah Nmap Populer:**
- \`nmap -sV targetapp.com\`: Memeriksa port open sekaligus mendeteksi versi sistem perangkat lunak yang berjalan.
- \`nmap -O targetapp.com\`: Mencoba mendeteksi sistem operasi server target.`,
    challenge: "Tuliskan perintah Nmap standar untuk mengindeks seluruh port terbuka serta mendeteksi tipe versi layanan pada host domain 'targetapp.com'!",
    challengeObjective: "Gunakan command nmap dengan flag spesifikasi versi layanan (-sV) ke targetapp.com.",
    placeholder: "nmap -sV targetapp.com",
    expectedPattern: "nmap\\s+(-sV|-A|--version-all)\\s+targetapp\\.com|nmap\\s+targetapp\\.com\\s+-sV",
    xp: 350,
    initialCode: "$ ",
    vulnerableUrl: "terminal://recon-pod-01",
    caseStudy: {
      victim: "Capital One Finance Corporation",
      year: "2019",
      story: "Seorang mantan insinyur cloud mengeksploitasi server Capital One berkat recon port jaringan longgar, menemukan instance metadata AWS yang terekspos ke publik.",
      howItHappened: "Pemindaian port eksternal melacak layanan proxy Web Application Firewall (WAF) yang rentan terhadap SSRF, membolehkan pembacaan port internal sensitif.",
      damage: "Data keuangan 100 juta pelanggan luluh lantak bocor, denda ganti rugi ratusan juta USD.",
      mitigationLesson: "Matikan port administratif eksternal seperti SSH, RDP, atau database langsung dari paparan internet publik (Gunakan whitelist IP VPN)."
    }
  },
  {
    id: "p4-l2",
    phase: 4,
    phaseName: "Advanced Bug Hunting & Recon (Advanced)",
    title: "Celah Logika Bisnis (Business Logic)",
    description: "Mengeksploitasi cacat alur logika pembayaran atau transaksi di mana aplikasi berjalan sesuai kodenya namun melanggar aturan bisnis keuangan.",
    content: `**Business Logic Vulnerability** adalah salah satu kelas bug paling disukai karena sangat sulit dideteksi oleh pemindai otomatis (*automated scanner*). Bug ini terjadi penyimpangan alur proses logika fungsi transaksi aplikasi.

Misalnya pada sistem keranjang belanja toko online, parameter kuantitas produk dikirim mentah-mentah dari form client ke payment API:

\`POST /api/checkout\`
\`{ "itemId": 45, "quantity": 10, "price": 100000 }\`

Koperasinya mengalikan \`quantity * price\` menjadi total bayar.
Jika penyerang menyisipkan nilai kuantitas negatif: \`"quantity": -1\` atau \`-2\`, saldo total transaksi belanja mereka menjadi bernilai minus yang justru menambah saldo rekor rekening kartu kredit mereka, atau berharga Rp 0 jika ditambahkan barang mahal lainnya!`,
    challenge: "Tuliskan parameter manipulasi payload kuantitas ('quantity') negatif dengan nilai '-1' untuk memotong total harga check-out menjadi minus!",
    challengeObjective: "Manipulasi parameter transaksi agar kuantitas barang bernilai minus satu.",
    placeholder: "quantity=-1",
    expectedPattern: "quantity\\s*=\\s*-\\s*1|\"quantity\"\\s*:\\s*-1",
    xp: 350,
    initialCode: "JSON Payload:\n{\n  \"item_id\": 232,\n  \"quantity\": 1\n}",
    vulnerableUrl: "https://shop-checkout.com/api/v1/cart",
    caseStudy: {
      victim: "Starbucks Store Reward",
      year: "2016",
      story: "Bug Hunter Egor Homakov mendeteksi bug logika transaksional masif di mana ia mampu menggandakan saldo gift card miliknya secara gratis.",
      howItHappened: "Ia memicu transaksi pengiriman saldo paralel dari satu kartu ke kartu lain secara bersamaan (Race Condition). Karena server memvalidasi nilai saldo lama sebelum pengurangan selesai, kedua transfer bernilai terarsip sebagai sukses ganda.",
      damage: "Penciptaan uang reward digital Starbucks gratis tanpa batas secara tidak sah, berhasil disembuhkan lewat pelaporan Bug Bounty.",
      mitigationLesson: "Gunakan transaksi database atomik yang aman (Row-level Locking) agar proses mutasi saldo dilakukan bergantian secara sekuensial."
    }
  },
  {
    id: "p5-l1",
    phase: 5,
    phaseName: "The Professional Researcher (Hero)",
    title: "Menulis Laporan Bug Profesional (PoC & CVSS)",
    description: "Bagaimana cara mendokumentasikan temuan celah keamanan dengan Standar Industri agar diterima triage di program bergengsi.",
    content: `Menemukan bug hanyalah setengah perjuangan. Setengah perjuangan berikutnya adalah **melaporkannya**. Laporan yang buruk dapat menyebabkan bug ditolak atau dianggap duplikat (*duplicate*) tanpa bayaran (*no bounty*).

Laporan Bug Bounty standar dunia menggunakan format:
1. **Title**: Padat dan informatif. Format: \`[Tipe_Bug] di [Endpoint] menyebabkan [Dampak]\`.
2. **Description**: Deskripsi singkat apa celah keamanannya.
3. **Step to Reproduce (Siber PoC)**: Langkah 1-2-3 yang sangat mendetil, agar reviewer triage dapat mereproduksi persis bug buatanmu.
4. **Impact**: Dampak nyata celah tersebut terhadap bisnis dan keselamatan data pengguna (misal: "Mengambil alih seluruh sesi pembayaran dan memicu pencurian identitas").
5. **Mitigation / Remediation**: Rekomendasi solusi bagi developer perusahaan untuk memperbaiki kodingan mereka.

Standardisasi tingkat keparahan bug biasanya dikategorikan menggunakan **CVSS (Common Vulnerability Scoring System)** dari Low, Medium, High, hingga Critical.`,
    challenge: "Langkah terpenting bagi tim triage untuk mengonfirmasi validitas bug-mu di laporan adalah menyertakan instruksi langkah demi langkah yang disebut...",
    challengeObjective: "Tuliskan istilah langkah demonstrasi reproduksi bug (umum disingkat PoC atau Step to Reproduce).",
    placeholder: "Tulis singkat (misal: 'Proof of Concept')",
    expectedPattern: "(proof of concept|poc|step\\s*to\\s*reproduce|cara\\s*reproduksi)",
    xp: 400,
    initialCode: "",
    vulnerableUrl: "https://bugcrowd.com/submissions",
    caseStudy: {
      victim: "HackerOne / Bugcrowd Triage Platforms",
      year: "2022",
      story: "Komunitas internasional bug hunter menyepakati bahwa kualitas penulisan laporan menentukan kecepatan triaging dan persentase bonus finansial (bounty multipliers).",
      howItHappened: "Laporan tanpa Proof of Concept (PoC) memicu miskomunikasi antara researcher dan developer. Sebaliknya, laporan siber dengan video reproduksi jelas yang runtut langsung diakui dan diberi prioritas perbaikan.",
      damage: "Bug duplikat dan penolakan (Not Applicable) menurun drastis sebesar 45% setelah standarisasi format laporan PoC diberlakukan.",
      mitigationLesson: "Investasikan waktu risetmu untuk mematangkan tulisan laporan, tawarkan mitigasi siap pakai, dan perlakukan developer sebagai mitra, bukan musuh."
    }
  }
];

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export default function App() {
  // Gamification States
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('cybermentor_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [solvedLessons, setSolvedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('cybermentor_solved');
    return saved ? JSON.parse(saved) : [];
  });
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('cybermentor_streak');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Current Lesson state
  const [activeLessonId, setActiveLessonId] = useState<string>(() => {
    const saved = localStorage.getItem('cybermentor_active_id');
    return saved || 'p1-l1';
  });

  // Sandbox Challenge State
  const [userPayload, setUserPayload] = useState<string>('');
  const [isRunningLocal, setIsRunningLocal] = useState<boolean>(false);
  const [isVerifyingAI, setIsVerifyingAI] = useState<boolean>(false);
  const [isGettingHint, setIsGettingHint] = useState<boolean>(false);
  
  // Console logs & simulator output
  const [consoleLogs, setConsoleLogs] = useState<string[]>(['[System] Arena Simulasi diaktifkan.', '[System] Siap melakukan pengujian payload...']);
  const [labSuccessMsg, setLabSuccessMsg] = useState<string | null>(null);
  const [labErrorMsg, setLabErrorMsg] = useState<string | null>(null);
  const [activeHint, setActiveHint] = useState<string | null>(null);

  // Chat integration with CyberMentor AI
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('cybermentor_chat');
    return saved ? JSON.parse(saved) : [
      {
        id: 'msg-init-1',
        role: 'model',
        text: 'Halo kawan! Selamat datang di CyberMentor AI Arena. 🕵️‍♂️🔥\n\nSaya adalah CyberMentor AI, pembimbing elit yang akan mendampingimu dari level Nol (Zero) sampai level Hero di bidang riset keamanan siber dan bug hunting!\n\nDi dashboard ini, kamu akan mempelajari kodingan rentan, melakukan simulasi eksploitasi siber, dan menyelesaikan tantangan langsung. Dapatkan XP siber untuk berkembang ke level tertinggi.\n\nApakah kamu sudah siap memulai? Silakan pilih pelajaran pertama di panel kiri atau tanyakan apa saja padaku!',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [isAITyping, setIsAITyping] = useState<boolean>(false);

  // Layout states
  const [activeTab, setActiveTab] = useState<'lecture' | 'sandbox'>('lecture');
  const [terminalTheme, setTerminalTheme] = useState<'matrix' | 'dracula' | 'cyberpunk'>('matrix');

  const currentLesson = lessonsList.find(l => l.id === activeLessonId) || lessonsList[0];

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Persistence hooks
  useEffect(() => {
    localStorage.setItem('cybermentor_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('cybermentor_solved', JSON.stringify(solvedLessons));
  }, [solvedLessons]);

  useEffect(() => {
    localStorage.setItem('cybermentor_streak', streak.toString());
  }, [streak]);

  useEffect(() => {
    localStorage.setItem('cybermentor_active_id', activeLessonId);
    // Initialize payload on switching lesson
    const defaultPayload = currentLesson.initialCode !== undefined ? currentLesson.initialCode : '';
    setUserPayload(defaultPayload);
    setLabSuccessMsg(null);
    setLabErrorMsg(null);
    setActiveHint(null);
    setConsoleLogs([
      `[Host] Beralih ke tantangan: ${currentLesson.title}`,
      `[Target Domain] ${currentLesson.vulnerableUrl || 'Local Host'}`,
      `[Objective] ${currentLesson.challengeObjective}`
    ]);
  }, [activeLessonId]);

  useEffect(() => {
    localStorage.setItem('cybermentor_chat', JSON.stringify(chatMessages));
    // Scroll to bottom of chat
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Derived Gamer Identity and Levels
  const getBountyHunterRank = (points: number) => {
    if (points >= 2000) return { title: 'Cyber Security Guru (Rank: Hero)', desc: 'Elite Researcher & Responsible Exploit Developer', level: 5 };
    if (points >= 1200) return { title: 'Elite Bug Hunter (Rank: Advanced)', desc: 'Triage Analyst & Advanced Tool Manipulator', level: 4 };
    if (points >= 600) return { title: 'Security Consultant (Rank: Intermediate)', desc: 'Server-Side vulnerability analyst', level: 3 };
    if (points >= 200) return { title: 'Vulnerability Apprentice (Rank: Beginner)', desc: 'Client-side auditor & XSS hunter', level: 2 };
    return { title: 'Absolute Zero (Rank: Novice)', desc: 'Learning common ports, HTTP, and CLI concepts', level: 1 };
  };

  const currentRank = getBountyHunterRank(xp);
  const nextRankMinXp = currentRank.level === 1 ? 200 : currentRank.level === 2 ? 600 : currentRank.level === 3 ? 1200 : currentRank.level === 4 ? 2000 : 3000;
  const currentRankMinXp = currentRank.level === 1 ? 0 : currentRank.level === 2 ? 200 : currentRank.level === 3 ? 600 : currentRank.level === 4 ? 1200 : 2000;
  const xpInCurrentRange = xp - currentRankMinXp;
  const xpNeededInCurrentRange = nextRankMinXp - currentRankMinXp;
  const xpPercentage = Math.min(100, Math.max(0, (xpInCurrentRange / xpNeededInCurrentRange) * 100));

  // Run payload locally (Regex & Rules approach)
  const handleLocalRun = () => {
    if (!userPayload.trim()) {
      setLabErrorMsg('Kamu belum memasukkan payload apapun siber!');
      return;
    }

    setIsRunningLocal(true);
    setConsoleLogs(prev => [...prev, `[Local Host] Menjalankan uji payload: "${userPayload}"...`]);

    setTimeout(() => {
      // Direct client matching using the lesson's regex pattern
      const regex = new RegExp(currentLesson.expectedPattern, 'i');
      const isMatch = regex.test(userPayload);

      setIsRunningLocal(false);

      if (isMatch) {
        setConsoleLogs(prev => [
          ...prev, 
          `[OK] Payload lulus uji regex lokal!`,
          `[Success] ${currentLesson.title} Terpecahkan! +${currentLesson.xp} XP`
        ]);
        setLabSuccessMsg('Hebat! Payload kamu lolos validasi taktis lokal. Klik "Verifikasi via AI" untuk mendapatkan analisis mendalam dan bimbingan akhir dari CyberMentor AI!');
        setLabErrorMsg(null);
      } else {
        setConsoleLogs(prev => [
          ...prev, 
          `[FAIL] Payload tidak sesuai pola siber yang diharapkan.`,
          `[Info] Coba periksa petunjuk atau minta CyberMentor AI membantumu!`
        ]);
        setLabErrorMsg('Eksploitasi gagal atau belum sesuai kriteria. Kamu bisa meminta petunjuk (Hint) dari CyberMentor jika merasa kesulitan!');
        setLabSuccessMsg(null);
      }
    }, 1000);
  };

  // Submit payload to server side Gemini verification (Auto Grader)
  const handleAIVerify = async () => {
    if (!userPayload.trim()) {
      setLabErrorMsg('Payload kosong tidak dapat diverifikasi oleh sistem AI siber.');
      return;
    }

    setIsVerifyingAI(true);
    setLabSuccessMsg(null);
    setLabErrorMsg(null);
    setConsoleLogs(prev => [...prev, `[Cloud AI] Mengunggah payload ke CyberMentor AI Grader untuk analisis siber...`]);

    try {
      const response = await fetch('/api/challenge/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          userPayload: userPayload,
          challengeObjective: currentLesson.challengeObjective,
          expectedDetails: `Model regex pencocokan offline: ${currentLesson.expectedPattern}`
        })
      });

      if (!response.ok) {
        throw new Error('Sistem AI Verifikator sedang sibuk.');
      }

      const result = await response.json();
      setIsVerifyingAI(false);

      if (result.solved) {
        setConsoleLogs(prev => [
          ...prev,
          `[Cloud AI Status] VERIFIED SUCCESS!`,
          `[Response] ${result.explanation}`
        ]);
        setLabSuccessMsg(`Validasi AI Berhasil! 🎉\n\nPenjelasan: ${result.explanation}`);
        
        // Award XP if not already solved
        if (!solvedLessons.includes(currentLesson.id)) {
          const updatedSolved = [...solvedLessons, currentLesson.id];
          setSolvedLessons(updatedSolved);
          setXp(px => px + currentLesson.xp);
          // Increase streak
          setStreak(s => s + 1);

          // Insert congratulatory model message in chat
          const congratsMsg: ChatMessage = {
            id: `msg-congrats-${Date.now()}`,
            role: 'model',
            text: `Luar biasa, kawan! 🚀 Kamu berhasil memecahkan tantangan "${currentLesson.title}"! \n\nKamu mendapatkan *+${currentLesson.xp} XP siber*. Gelarmu saat ini semakin mendekati seorang Professional Bug Hunter. \n\nPenjelasan Analisis Hacker: ${result.explanation}\n\nLangkah berikutnya, mari kita lanjut ke materi selanjutnya atau diskusikan teknik meloloskan bypass yang lain!`,
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          };
          setChatMessages(prev => [...prev, congratsMsg]);
        }
      } else {
        setConsoleLogs(prev => [
          ...prev,
          `[Cloud AI Status] VERIFICATION FAILED`,
          `[Feedback] ${result.explanation}`
        ]);
        setLabErrorMsg(`Kritik CyberMentor: ${result.explanation}`);
      }
    } catch (e: any) {
      setIsVerifyingAI(false);
      setConsoleLogs(prev => [...prev, `[ERR] Gagal tersambung dengan API AI Grader: ${e.message}`]);
      
      // Secondary fallback verification in case API key is missing or system has issue
      const regex = new RegExp(currentLesson.expectedPattern, 'i');
      if (regex.test(userPayload)) {
        setConsoleLogs(prev => [...prev, `[Info] Memicu fallback taktis offline karena server offline.`]);
        setLabSuccessMsg(`Verifikasi Berhasil (Simulasi Taktis Offline)! 🎉\n\nPayload kamu berhasil melewati saringan offline. Pertahankan prestasimu!`);
        if (!solvedLessons.includes(currentLesson.id)) {
          setSolvedLessons([...solvedLessons, currentLesson.id]);
          setXp(px => px + currentLesson.xp);
        }
      } else {
        setLabErrorMsg('Gagal memproses pengujian AI, dan payload tidak lolos uji taktis offline. Tolong atur API key siber atau perbaiki kodinganmu!');
      }
    }
  };

  // Socratic hints retrieval using Gemini AI
  const handleGetHint = async () => {
    setIsGettingHint(true);
    setConsoleLogs(prev => [...prev, `[System] Menghubungi CyberMentor untuk mendapatkan petunjuk taktis...`]);
    try {
      const response = await fetch('/api/challenge/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          userPayload: userPayload,
          challengeObjective: currentLesson.challengeObjective,
          expectedDetails: `Regex pattern: ${currentLesson.expectedPattern}`
        })
      });

      if (!response.ok) throw new Error('Mentor sibuk.');
      const result = await response.json();
      setActiveHint(result.hint);
      setConsoleLogs(prev => [...prev, `[Hint] Mentor memberikan instruksi logis.`]);
    } catch {
      // Fallback hint
      setActiveHint(`Periksa objektif pelajaran ini: "${currentLesson.challengeObjective}". Pastikan penulisan kata kunci, simbol spasi, atau parameter sesuai instruksi teori.`);
    } finally {
      setIsGettingHint(false);
    }
  };

  // Chat conversation submitting
  const handleChatSubmit = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const queryToSend = customText || currentQuery;
    if (!queryToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!customText) setCurrentQuery('');
    setIsAITyping(true);

    try {
      // Map chat messages for standard history
      const historyToSend = chatMessages.slice(-8).map(m => ({
        role: m.role,
        content: m.text
      }));

      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryToSend,
          history: historyToSend,
          currentLesson: {
            title: currentLesson.title,
            phase: currentLesson.phase,
            description: currentLesson.description,
            challenge: currentLesson.challenge
          }
        })
      });

      if (!response.ok) throw new Error('API CyberMentor sedang tidak merespons.');
      const result = await response.json();

      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'model',
        text: result.reply,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `msg-ai-err-${Date.now()}`,
        role: 'model',
        text: `Maaf kawan, koneksi ke modul kognitif CyberMentor AI terputus. 🛠️\n\nDetail Error: ${err.message || 'Mungkin GEMINI_API_KEY belum terpasang di Secrets.'}\n\nNamun jangan khawatir, kamu masih bisa menganalisis pelajaran dan memverifikasi tantangan di panel Lab secara luring!`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAITyping(false);
    }
  };

  // Jump or reset progress helper
  const handleResetProgress = () => {
    if (window.confirm('Apakah kamu ingin menyetel ulang seluruh XP dan progres belajarmu dari awal?')) {
      setXp(0);
      setSolvedLessons([]);
      setStreak(1);
      setActiveLessonId('p1-l1');
      setChatMessages([
        {
          id: 'msg-init-reset',
          role: 'model',
          text: 'Progres berhasil disetel ulang! Kita mulai lembaran baru dari nol siber. Persiapkan mentalmu untuk materi Phase 1 Lesson 1!',
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  // Quick Chat Shortcut handlers
  const handleShortcutAsk = (type: string) => {
    let question = '';
    if (type === 'explain') {
      question = `Tolong jelaskan secara mendalam tentang materi "${currentLesson.title}" (Phase ${currentLesson.phase}) ini dengan analogi sederhana yang mudah dipahami bug hunter pemula.`;
    } else if (type === 'bypass') {
      question = `Bagaimana cara seorang penetration tester melakukan bypass atau meloloskan filter umum yang membatasi celah "${currentLesson.title}"? Berikan contohnya secara etis!`;
    } else if (type === 'tips') {
      question = `Berikan saya 3 tips taktis dan instrumen yang digunakan profesional bug bounty hunter saat meriset bug di platform seperti HackerOne atau Bugcrowd!`;
    }
    handleChatSubmit(undefined, question);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* GLOWING HEADER */}
      <header className="border-b border-emerald-950 bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg shadow-emerald-950/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/50 border border-emerald-500/50 flex items-center justify-center shadow-lg shadow-emerald-500/20 animated-pulse">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-500 tracking-widest font-bold">CYBER SECURITY ACADEMY</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              CyberMentor <span className="text-emerald-400 font-mono">AI v4.0</span>
            </h1>
          </div>
        </div>

        {/* STATUS BAR ELEMENT */}
        <div className="hidden lg:flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-full px-4 py-1.5 shadow-inner">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 text-xs">Streak:</span>
            <span className="text-emerald-400 font-mono font-bold">{streak} Hari</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-full px-4 py-1.5 shadow-inner">
            <Award className="w-4 h-4 text-yellow-400 animate-bounce" />
            <span className="text-slate-400 text-xs">Total XP:</span>
            <span className="text-yellow-400 font-mono font-bold">{xp} XP</span>
          </div>

          <button 
            onClick={handleResetProgress}
            className="flex items-center gap-1.5 text-xs text-rose-400/80 hover:text-rose-400 hover:bg-rose-950/30 border border-dashed border-rose-950/40 hover:border-rose-800 px-3 py-1.5 rounded transition"
            title="Reset Progress"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset siber
          </button>
        </div>
      </header>

      {/* CORE WORKSPACE GRID */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* PANEL LEFT: PROGRESS CURRICULUM MENU */}
        <aside className="w-full md:w-80 border-r border-slate-900 bg-slate-900/40 p-4 flex flex-col gap-4 overflow-y-auto max-h-[40vh] md:max-h-[calc(100vh-5rem)]">
          {/* USER BIO CARD */}
          <div className="bg-slate-900/60 border border-emerald-950/80 rounded-xl p-4 shadow-md bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-slate-900 to-slate-950">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-slate-950 relative overflow-hidden">
                  <Skull className="w-6 h-6 text-emerald-500/80" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-black font-mono">
                  {currentRank.level}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-slate-400 text-xs font-mono">CODEHUNTER PILOT</div>
                <h3 className="font-bold text-white text-sm truncate uppercase tracking-wide">
                  {localStorage.getItem('cybermentor_user_email') || 'Cyber Cadet'}
                </h3>
                <p className="text-[10px] text-emerald-400/70 select-none truncate font-mono">
                  {currentRank.title}
                </p>
              </div>
            </div>

            {/* XP PROGRESS BAR */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>XP: {xp} / {nextRankMinXp}</span>
                <span className="text-emerald-400">{Math.round(xpPercentage)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-500 rounded-full"
                  style={{ width: `${xpPercentage}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-slate-500 italic mt-1 leading-tight">
                "{currentRank.desc}"
              </p>
            </div>
          </div>

          {/* CURRICULUM TREE */}
          <div className="flex-1 flex flex-col gap-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              Syllabus Kurikulum
            </h4>

            {/* GROUP BY PHASES */}
            {[1, 2, 3, 4, 5].map(phaseNum => {
              const phaseLessons = lessonsList.filter(l => l.phase === phaseNum);
              const isPhaseUnlocked = phaseNum === 1 || lessonsList
                .filter(l => l.phase < phaseNum)
                .every(l => solvedLessons.includes(l.id));

              return (
                <div key={phaseNum} className="space-y-1.5">
                  <div className="flex items-center justify-between px-1 py-0.5 border-b border-slate-900/50">
                    <span className="text-[11px] uppercase font-mono tracking-wider font-bold text-slate-500">
                      PHASE {phaseNum}: {phaseNum === 1 ? 'Foundations' : phaseNum === 2 ? 'Client' : phaseNum === 3 ? 'Server' : phaseNum === 4 ? 'Recon/Adv' : 'Professional'}
                    </span>
                    {!isPhaseUnlocked && (
                      <Lock className="w-3 h-3 text-slate-600" />
                    )}
                  </div>

                  <div className="space-y-1">
                    {phaseLessons.map(lesson => {
                      const isActive = activeLessonId === lesson.id;
                      const isCompleted = solvedLessons.includes(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          disabled={!isPhaseUnlocked && !isCompleted}
                          onClick={() => {
                            setActiveLessonId(lesson.id);
                            setActiveTab('lecture');
                          }}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 relative group ${
                            isActive
                              ? 'bg-slate-900/90 border-emerald-500/80 shadow-md shadow-emerald-950/25 text-white'
                              : isCompleted
                              ? 'bg-emerald-950/10 hover:bg-emerald-950/15 border-emerald-950 hover:border-emerald-900/60 text-slate-300'
                              : isPhaseUnlocked
                              ? 'bg-slate-900/20 hover:bg-slate-900/40 border-slate-950 hover:border-slate-800 text-slate-400'
                              : 'bg-slate-950/40 border-slate-950 opacity-40 cursor-not-allowed text-slate-600'
                          }`}
                        >
                          {/* Left icon state */}
                          <div className="mt-0.5">
                            {isCompleted ? (
                              <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                                <Check className="w-3 h-3 text-emerald-400" />
                              </div>
                            ) : isActive ? (
                              <div className="w-4.5 h-4.5 rounded-full bg-emerald-900/50 border border-emerald-500 flex items-center justify-center animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              </div>
                            ) : !isPhaseUnlocked ? (
                              <Lock className="w-4 h-4 text-slate-600" />
                            ) : (
                              <div className="w-4.5 h-4.5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono group-hover:border-slate-500">
                                🚀
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 overflow-hidden">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase group-hover:text-slate-400">
                                Lesson {lesson.id.split('-l')[1]}
                              </span>
                              <span className="text-[9px] font-mono text-emerald-500/80">
                                {lesson.xp} XP
                              </span>
                            </div>
                            <h5 className="font-semibold text-xs leading-snug truncate">
                              {lesson.title}
                            </h5>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ADVANCED ETHICAL WARNING */}
          <div className="border border-dashed border-rose-950/40 bg-rose-950/5 rounded-xl p-3 text-xs leading-relaxed text-rose-400 flex items-start gap-2 mt-auto select-none">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <strong className="block font-bold text-[11px] uppercase tracking-wide">LEGAL & ETHICAL BOUNDARY</strong>
              Belajar untuk bertahan, bukan merusak. Seluruh simulasi dilarang disalahgunakan di luar platform siber ini.
            </div>
          </div>
        </aside>

        {/* WORKSPACE CENTER: INSTRUCTION & ARENA */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* TAB HEADERS FOR WORKSPACE */}
          <div className="border-b border-slate-900 bg-slate-900/20 px-6 py-2 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('lecture')}
                className={`px-4 py-2 text-xs font-bold leading-none uppercase tracking-widest rounded-lg flex items-center gap-2 transition ${
                  activeTab === 'lecture'
                    ? 'bg-slate-900 border border-slate-800 text-white shadow-inner shadow-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-950/40'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-500" />
                Teori & Konsep (Indonesian)
              </button>
              
              <button
                onClick={() => setActiveTab('sandbox')}
                className={`px-4 py-2 text-xs font-bold leading-none uppercase tracking-widest rounded-lg flex items-center gap-2 transition ${
                  activeTab === 'sandbox'
                    ? 'bg-slate-900 border border-slate-800 text-white shadow-inner shadow-black'
                    : 'text-slate-400 hover:text-white hover:bg-slate-950/40'
                }`}
              >
                <div className="relative">
                  <TerminalIcon className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </div>
                Lab Simulator & Sandbox
              </button>
            </div>

            <div className="text-xs font-mono text-slate-500 hidden sm:block">
              LESSON ID: <span className="text-emerald-500 font-bold">{currentLesson.id}</span>
            </div>
          </div>

          {/* TAB BODY WORKSPACE */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            {activeTab === 'lecture' ? (
              /* PANEL A: CONCEPT/THEORY SCREEN */
              <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
                {/* LESSON INTRO CARD */}
                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                      {currentLesson.phaseName}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 font-mono">Modul Pelajaran</span>
                  </div>

                  <h2 className="text-2xl font-black text-white mb-3 tracking-tight">
                    {currentLesson.title}
                  </h2>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    {currentLesson.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-400 font-mono flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-yellow-500" />
                      XP Reward: <span className="text-yellow-400 font-bold">{currentLesson.xp} XP</span>
                    </span>
                    <span className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-slate-400 font-mono flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Status: {solvedLessons.includes(currentLesson.id) ? (
                        <span className="text-emerald-400 font-bold uppercase tracking-wider">SELESAI</span>
                      ) : (
                        <span className="text-yellow-500 font-bold">BELUM SELESAI</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* THEORETICAL RICH MATERIAL CONTENT */}
                <div className="bg-slate-900/10 border border-slate-900 rounded-xl p-6 text-slate-300 leading-relaxed text-sm space-y-4">
                  <h3 className="text-sm font-mono font-bold text-white tracking-widest uppercase border-b border-slate-900 pb-2 mb-4 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-emerald-400" />
                    Penjelasan Teknis Celah Keamanan
                  </h3>

                  {/* Render theoretical content with some code snippets highlight */}
                  {currentLesson.content.split('\n\n').map((para, idx) => {
                    if (para.startsWith('**') && para.includes('**')) {
                      // Subheading or key lists
                      return (
                        <div key={idx} className="mt-4 first:mt-0">
                          <p className="font-bold text-white text-base" dangerouslySetInnerHTML={{ __html: para.replace(/\*\*/g, '') }} />
                        </div>
                      );
                    }
                    if (para.startsWith('- ') || para.startsWith('* ')) {
                      // Bullet points
                      return (
                        <ul key={idx} className="list-disc list-inside space-y-1.5 pl-2">
                          {para.split('\n').map((li, lIdx) => (
                            <li key={lIdx} className="text-slate-200" dangerouslySetInnerHTML={{ __html: li.replace(/[-*]\s*/, '').replace(/`([^`]+)`/g, '<code class="bg-slate-950 border border-slate-900 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>') }} />
                          ))}
                        </ul>
                      );
                    }
                    if (para.includes('`')) {
                      // Highlighted line or paragraphs with inline code
                      return (
                        <p key={idx} className="text-slate-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: para.replace(/`([^`]+)`/g, '<code class="bg-slate-950 border border-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-xs font-bold">$1</code>') }} />
                      );
                    }
                    return <p key={idx} className="text-slate-300 leading-relaxed">{para}</p>;
                  })}
                </div>

                {/* CASE STUDY SECTION */}
                {currentLesson.caseStudy && (
                  <div className="bg-slate-900/30 border border-slate-900 rounded-xl p-6 space-y-5 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between border-b border-slate-950 pb-3">
                      <div className="flex items-center gap-2">
                        <Skull className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                          Studi Kasus Dunia Nyata (Threat Intel)
                        </h3>
                      </div>
                      <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
                        Incident Report
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-lg">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">Organisasi Korban</span>
                        <span className="text-white font-bold text-sm">{currentLesson.caseStudy.victim}</span>
                      </div>
                      <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-lg">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">Tahun Kejadian</span>
                        <span className="text-amber-500 font-mono font-bold text-sm">{currentLesson.caseStudy.year}</span>
                      </div>
                      <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-lg">
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">Rekomendasi Utama</span>
                        <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 mt-0.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          Secure Mitigation
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/40 rounded-xl border border-slate-900 space-y-3">
                      <p className="text-slate-300 text-sm leading-relaxed italic font-medium">
                        "{currentLesson.caseStudy.story}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/20 border border-slate-900">
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wide">
                          <Code className="w-4 h-4 text-amber-400" />
                          Bagaimana Terjadi?
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                          {currentLesson.caseStudy.howItHappened}
                        </p>
                      </div>

                      <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/20 border border-slate-900">
                        <div className="flex items-center gap-1.5 text-red-500 font-bold uppercase tracking-wide">
                          <Skull className="w-4 h-4 text-red-500" />
                          Dampak & Kerugian
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                          {currentLesson.caseStudy.damage}
                        </p>
                      </div>

                      <div className="space-y-1.5 p-3 rounded-lg bg-slate-950/20 border border-slate-900">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wide">
                          <Shield className="w-4 h-4 text-emerald-400" />
                          Pelajaran Penting
                        </div>
                        <p className="text-slate-400 leading-relaxed">
                          {currentLesson.caseStudy.mitigationLesson}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* READY FOR EXPLOSION ACTION PANEL */}
                <div className="bg-slate-900/60 p-6 rounded-xl border border-emerald-950/20 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-white text-sm">Sudah mengerti teorinya?</h4>
                    <p className="text-xs text-slate-400">Silakan meluncur ke sub-tab Lab Sandbox untuk menuliskan payload dan meretas target simulasi!</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('sandbox')}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition hover:-translate-y-0.5 text-xs uppercase tracking-wider"
                  >
                    Buka Lab Simulasi
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* PANEL B: MOCK TERMINAL & SANDBOX SIMULATOR GRAPHICS */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
                
                {/* LEFT 7/12: SIMULATED CODING EDITOR & ACTION ZONE */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  {/* CHEATSHEET CHALLENGE HEADER */}
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-950/50 border border-orange-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Zap className="w-4.5 h-4.5 text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-wider">OBJEKTIF UTAMA TANTANGAN</span>
                        <h4 className="text-sm font-bold text-white mb-1">
                          {currentLesson.challenge}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Target siber: <span className="font-mono text-emerald-400 bg-slate-950 px-1 py-0.5 rounded">{currentLesson.vulnerableUrl || 'Local Host'}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* GLOWING EXPLOIT CODE EDITOR */}
                  <div className="flex-1 min-h-[300px] bg-slate-950 border border-slate-800 rounded-xl flex flex-col overflow-hidden relative shadow-inner">
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                    </div>

                    <div className="border-b border-slate-900 bg-slate-900/50 px-4 py-2 flex items-center gap-2">
                      <Code className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono text-slate-400">exploit_payload.txt</span>
                    </div>

                    <textarea
                      value={userPayload}
                      onChange={(e) => {
                        setUserPayload(e.target.value);
                        setLabSuccessMsg(null);
                        setLabErrorMsg(null);
                      }}
                      placeholder={currentLesson.placeholder}
                      className="flex-1 w-full p-4 bg-transparent outline-none border-none font-mono text-sm leading-relaxed text-emerald-400 placeholder:text-slate-700 resize-none h-full"
                    />

                    {/* HINT BAR IN EDITOR */}
                    {activeHint && (
                      <div className="bg-emerald-950/20 border-t border-emerald-900/60 p-3 text-xs text-emerald-400 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Petunjuk Mentor:</strong> {activeHint}
                        </div>
                      </div>
                    )}

                    {/* OPERATIONAL BUTTON DECK */}
                    <div className="border-t border-slate-900 bg-slate-900/30 px-4 py-3 flex flex-wrap gap-2.5 items-center justify-between">
                      <button
                        onClick={handleGetHint}
                        disabled={isGettingHint}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-800 disabled:opacity-50 text-slate-300 font-medium px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
                      >
                        {isGettingHint ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
                        )}
                        Minta Petunjuk siber
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={handleLocalRun}
                          disabled={isRunningLocal}
                          className="bg-slate-900 hover:bg-slate-800 border border-slate-850 disabled:opacity-50 text-emerald-400 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
                          title="Verify with basic regex checking luring"
                        >
                          <Play className="w-3.5 h-3.5 text-emerald-500" />
                          Uji Taktis
                        </button>

                        <button
                          onClick={handleAIVerify}
                          disabled={isVerifyingAI}
                          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-black px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition hover:-translate-y-0.5"
                          title="Verify with Deep AI analysis"
                        >
                          {isVerifyingAI ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                          Verifikasi via AI
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* LAB VERIFICATION MESSAGES (SUCCESS / ERROR POPUPS) */}
                  {labSuccessMsg && (
                    <div className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-300 rounded-xl p-4 text-xs space-y-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 opacity-10">
                        <CheckCircle className="w-16 h-16 text-emerald-400" />
                      </div>
                      <div className="flex items-center gap-2 font-bold text-white text-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        Aksinya Berhasil!
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{labSuccessMsg}</p>
                    </div>
                  )}

                  {labErrorMsg && (
                    <div className="bg-rose-950/20 border border-rose-500/30 text-rose-300 rounded-xl p-4 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-bold text-white text-sm">
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                        Gagal Mengeksploitasi
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{labErrorMsg}</p>
                    </div>
                  )}
                </div>

                {/* RIGHT 5/12: LIVE CHRONICLES TERMINAL OUTPUT & MOCK BROWSER PREVIEW */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  {/* TERMINAL CONTROLLER CONSOLE */}
                  <div className="bg-slate-950 border border-slate-900 rounded-xl overflow-hidden flex flex-col h-1/2 min-h-[200px]">
                    <div className="bg-slate-900/60 border-b border-slate-900/90 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TerminalIcon className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-mono font-bold text-slate-300">SYSTEM RECON TERMINAL LOGS</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => setTerminalTheme('matrix')}
                          className={`w-3.5 h-3.5 rounded-full ${terminalTheme === 'matrix' ? 'bg-emerald-500 ring-4 ring-emerald-950' : 'bg-slate-800'}`} 
                          title="Matrix Green"
                        />
                        <button 
                          onClick={() => setTerminalTheme('dracula')}
                          className={`w-3.5 h-3.5 rounded-full ${terminalTheme === 'dracula' ? 'bg-indigo-500 ring-4 ring-indigo-950' : 'bg-slate-800'}`} 
                          title="Indigo Cyber"
                        />
                      </div>
                    </div>

                    <div className={`flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-y-auto space-y-1.5 ${
                      terminalTheme === 'matrix' ? 'text-emerald-400 bg-black/95' : 'text-indigo-300 bg-indigo-950/20'
                    }`}>
                      {consoleLogs.map((log, lIdx) => (
                        <div key={lIdx} className="break-all">
                          {log.startsWith('[System]') && <span className="text-slate-400">{log}</span>}
                          {log.startsWith('[FAIL]') && <span className="text-rose-400 font-bold">{log}</span>}
                          {log.startsWith('[OK]') && <span className="text-emerald-300 font-extrabold">{log}</span>}
                          {log.startsWith('[Success]') && <span className="text-yellow-400 text-xs font-black animate-pulse">{log}</span>}
                          {log.startsWith('GET') && <span className="text-sky-300 font-semibold">{log}</span>}
                          {!log.startsWith('[') && !log.startsWith('GET') && <span className="text-slate-300">{log}</span>}
                        </div>
                      ))}
                      <div className="h-0" />
                    </div>
                  </div>

                  {/* VISUAL SITE SIMULATION TARGET PREVIEW */}
                  <div className="bg-slate-900/30 border border-slate-950 rounded-xl overflow-hidden flex flex-col h-1/2 min-h-[200px]">
                    <div className="bg-slate-900 border-b border-slate-950 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-mono text-slate-400">interactive_sandbox_view.html</span>
                      </div>
                      <span className="text-[10px] bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full text-slate-400">Sandbox Preview</span>
                    </div>

                    <div className="flex-1 bg-slate-950 p-4 shrink-0 flex flex-col justify-center items-center text-center relative overflow-hidden min-h-[160px]">
                      {/* Check current lesson rendering */}
                      {currentLesson.id === 'p1-l1' && (
                        <div className="w-full max-w-xs space-y-3 p-4 bg-slate-900 border border-slate-800 rounded-xl relative">
                          <h5 className="font-bold text-xs truncate">Database User Invoices API</h5>
                          <div className="bg-slate-950 font-mono text-[10px] p-2 rounded text-left leading-relaxed text-slate-400 border border-slate-850">
                            {userPayload.toLowerCase().includes('cookie: session=valid_admin_token') ? (
                              <div className="text-emerald-400 space-y-1">
                                <span className="text-[11px] font-black text-white bg-emerald-950/50 block p-1 border border-emerald-800/80 rounded">✔ SESSION TOKEN GRANTED!</span>
                                <div>[+] FLAG: HTTP_HEADER_MASTER_993</div>
                                <div>[+] Admin: authorized_access</div>
                              </div>
                            ) : (
                              <div className="text-rose-400">
                                ❌ HTTP/1.1 401 Unauthorized<br />
                                Reason: Missing/Invalid credentials in session Cookie!
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {currentLesson.id === 'p1-l2' && (
                        <div className="text-xs space-y-2 w-full max-w-sm">
                          <p className="text-slate-400 font-mono">Current working Directory: \`/var/www/html\`</p>
                          <div className="bg-black/80 font-mono text-left p-3 rounded border border-slate-800 space-y-1">
                            <div>$ ls -la</div>
                            <div className="text-sky-400">drwxr-xr-x  admin  64 B  .</div>
                            <div className="text-sky-400">drwxr-xr-x  root   4 KB ..</div>
                            <div className="text-emerald-400">-rw-r--r--  hack   21 B flag.txt</div>
                            {userPayload.trim().toLowerCase().includes('cat flag.txt') && (
                              <div className="text-emerald-400 bg-emerald-950/20 px-1 border border-emerald-900 mt-2 p-1 font-bold">
                                Kode Flag Kamu: CLIMASTER_EXPLORE_FILE
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {currentLesson.id === 'p2-l1' && (
                        <div className="w-full max-w-sm space-y-3">
                          <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-300">Mock Browser Parameter:</span>
                            <span className="font-mono text-[9px] text-emerald-400 underline">?q={userPayload ? encodeURIComponent(userPayload).substring(0, 30) + '...' : ''}</span>
                          </div>
                          <div className="bg-slate-900 p-4 rounded-xl border border-slate-850">
                            {userPayload.toLowerCase().includes('<script>') || userPayload.toLowerCase().includes('onerror') || userPayload.toLowerCase().includes('onload') ? (
                              <div className="text-emerald-400 animate-bounce">
                                🛡️ Pop-up alert(1) Berhasil Dipicu!
                              </div>
                            ) : (
                              <div className="text-slate-400 italic text-[11px]">
                                Menunggu injeksi javascript celah siber...
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {currentLesson.id === 'p3-l1' && (
                        <div className="w-full max-w-xs space-y-3 p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                          <h5 className="font-bold text-xs text-white">Target Login Portal</h5>
                          <div className="space-y-2 font-mono text-[10px] text-left">
                            <div>SQL Query:</div>
                            <div className="bg-black p-2 rounded text-slate-400 border border-slate-850 truncate">
                              SELECT * FROM users WHERE user='<span className="text-emerald-300 font-bold">{userPayload || 'input'}</span>' AND pass='...'
                            </div>
                            {userPayload.toLowerCase().includes('admin') && (userPayload.toLowerCase().includes('or') || userPayload.toLowerCase().includes('--')) ? (
                              <div className="text-center font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-800 p-2 rounded animate-pulse">
                                ACCESS GRANTED: Hello Admin! 🏆
                              </div>
                            ) : (
                              <div className="text-center font-bold text-rose-400 bg-slate-950 p-2 rounded">
                                Status: Segel Terbuka Hanya untuk Admin
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Fallback general static mock frame */}
                      {!['p1-l1', 'p1-l2', 'p2-l1', 'p3-l1'].includes(currentLesson.id) && (
                        <div className="space-y-2 text-center p-4">
                          <div className="relative inline-block w-12 h-12 rounded-lg bg-emerald-950/30 border border-emerald-800 flex items-center justify-center mb-1">
                            <Shield className="w-6 h-6 text-emerald-400" />
                          </div>
                          <h5 className="text-xs font-bold text-white">Simulasi Penetrasi Digital</h5>
                          <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                            Ketahanan validasi target diaktifkan secara luring untuk menguji syntax penetrasi "{currentLesson.title}".
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </main>

        {/* PANEL RIGHT: EXPANSIVE DISCUSSION COMPANION */}
        <aside className="w-full md:w-96 border-t md:border-t-0 md:border-l border-slate-900 bg-slate-950/60 p-4 flex flex-col h-[50vh] md:h-[calc(100vh-5rem)]">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-900 shrink-0">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                CyberMentor AI <span className="bg-emerald-950 border border-emerald-900 text-[9px] text-emerald-400 px-1.5 py-0.5 rounded-full select-none animate-pulse">AKTIF</span>
              </h3>
              <p className="text-[10px] text-slate-400 truncate">Saluran bimbingan etis langsung</p>
            </div>
          </div>

          {/* CHAT BUBBLES LOGS */}
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800"
          >
            {chatMessages.map((msg, idx) => {
              const isAI = msg.role === 'model';
              return (
                <div 
                  key={msg.id || idx}
                  className={`flex flex-col max-w-[85%] ${isAI ? 'self-start mr-auto' : 'self-end ml-auto'}`}
                >
                  <span className={`text-[9px] font-mono mb-1 text-slate-500 ${isAI ? 'text-left' : 'text-right'}`}>
                    {isAI ? 'CYBERMENTOR AI' : 'USER'} • {msg.timestamp}
                  </span>
                  
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    isAI
                      ? 'bg-slate-900 border border-slate-850 text-slate-200 rounded-tl-none shadow-sm'
                      : 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-emerald-500/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {isAITyping && (
              <div className="flex flex-col max-w-[85%] self-start mr-auto">
                <span className="text-[9px] font-mono mb-1 text-slate-500">CYBERMENTOR AI sedang merespons...</span>
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-850 text-slate-400 rounded-tl-none flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* CHAT DIRECT SHORTCUTS */}
          <div className="flex flex-wrap gap-1.5 py-2.5 border-t border-slate-900 shrink-0 select-none">
            <button
              onClick={() => handleShortcutAsk('explain')}
              className="text-[10px] bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 font-medium px-2.5 py-1.5 rounded-full transition flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3 text-emerald-400" />
              🎯 Jelaskan Teori
            </button>
            <button
              onClick={() => handleShortcutAsk('bypass')}
              className="text-[10px] bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 font-medium px-2.5 py-1.5 rounded-full transition flex items-center gap-1"
            >
              <Zap className="w-3 h-3 text-yellow-500" />
              ⚡ Tips Bypass Filter
            </button>
            <button
              onClick={() => handleShortcutAsk('tips')}
              className="text-[10px] bg-slate-900 hover:bg-slate-850 border border-slate-850 hover:border-slate-800 text-slate-300 font-medium px-2.5 py-1.5 rounded-full transition flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3 text-sky-400" />
              💡 Strategi Bug Bounty
            </button>
          </div>

          {/* INPUT FORM CHAT FIELD */}
          <form 
            onSubmit={handleChatSubmit}
            className="flex gap-2 shrink-0 border-t border-slate-900 pt-3"
          >
            <input
              type="text"
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              placeholder="Tanyakan teknik peretasan siber etis..."
              className="flex-1 bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
            />
            <button
              type="submit"
              disabled={isAITyping || !currentQuery.trim()}
              className="w-9 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition disabled:opacity-40 shadow-lg shadow-emerald-500/10 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </aside>

      </div>
    </div>
  );
}
