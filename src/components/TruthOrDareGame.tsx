'use client';

import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

const truths = [
    "Kapan terakhir kali kamu bohong dan tentang apa?",
    "Apa hal paling memalukan yang pernah kamu lakukan di depan umum?",
    "Siapa selebriti yang kamu naksir saat ini?",
    "Apa ketakutan terbesarmu yang tidak masuk akal?",
    "Jika kamu bisa bertukar hidup dengan temanmu selama sehari, siapa yang akan kamu pilih?",
    "Apa kebiasaan teranehmu saat sendirian?",
    "Apa hal paling kekanak-kanakan yang masih kamu lakukan?",
    "Pernahkah kamu stalking media sosial mantan?",
    "Apa hal yang paling kamu sesali tidak kamu lakukan?",
    "Apa hadiah terburuk yang pernah kamu terima?",
    "Lagu apa yang kamu nyanyikan saat mandi?",
    "Apa hal yang paling sering membuatmu diomeli orang tua?",
    "Pernahkah kamu menangis karena film? Film apa?",
    "Apa hal yang paling kamu benci tapi semua orang suka?",
    "Jika kamu bisa punya kekuatan super, apa yang akan kamu pilih?",
    "Apa kebohongan terbesar yang pernah kamu katakan kepada orang tuamu?",
    "Siapa orang yang paling ingin kamu hindari di sebuah pesta?",
    "Apa hal paling aneh yang pernah kamu cari di Google?",
    "Pernahkah kamu pura-pura sakit untuk menghindari sekolah atau kerja?",
    "Apa nama panggilan paling memalukan yang pernah kamu punya?",
    "Apa hal yang paling membuatmu cemburu dalam hubungan?",
    "Jika kamu bisa membaca pikiran satu orang di ruangan ini, siapa yang akan kamu pilih?",
    "Apa film yang membuatmu menangis paling keras?",
    "Apa hal yang paling kamu banggakan tapi jarang kamu ceritakan?",
    "Pernahkah kamu melanggar aturan yang serius?",
    "Apa mimpi paling aneh yang pernah kamu alami?",
    "Siapa orang terakhir yang kamu kepoin di media sosial?",
    "Apa hal yang paling ingin kamu ubah dari penampilanmu?",
    "Pernahkah kamu menyukai pacar temanmu?",
    "Apa hal paling mahal yang pernah kamu beli dan kamu sesali?",
    "Apa bau yang paling kamu benci?",
    "Apa hal yang paling membuatmu gugup saat bertemu orang baru?",
    "Pernahkah kamu gagal dalam ujian penting?",
    "Apa hal yang paling kamu inginkan untuk ulang tahunmu berikutnya?",
    "Jika kamu harus makan satu jenis makanan seumur hidup, apa itu?",
    "Apa hal yang paling sering kamu pikirkan sebelum tidur?",
    "Pernahkah kamu menyanyikan lagu yang salah liriknya dengan sangat percaya diri di depan umum?",
    "Apa hal yang paling membuatmu merasa tidak aman (insecure)?",
    "Siapa guru favoritmu sepanjang masa dan mengapa?",
    "Apa hal yang paling kamu rindukan dari masa kecil?",
    "Pernahkah kamu berbohong tentang usiamu?",
    "Apa hal paling konyol yang pernah membuatmu takut?",
    "Apa hal yang paling kamu suka dari dirimu sendiri?",
    "Jika kamu bisa menjadi karakter fiksi, kamu ingin jadi siapa?",
    "Apa pekerjaan rumah yang paling kamu benci?",
    "Apa hal yang paling kamu inginkan saat ini?",
    "Pernahkah kamu memecahkan sesuatu yang berharga dan menyalahkan orang lain?",
    "Apa hal yang paling kamu suka dari pasanganmu (jika ada)?",
    "Apa hal yang paling kamu tidak suka dari teman terdekatmu?",
    "Apa hal yang paling membuatmu tertawa terbahak-bahak sampai sakit perut?",
    "Apa hal yang paling kamu inginkan untuk masa depanmu dalam 5 tahun ke depan?",
    "Apa hal yang paling kamu takuti dari menjadi dewasa?",
    "Apa hal yang paling kamu banggakan dari keluargamu?",
    "Apa hal yang paling kamu benci dari media sosial?",
    "Apa hal yang paling kamu suka dari alam?",
    "Apa hal yang paling kamu inginkan dari seorang teman sejati?",
    "Apa hal yang paling kamu benci dari dirimu sendiri?",
    "Apa hal yang paling kamu suka dari musim hujan?",
    "Apa hal yang paling kamu benci dari musim panas?",
    "Apa hal yang paling kamu inginkan dalam sebuah hubungan asmara?",
    "Apa hal yang paling kamu takuti dalam sebuah hubungan asmara?",
    "Apa hal yang paling kamu suka dari masa sekolah?",
    "Apa hal yang paling kamu benci dari masa sekolah?",
    "Apa hal yang paling kamu inginkan dari orang tuamu saat ini?",
    "Apa hal yang paling kamu benci dari aturan di rumahmu?",
    "Apa rahasia yang belum pernah kamu ceritakan kepada siapa pun di ruangan ini?",
    "Kapan terakhir kali kamu merasa sangat bahagia?",
    "Apa satu hal yang orang lain tidak tahu tentang kamu?",
    "Pernahkah kamu mengambil sesuatu tanpa izin?",
    "Apa hal terbodoh yang pernah kamu lakukan demi cinta?",
    "Siapa orang yang paling berpengaruh dalam hidupmu?",
    "Apa aplikasi yang paling sering kamu buka di HP?",
    "Pernahkah kamu menyesal mengirim sebuah pesan? Pesan apa itu?",
    "Apa hal yang paling kamu inginkan saat ini selain uang?",
    "Jika kamu bisa kembali ke masa lalu, nasihat apa yang akan kamu berikan pada dirimu yang lebih muda?",
    "Apa hal yang paling kamu suka dari menjadi dirimu saat ini?",
    "Pernahkah kamu merasa benar-benar sendirian?",
    "Apa hal yang paling kamu syukuri dalam hidup?",
    "Jika kamu bisa makan malam dengan tiga orang (hidup atau mati), siapa saja mereka?",
    "Apa hal yang paling kamu benci dari sifat manusia?",
    "Apa hal yang paling membuatmu merasa hidup?",
    "Pernahkah kamu berbohong di CV atau saat wawancara kerja?",
    "Apa hal yang paling kamu banggakan dari pencapaianmu sendiri?",
    "Apa hal yang paling kamu takuti tentang masa depan?",
    "Apa hal yang paling kamu suka dari teman-temanmu?",
    "Apa hal yang paling kamu benci dari generasi sekarang?",
    "Apa hal yang paling kamu suka dari generasi sekarang?",
    "Apa hal yang paling kamu inginkan dari hidup ini?",
    "Apa hal yang paling kamu takuti dari kematian?",
    "Apa hal yang paling kamu suka dari dirimu secara fisik?",
    "Apa hal yang paling kamu benci dari dirimu secara fisik?",
    "Apa hal yang paling kamu inginkan dari pasangan ideal?",
    "Apa hal yang paling kamu benci dari hubungan yang tidak sehat?",
    "Apa hal yang paling kamu suka dari menjadi seorang anak?",
    "Apa hal yang paling kamu benci dari menjadi seorang dewasa?",
    "Apa hal yang paling kamu inginkan dari sebuah petualangan?",
    "Apa hal yang paling kamu takuti dari sebuah petualangan?"
];
const dares = [
    "Tirukan suara hewan pilihan temanmu selama 15 detik.",
    "Kirim pesan teks 'aku kangen' ke kontak ke-5 di HP-mu.",
    "Post foto selfie jelek di media sosial selama 1 menit.",
    "Bicaralah dengan aksen aneh sampai giliranmu berikutnya.",
    "Biarkan teman di sebelah kananmu membuat status di media sosialmu.",
    "Lakukan tarian TikTok yang sedang viral.",
    "Telepon ibumu dan katakan kamu sangat mencintainya.",
    "Makan sepotong lemon tanpa menunjukkan ekspresi masam.",
    "Coba lakukan 10 push-up sekarang juga.",
    "Nyanyikan lagu 'Balonku Ada Lima' dengan gaya penyanyi rock.",
    "Berpura-pura menjadi seekor kucing selama 2 menit.",
    "Gunakan kaus kaki sebagai sarung tangan sampai giliranmu berikutnya.",
    "Ceritakan lelucon garing sampai ada yang tertawa.",
    "Biarkan teman di sebelah kirimu menggambar sesuatu di wajahmu dengan spidol.",
    "Pujilah orang di seberangmu dengan cara yang paling puitis.",
    "Tiru gaya berjalan orang di sebelah kirimu sampai giliran berikutnya.",
    "Telepon teman secara acak dan nyanyikan 'Selamat Ulang Tahun' meskipun bukan hari ulang tahunnya.",
    "Buat riasan wajah yang aneh menggunakan pulpen atau spidol (yang aman untuk kulit).",
    "Coba jongkok dengan satu kaki selama 30 detik.",
    "Kirim pesan 'kamu tahu kan kalau aku...' ke orang terakhir yang kamu chat, lalu jangan balas lagi selama 10 menit.",
    "Bicara seperti robot sampai giliranmu berikutnya.",
    "Peragakan adegan film terkenal yang dipilih oleh teman-temanmu.",
    "Coba sebutkan 5 merek mobil dalam 10 detik.",
    "Lakukan moonwalk melintasi ruangan.",
    "Coba sentuh hidungmu dengan lidah. Jika tidak bisa, coba terus selama 30 detik.",
    "Biarkan grup memilih lagu untuk kamu nyanyikan dengan penuh perasaan.",
    "Buat puisi tentang kaus kaki dan bacakan dengan dramatis.",
    "Telepon restoran pizza dan tanyakan resep adonan rahasia mereka.",
    "Kenakan pakaianmu secara terbalik (luar di dalam) sampai giliran berikutnya.",
    "Coba untuk tidak berkedip selama mungkin.",
    "Bicaralah dengan suara yang sangat tinggi atau sangat rendah sampai giliran berikutnya.",
    "Lakukan tarian perut selama 30 detik.",
    "Buat gaya rambut aneh menggunakan barang-barang di sekitarmu (karet, pulpen, dll).",
    "Ceritakan kembali dongeng terkenal dengan gaya seorang reporter berita yang heboh.",
    "Berjalan mundur selama sisa permainan (hanya di dalam ruangan).",
    "Coba untuk menyeimbangkan sendok di hidungmu selama 10 detik.",
    "Kirim 10 emoji acak ke 10 orang pertama di daftar kontak WhatsApp-mu.",
    "Akting seperti kamu adalah seorang agen rahasia yang sedang dalam misi penting.",
    "Coba untuk membuat semua orang di ruangan tertawa dalam 1 menit tanpa berbicara.",
    "Ucapkan alfabet mundur secepat yang kamu bisa.",
    "Biarkan seseorang menggelitikmu selama 30 detik.",
    "Kenakan selimut seperti jubah pahlawan super sampai giliran berikutnya.",
    "Coba untuk melakukan rap spontan tentang benda pertama yang kamu lihat.",
    "Berpura-pura menjadi seorang turis yang tersesat dan bertanya arah kepada temanmu.",
    "Lakukan 20 lompat bintang (jumping jacks).",
    "Tutup matamu dan tebak benda yang diberikan oleh temanmu hanya dengan merabanya.",
    "Biarkan temanmu memilihkan gambar profil baru untuk salah satu media sosialmu selama satu jam.",
    "Kirim pesan suara ke temanmu sambil menyanyikan lagu anak-anak.",
    "Coba untuk meniru gaya bicara salah satu teman di ruangan ini.",
    "Buat menara tertinggi yang kamu bisa menggunakan barang-barang di atas meja.",
    "Lakukan 'plank' selama 1 menit.",
    "Kirim pesan ke grup chat 'Guys, aku punya pengumuman penting...' lalu jangan katakan apa-apa lagi.",
    "Makan satu sendok saus sambal (jika berani).",
    "Coba untuk membuat origami burung dari kertas tisu.",
    "Bicaralah hanya dengan menggunakan pertanyaan sampai giliranmu berikutnya.",
    "Gunakan nama panggilan aneh untuk semua orang di ruangan ini.",
    "Berjalan seperti kepiting dari satu ujung ruangan ke ujung lainnya.",
    "Coba untuk menjilat sikumu sendiri.",
    "Biarkan temanmu mengirim satu pesan aneh ke salah satu kontakmu.",
    "Lakukan catwalk seperti seorang model profesional.",
    "Berpura-pura menjadi seorang penyiar radio yang sedang membawakan acara.",
    "Coba untuk membuat suara tetesan air hanya dengan mulutmu.",
    "Kenakan sepatu di tanganmu dan coba untuk bertepuk tangan.",
    "Ucapkan 'pisang' setelah setiap kalimat yang kamu katakan.",
    "Tiru emoji favoritmu dengan wajahmu.",
    "Coba untuk menahan tawa saat teman-temanmu mencoba membuatmu tertawa.",
    "Berdiri dengan satu kaki selama sisa putaran permainan.",
    "Buat cerita seram singkat tentang benda di sebelah kananmu.",
    "Coba untuk berbicara tanpa menggerakkan bibirmu (ventriloquist).",
    "Biarkan temanmu mengatur ulang aplikasi di layar utama HP-mu.",
    "Lakukan gerakan robot selama 1 menit penuh.",
    "Nyanyikan semua yang kamu katakan (seperti di opera) sampai giliran berikutnya.",
    "Coba untuk meniru suara notifikasi HP yang paling umum.",
    "Berpura-pura bahwa kamu adalah seorang reporter cuaca yang sedang melaporkan cuaca di dalam ruangan.",
    "Tulis namamu di udara dengan pinggulmu.",
    "Coba untuk membuat suara dengkuran yang paling realistis.",
    "Berikan pelukan canggung kepada bantal atau guling.",
    "Bicaralah dengan rima selama 2 menit.",
    "Coba untuk melakukan sulap sederhana dengan koin atau pulpen.",
    "Biarkan seseorang memilihkan aksesori aneh untuk kamu pakai.",
    "Berpura-pura menjadi seorang kritikus makanan yang sedang mengulas segelas air putih.",
    "Lakukan tarian interpretatif tentang bagaimana harimu sejauh ini.",
    "Coba untuk meniru suara modem dial-up.",
    "Berikan pidato penerimaan penghargaan Oscar untuk hal acak.",
    "Berjalan dengan gaya slow-motion setiap kali kamu bergerak.",
    "Coba untuk menyentuh langit-langit tanpa melompat.",
    "Berpura-pura menjadi seorang detektif yang sedang menginvestigasi sebuah kejahatan di ruangan ini.",
    "Buat suara drum solo hanya dengan menggunakan mulut dan mejamu.",
    "Coba untuk mengatakan 'supercalifragilisticexpialidocious' mundur.",
    "Berikan tur keliling ruangan seolah-olah kamu adalah seorang pemandu wisata.",
    "Coba untuk membuat temanmu menebak sebuah film hanya dengan menggunakan ekspresi wajah.",
    "Berpura-pura menjadi seorang guru yang sedang mengajar topik yang sangat membosankan.",
    "Lakukan tos dengan semua orang di ruangan ini menggunakan kakimu.",
    "Coba untuk membuat bayangan tangan berbentuk binatang yang rumit.",
    "Berikan monolog dramatis tentang betapa kamu mencintai pizza."
];

export default function TruthOrDareGame() {
    const [gameState, setGameState] = useState('choice'); // 'choice' or 'result'
    const [resultType, setResultType] = useState('');
    const [resultText, setResultText] = useState('');
    const [lastTruthIndex, setLastTruthIndex] = useState(-1);
    const [lastDareIndex, setLastDareIndex] = useState(-1);
    const [isFlipping, setIsFlipping] = useState(false);

    const showResult = (type: 'truth' | 'dare') => {
        let text = '';
        let newIndex: number;

        if (type === 'truth') {
            do {
                newIndex = Math.floor(Math.random() * truths.length);
            } while (newIndex === lastTruthIndex && truths.length > 1);
            setLastTruthIndex(newIndex);
            text = truths[newIndex];
            setResultType('TRUTH');
        } else {
            do {
                newIndex = Math.floor(Math.random() * dares.length);
            } while (newIndex === lastDareIndex && dares.length > 1);
            setLastDareIndex(newIndex);
            text = dares[newIndex];
            setResultType('DARE');
        }

        setIsFlipping(true);
        setTimeout(() => {
            setResultText(text);
            setGameState('result');
            setIsFlipping(false);
        }, 400); // Halfway through the animation
    };

    const resetGame = () => {
        setGameState('choice');
    };

    return (
        <div className="w-full max-w-lg text-center font-nunito">
            <style jsx>{`
                .font-display { font-family: var(--font-poppins), sans-serif; }
                .neon-text { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff00de, 0 0 30px #ff00de, 0 0 40px #ff00de, 0 0 55px #ff00de, 0 0 75px #ff00de; }
                .btn-choice { transition: all 0.3s ease; border: 2px solid; text-transform: uppercase; letter-spacing: 2px; position: relative; overflow: hidden; }
                .btn-choice:before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; transition: all 0.5s ease; z-index: 0; }
                .btn-choice:hover:before { left: 0; }
                .btn-truth { border-color: #00f7ff; color: #00f7ff; box-shadow: 0 0 15px rgba(0, 247, 255, 0.5); }
                .btn-truth:before { background: #00f7ff; }
                .btn-dare { border-color: #ff00de; color: #ff00de; box-shadow: 0 0 15px rgba(255, 0, 222, 0.5); }
                .btn-dare:before { background: #ff00de; }
                .btn-choice:hover { color: #1a1a2e; transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
                .btn-choice span { position: relative; z-index: 1; }
                #card { background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); transform-style: preserve-3d; }
                .card-flip { animation: flip 0.8s forwards; }
                @keyframes flip {
                    from { transform: rotateY(90deg); opacity: 0; }
                    to { transform: rotateY(0deg); opacity: 1; }
                }
            `}</style>
            
            <header className="mb-10">
                <h1 className="font-display text-6xl font-bold neon-text">Truth or Dare</h1>
            </header>

            <main>
                <div id="choice-screen" className={cn({ 'hidden': gameState !== 'choice' })}>
                    <p className="mb-8 text-lg text-gray-400">Pilih salah satu...</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button onClick={() => showResult('truth')} className="btn-choice btn-truth font-bold py-4 px-12 rounded-lg text-2xl">
                            <span>Truth</span>
                        </button>
                        <button onClick={() => showResult('dare')} className="btn-choice btn-dare font-bold py-4 px-12 rounded-lg text-2xl">
                            <span>Dare</span>
                        </button>
                    </div>
                </div>

                <div id="result-screen" className={cn({ 'hidden': gameState !== 'result' })}>
                    <div id="card" className={cn('min-h-[250px] p-8 rounded-2xl flex flex-col justify-center items-center', { 'card-flip': gameState === 'result' && !isFlipping })}>
                        <h2 className={cn('font-display text-3xl font-bold mb-4', {
                            'text-cyan-400 neon-text': resultType === 'TRUTH',
                            'text-pink-500 neon-text': resultType === 'DARE'
                        })}>
                            {resultType}
                        </h2>
                        <p className="text-xl leading-relaxed">{resultText}</p>
                    </div>
                    <button onClick={resetGame} className="mt-8 bg-gray-600 text-white font-bold py-3 px-8 rounded-full hover:bg-gray-700 transition">
                        Pemain Berikutnya
                    </button>
                </div>
            </main>
        </div>
    );
}
