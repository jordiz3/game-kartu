
'use client';

import { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

type Question = {
  category: string;
  question: string;
};

// Data Pertanyaan
const allQuestions: Question[] = [
    // Kategori: Masa Lalu & Keluarga
    { category: "Masa Lalu & Keluarga", question: "Bagaimana kamu menggambarkan masa kecilmu? Apakah lebih banyak bahagia atau penuh tantangan?" },
    { category: "Masa Lalu & Keluarga", question: "Apa kenangan masa kecil yang paling membekas dan selalu membuatmu tersenyum?" },
    { category: "Masa Lalu & Keluarga", question: "Apa kenangan termanis yang menjadi favoritmu saat masa kecil?" },
    { category: "Masa Lalu & Keluarga", question: "Siapa orang yang paling kamu hormati dalam keluargamu dan mengapa?" },
    { category: "Masa Lalu & Keluarga", question: "Apakah kamu lebih dekat dengan ayah atau ibu? Apa alasannya?" },
    { category: "Masa Lalu & Keluarga", question: "Bagaimana hubunganmu dengan saudara kandungmu saat tumbuh dewasa?" },
    { category: "Masa Lalu & Keluarga", question: "Apakah kamu pernah merasa tidak dimengerti oleh keluargamu? Dalam situasi apa?" },
    { category: "Masa Lalu & Keluarga", question: "Apa tradisi keluarga yang paling kamu sukai dan ingin kita teruskan?" },
    { category: "Masa Lalu & Keluarga", question: "Apa aturan atau praktik di rumahmu saat tumbuh dewasa yang ingin kamu terapkan di keluarga kita nanti?" },
    { category: "Masa Lalu & Keluarga", question: "Sebaliknya, adakah aturan yang kamu pilih untuk tidak diikuti?" },
    { category: "Masa Lalu & Keluarga", question: "Apa makanan rumahan favoritmu yang bisa membangkitkan perasaan seperti di rumah?" },
    { category: "Masa Lalu & Keluarga", question: "Dulu kamu anak yang seperti apa? Pendiam, aktif, atau pemberontak?" },
    { category: "Masa Lalu & Keluarga", question: "Apa impian terbesarmu saat masih kecil?" },
    { category: "Masa Lalu & Keluarga", question: "Siapa tokoh atau pahlawan masa kecil yang paling kamu kagumi?" },
    { category: "Masa Lalu & Keluarga", question: "Mainan apa yang menjadi favoritmu saat kecil?" },
    { category: "Masa Lalu & Keluarga", question: "Siapa guru sekolah yang paling kamu ingat dan apa pengaruhnya bagimu?" },
    { category: "Masa Lalu & Keluarga", question: "Kalau boleh mengulang satu hari di masa kecil, hari apa yang akan kamu pilih dan mengapa?" },
    { category: "Masa Lalu & Keluarga", question: "Apa pelajaran paling berharga yang kamu dapatkan dari orang tuamu?" },
    { category: "Masa Lalu & Keluarga", question: "Siapa teman masa kecil yang paling dekat denganmu dan bagaimana kabarnya sekarang?" },
    { category: "Masa Lalu & Keluarga", question: "Apakah ada pengalaman pahit atau trauma di masa kecil yang masih membebanimu hingga kini?" },
    { category: "Masa Lalu & Keluarga", question: "Bagaimana keluargamu mengekspresikan cinta dan kasih sayang?" },
    { category: "Masa Lalu & Keluarga", question: "Apakah anak-anak seharusnya membantu pekerjaan rumah tangga? Bagaimana pandanganmu?" },
    { category: "Masa Lalu & Keluarga", question: "Apa momen keluarga yang paling kamu rindukan sampai sekarang?" },
    { category: "Masa Lalu & Keluarga", question: "Buku apa yang paling berkesan bagimu di masa kecil?" },
    { category: "Masa Lalu & Keluarga", question: "Siapa karakter Disney atau Pixar favoritmu saat tumbuh dewasa?" },
    { category: "Masa Lalu & Keluarga", question: "Dalam hal apa kamu merasa paling berbeda dari dirimu saat di bangku SMA?" },
    { category: "Masa Lalu & Keluarga", question: "Apa hal yang kamu senang lakukan saat masih kecil yang kini tidak lagi menjadi bagian dari hidupmu?" },
    { category: "Masa Lalu & Keluarga", question: "Apa kenangan masa kecil terindah yang belum pernah kamu ceritakan kepada siapa pun?" },
    { category: "Masa Lalu & Keluarga", question: "Jelaskan momen lucu atau memalukan dari masa lalumu yang selalu membuatmu tertawa." },
    { category: "Masa Lalu & Keluarga", question: "Bagaimana keluargamu memengaruhi hidupmu secara keseluruhan?" },

    // Kategori: Hubungan Terdahulu
    { category: "Hubungan Terdahulu", question: "Apa pelajaran terbesar yang kamu pelajari dari hubungan masa lalumu?" },
    { category: "Hubungan Terdahulu", question: "Apakah kamu pernah benar-benar jatuh cinta sebelumnya?" },
    { category: "Hubungan Terdahulu", question: "Seperti apa pengalaman patah hati pertamamu?" },
    { category: "Hubungan Terdahulu", question: "Seperti apa patah hati terburuk yang pernah kamu alami?" },
    { category: "Hubungan Terdahulu", question: "Apa yang kamu pelajari dari pengalaman patah hati tersebut?" },
    { category: "Hubungan Terdahulu", question: "Apakah kamu memiliki penyesalan dari hubungan masa lalumu?" },
    { category: "Hubungan Terdahulu", question: "Pernahkah kamu dikhianati dalam hubungan sebelumnya? Bagaimana kamu mengatasinya?" },
    { category: "Hubungan Terdahulu", question: "Apakah kamu masih berteman dengan mantan pasanganmu?" },
    { category: "Hubungan Terdahulu", question: "Hal sulit apa yang pernah kamu lalui di hubungan masa lalu?" },
    { category: "Hubungan Terdahulu", question: "Di hubungan masa lalumu, kapan kamu menyadari bahwa hubungan itu telah berakhir?" },
    { category: "Hubungan Terdahulu", question: "Pengalaman apa dari masa lalumu yang kamu khawatirkan akan memengaruhi masa depan kita?" },
    { category: "Hubungan Terdahulu", question: "Bagaimana pandanganmu tentang cinta dan hubungan berubah seiring waktu?" },
    { category: "Hubungan Terdahulu", question: "Apa kesalahan dari masa lalumu yang kamu harap tidak akan pernah aku ulangi?" },
    { category: "Hubungan Terdahulu", question: "Apa yang membuatku berbeda dari orang-orang yang pernah kamu cintai sebelumnya?" },
    { category: "Hubungan Terdahulu", question: "Kapan pertama kali kamu mengatakan \"Aku cinta kamu\" kepada seseorang yang bukan anggota keluargamu?" },
    { category: "Hubungan Terdahulu", question: "Pernahkah mengalami patah hati sebelum kita bertemu?" },
    { category: "Hubungan Terdahulu", question: "Apa yang jadi penyesalan terbesarmu dalam hubungan asmara sejauh ini?" },
    { category: "Hubungan Terdahulu", question: "Bagaimana caramu bisa move on dari penyesalan itu?" },

    // Kategori: Momen Pembentuk Diri
    { category: "Momen Pembentuk Diri", question: "Apa hal paling berani yang pernah kamu lakukan dalam hidup?" },
    { category: "Momen Pembentuk Diri", question: "Apa risiko terbesar yang pernah kamu ambil? Apakah kamu akan melakukannya lagi?" },
    { category: "Momen Pembentuk Diri", question: "Apa titik tertinggi dan terendah dalam hidupmu sejauh ini?" },
    { category: "Momen Pembentuk Diri", question: "Apa pencapaian terbesarmu dalam hidup sejauh ini?" },
    { category: "Momen Pembentuk Diri", question: "Apa pencapaian paling membanggakan bagimu, dan bagaimana hal tersebut membentuk dirimu saat ini?" },
    { category: "Momen Pembentuk Diri", question: "Ceritakan tentang momen ketika kamu menghadapi ketakutan dan berhasil menaklukkannya." },
    { category: "Momen Pembentuk Diri", question: "Ceritakan tentang saat kamu merasa benar-benar keluar dari zona nyamanmu." },
    { category: "Momen Pembentuk Diri", question: "Apa kesalahan terbesar yang pernah kamu buat menurutmu?" },
    { category: "Momen Pembentuk Diri", question: "Pengalaman hidup apa yang paling berdampak signifikan pada dirimu hari ini?" },
    { category: "Momen Pembentuk Diri", question: "Jika kamu bisa meminta maaf kepada seseorang dari masa lalumu, siapa orangnya dan mengapa?" },
    { category: "Momen Pembentuk Diri", question: "Ceritakan tentang seseorang yang tidak lagi kamu ajak bicara, namun kamu berharap masih berteman dengannya." },
    { category: "Momen Pembentuk Diri", question: "Apa momen paling menegangkan yang pernah kamu alami?" },
    { category: "Momen Pembentuk Diri", question: "Apa pelajaran hidup paling berharga yang pernah kamu dapat?" },
    { category: "Momen Pembentuk Diri", question: "Apa momen hidup yang membuatmu sadar akan sesuatu yang besar?" },
    { category: "Momen Pembentuk Diri", question: "Ceritakan tentang buku atau film yang meninggalkan kesan mendalam dan memengaruhi cara pandangmu terhadap kehidupan." },
    { category: "Momen Pembentuk Diri", question: "Apa pengalaman paling berharga yang pernah kamu alami?" },
    { category: "Momen Pembentuk Diri", question: "Apa hal tergila yang pernah kamu lakukan dalam hidupmu?" },
    { category: "Momen Pembentuk Diri", question: "Apa hal paling memalukan yang pernah kamu alami?" },
    { category: "Momen Pembentuk Diri", question: "Apa momen paling membahagiakan dalam hidupmu sejauh ini?" },
    { category: "Momen Pembentuk Diri", question: "Apa pengalaman yang paling menantang dalam hidupmu?" },
    { category: "Momen Pembentuk Diri", question: "Apa saran terbaik yang pernah kamu terima?" },
    { category: "Momen Pembentuk Diri", question: "Bisakah kamu berbagi momen ketika kamu merasa benar-benar bangga pada diri sendiri?" },

    // Kategori: Nilai & Prinsip
    { category: "Nilai & Prinsip", question: "Apa tiga nilai utama yang paling penting dalam hidupmu?" },
    { category: "Nilai & Prinsip", question: "Apa nilai-nilai inti yang kamu pegang dan bagaimana itu membentuk keputusanmu?" },
    { category: "Nilai & Prinsip", question: "Apa nilai terpenting yang kamu pegang dalam hidupmu?" },
    { category: "Nilai & Prinsip", question: "Apa nilai-nilai yang tidak bisa kamu kompromikan dalam hidup dan hubungan?" },
    { category: "Nilai & Prinsip", question: "Apa prinsip yang paling penting bagimu dalam hidup ini?" },
    { category: "Nilai & Prinsip", question: "Apa kompas moral atau etis yang membimbing keputusan-keputusanmu?" },
    { category: "Nilai & Prinsip", question: "Apa yang kamu percayai sebagai tujuan atau makna hidup?" },
    { category: "Nilai & Prinsip", question: "Apa arti kesetiaan buatmu?" },
    { category: "Nilai & Prinsip", question: "Seberapa penting kejujuran dalam sebuah hubungan bagi dirimu?" },
    { category: "Nilai & Prinsip", question: "Apa pendapatmu tentang berbohong demi kebaikan?" },
    { category: "Nilai & Prinsip", question: "Dalam keadaan apa, jika ada, berbohong itu boleh dilakukan?" },
    { category: "Nilai & Prinsip", question: "Apakah kamu tipe orang yang pemaaf atau pendendam?" },
    { category: "Nilai & Prinsip", question: "Apa arti pengampunan bagimu, dan bagaimana kamu mempraktikkannya?" },
    { category: "Nilai & Prinsip", question: "Bagaimana kamu memaknai agama atau spiritualitas dalam hidupmu?" },
    { category: "Nilai & Prinsip", question: "Apakah kamu menganggap dirimu orang yang religius atau lebih ke arah spiritual?" },
    { category: "Nilai & Prinsip", question: "Apakah kamu percaya pada takdir atau bahwa segala sesuatu terjadi karena suatu alasan?" },
    { category: "Nilai & Prinsip", question: "Apa pandanganmu tentang uang dan kebahagiaan?" },
    { category: "Nilai & Prinsip", question: "Seberapa penting peran keluarga dalam hidupmu?" },
    { category: "Nilai & Prinsip", question: "Apa hal yang paling kamu hargai dalam diri seseorang?" },
    { category: "Nilai & Prinsip", question: "Apa yang membuat hidupmu terasa berarti?" },
    { category: "Nilai & Prinsip", question: "Apa hal yang paling kamu syukuri dalam hidup saat ini?" },
    { category: "Nilai & Prinsip", question: "Apa yang memberimu arti dalam hidup?" },
    { category: "Nilai & Prinsip", question: "Apa pandanganmu tentang peran gender dalam hubungan dan masyarakat?" },
    { category: "Nilai & Prinsip", question: "Apa yang lebih penting bagimu: pengampunan atau penerimaan?" },
    { category: "Nilai & Prinsip", question: "Apakah kamu percaya pada kekuatan yang lebih tinggi atau sesuatu di luar dunia fisik?" },
    { category: "Nilai & Prinsip", question: "Apa arti persahabatan buatmu?" },
    { category: "Nilai & Prinsip", question: "Apa yang kamu hargai dalam sebuah persahabatan?" },
    { category: "Nilai & Prinsip", question: "Kamu ingin dikenang sebagai orang yang seperti apa?" },
    { category: "Nilai & Prinsip", question: "Apa yang kamu pikirkan tentang kematian?" },
    { category: "Nilai & Prinsip", question: "Apa kutipan atau ucapan yang sangat selaras dengan perjalanan emosionalmu?" },

    // Kategori: Impian & Tujuan
    { category: "Impian & Tujuan", question: "Apa impian terbesarmu dalam hidup?" },
    { category: "Impian & Tujuan", question: "Apa pekerjaan impianmu? Jika gaji bukan masalah, pekerjaan apa yang paling ingin kamu lakukan?" },
    { category: "Impian & Tujuan", question: "Apakah ada keterampilan atau hobi baru yang ingin kamu pelajari suatu hari nanti?" },
    { category: "Impian & Tujuan", question: "Adakah tempat di dunia ini yang sangat ingin kamu kunjungi?" },
    { category: "Impian & Tujuan", question: "Apa tujuan pribadi jangka pendek dan jangka panjangmu?" },
    { category: "Impian & Tujuan", question: "Apa yang ingin kamu capai dalam tahun ini?" },
    { category: "Impian & Tujuan", question: "Di mana kamu melihat dirimu secara pribadi dalam 5 tahun ke depan?" },
    { category: "Impian & Tujuan", question: "Apa tujuan terpenting yang ingin kamu capai dalam 10 tahun ke depan?" },
    { category: "Impian & Tujuan", question: "Apa yang membuatmu bersemangat akhir-akhir ini?" },
    { category: "Impian & Tujuan", question: "Seperti apa kehidupan ideal menurut versimu?" },
    { category: "Impian & Tujuan", question: "Pernahkah kamu menyerah pada sebuah mimpi? Ceritakan." },
    { category: "Impian & Tujuan", question: "Siapa panutanmu dalam hidup dan mengapa?" },
    { category: "Impian & Tujuan", question: "Apa yang menjadi motivasimu dalam hidup?" },
    { category: "Impian & Tujuan", question: "Apa yang membuatmu bangga dengan dirimu sendiri?" },
    { category: "Impian & Tujuan", question: "Apa arti sukses bagimu?" },
    { category: "Impian & Tujuan", question: "Apa yang akan membuatmu merasa telah mencapai kesuksesan?" },
    { category: "Impian & Tujuan", question: "Apa hal utama yang ingin kamu capai sebelum menikah?" },
    { category: "Impian & Tujuan", question: "Apa yang memotivasimu secara profesional?" },
    { category: "Impian & Tujuan", question: "Di mana kamu melihat dirimu secara profesional dalam 10 tahun ke depan?" },
    { category: "Impian & Tujuan", question: "Apa yang paling kamu banggakan dari pencapaianmu dalam hidup ini?" },
    { category: "Impian & Tujuan", question: "Apa kegiatan yang memberikanmu kedamaian atau ketenangan batin?" },
    { category: "Impian & Tujuan", question: "Apa hal yang paling ingin kamu lakukan atau alami dalam hidup ini?" },
    { category: "Impian & Tujuan", question: "Apa yang kamu lakukan untuk mengasah kreativitasmu atau mengekspresikan dirimu?" },
    { category: "Impian & Tujuan", question: "Bagikan mimpi rahasia yang belum pernah kamu ceritakan kepada siapa pun." },
    { category: "Impian & Tujuan", question: "Jelaskan petualangan atau aktivitas yang selalu ingin kamu coba." },
    { category: "Impian & Tujuan", question: "Apa yang selalu ingin kamu lakukan tetapi belum sempat?" },
    { category: "Impian & Tujuan", question: "Apa yang baru-baru ini kamu pelajari tentang dirimu sendiri?" },
    { category: "Impian & Tujuan", question: "Masih adakah mimpi-mimpi yang belum tercapai atau baru ingin kamu capai?" },
    { category: "Impian & Tujuan", question: "Jika harus memilih antara cinta dan karier, mana yang menjadi fokus hidupmu?" },
    { category: "Impian & Tujuan", question: "Apa yang paling kamu tunggu-tunggu di masa depan?" },

    // Kategori: Ketakutan & Kerentanan
    { category: "Ketakutan & Kerentanan", question: "Apa ketakutan terbesarmu dalam hidup?" },
    { category: "Ketakutan & Kerentanan", question: "Apa ketakutan terbesarmu dalam sebuah hubungan?" },
    { category: "Ketakutan & Kerentanan", question: "Apa satu-satunya ketakutan atau rasa tidak aman yang belum pernah kamu ceritakan kepada siapa pun?" },
    { category: "Ketakutan & Kerentanan", question: "Apa yang sering membuatmu khawatir atau takut, dan bagaimana aku bisa membantu mengurangi rasa itu?" },
    { category: "Ketakutan & Kerentanan", question: "Apa penyesalan terbesarmu?" },
    { category: "Ketakutan & Kerentanan", question: "Apa yang paling kamu khawatirkan tentang masa depan?" },
    { category: "Ketakutan & Kerentanan", question: "Pernahkah kamu merasa kehilangan arah? Bagaimana kamu mengatasinya?" },
    { category: "Ketakutan & Kerentanan", question: "Apa yang membebanimu saat ini?" },
    { category: "Ketakutan & Kerentanan", question: "Apa ketidakamanan terbesar kamu, dan bagaimana kamu menghadapinya?" },
    { category: "Ketakutan & Kerentanan", question: "Apa yang selalu membuatmu emosional?" },
    { category: "Ketakutan & Kerentanan", question: "Apa pelajaran terbesar yang kamu dapatkan dari pengalaman yang menyakitkan?" },
    { category: "Ketakutan & Kerentanan", question: "Apa saja hal yang ingin kamu kerjakan atau perbaiki tentang dirimu?" },
    { category: "Ketakutan & Kerentanan", question: "Emosi apa yang paling sulit untuk kamu ungkapkan, dan bagaimana kamu biasanya mengatasinya?" },
    { category: "Ketakutan & Kerentanan", question: "Apa yang membuatmu menangis terakhir kali?" },
    { category: "Ketakutan & Kerentanan", question: "Apa yang membuatmu merasa kesal, sedih, atau kecewa?" },
    { category: "Ketakutan & Kerentanan", question: "Bagaimana kamu menghadapi rasa takut dan keraguan dalam hidup?" },
    { category: "Ketakutan & Kerentanan", question: "Apa hal paling memalukan yang pernah kamu alami?" },
    { category: "Ketakutan & Kerentanan", question: "Apakah ada sesuatu dari masa lalumu yang kamu khawatirkan akan memengaruhi masa depan kita?" },
    { category: "Ketakutan & Kerentanan", question: "Jika kamu bisa mengubah satu hal tentang dirimu, apa itu dan mengapa?" },
    { category: "Ketakutan & Kerentanan", question: "Apa kekurangan terbesar yang ingin kamu atasi?" },

    // Kategori: Kesehatan Mental
    { category: "Kesehatan Mental", question: "Bagaimana kamu biasanya mengatasi stres atau tekanan dalam kehidupan sehari-hari?" },
    { category: "Kesehatan Mental", question: "Apa yang biasanya kamu lakukan untuk menenangkan diri saat merasa cemas atau stres?" },
    { category: "Kesehatan Mental", question: "Apa bentuk perawatan diri (self-care) favoritmu?" },
    { category: "Kesehatan Mental", question: "Bagaimana kamu menjaga keseimbangan antara pekerjaan dan kehidupan pribadi?" },
    { category: "Kesehatan Mental", question: "Apa pendapatmu tentang terapi atau konseling dalam hubungan?" },
    { category: "Kesehatan Mental", question: "Apa kebiasaan harianmu yang membuatmu merasa sehat dan bahagia?" },
    { category: "Kesehatan Mental", question: "Apa pola pikir yang sering kamu miliki ketika menghadapi masalah?" },
    { category: "Kesehatan Mental", question: "Bagaimana kamu menjaga kesehatan mental dalam kehidupan sehari-hari?" },
    { category: "Kesehatan Mental", question: "Bagaimana kamu mempertahankan pola pikir positif dalam situasi yang menantang?" },
    { category: "Kesehatan Mental", question: "Apa yang kamu lakukan ketika sedang menghadapi tantangan besar dalam hidupmu?" },
    { category: "Kesehatan Mental", question: "Apa hal kecil yang dapat membuatmu merasa terinspirasi atau termotivasi?" },
    { category: "Kesehatan Mental", question: "Bagaimana cara terbaik bagimu untuk mengisi diri dengan energi positif?" },
    { category: "Kesehatan Mental", question: "Bagaimana pandanganmu tentang pentingnya menjaga kesehatan fisik dan mental?" },
    { category: "Kesehatan Mental", question: "Apa yang bisa menghiburmu saat kamu sedang sedih?" },
    { category: "Kesehatan Mental", question: "Kapan kamu merasa paling kuat?" },
    { category: "Kesehatan Mental", question: "Bagaimana caramu untuk mencintai diri sendiri (self-love)?" },
    { category: "Kesehatan Mental", question: "Apa yang kamu lakukan saat merasa kehilangan arah?" },
    { category: "Kesehatan Mental", question: "Bagaimana kamu menghadapi kegagalan atau kekecewaan?" },
    { category: "Kesehatan Mental", question: "Bagaimana kamu menangani kritik atau kegagalan?" },
    { category: "Kesehatan Mental", question: "Bisakah kamu membagikan momen ketika kamu merasa emosional yang berlebihan dan bagaimana kamu mengelolanya?" },
    
    // Kategori: Definisi Cinta
    { category: "Definisi Cinta", question: "Menurutmu, apa arti cinta sejati?" },
    { category: "Definisi Cinta", question: "Apa makna cinta buatmu?" },
    { category: "Definisi Cinta", question: "Bagaimana kamu mendefinisikan sebuah komitmen?" },
    { category: "Definisi Cinta", question: "Apa arti komitmen bagimu dalam hubungan kita?" },
    { category: "Definisi Cinta", question: "Apa pendapatmu tentang komitmen jangka panjang?" },
    { category: "Definisi Cinta", question: "Apa definisi 'hubungan sehat' menurutmu?" },
    { category: "Definisi Cinta", question: "Apa bahasa cinta (love language) utamamu?" },
    { category: "Definisi Cinta", question: "Bagaimana cara favoritmu untuk mengekspresikan dan menerima cinta?" },
    { category: "Definisi Cinta", question: "Apa yang membuatmu merasa paling dicintai dan dihargai dalam hubungan kita?" },
    { category: "Definisi Cinta", question: "Jelaskan sentuhan fisik yang paling baik dalam mengkomunikasikan \"Aku cinta kamu\" kepadamu." },
    { category: "Definisi Cinta", question: "Apa hal yang paling penting yang kamu cari dalam diri pasangan?" },
    { category: "Definisi Cinta", question: "Apa yang kamu cari dalam sebuah hubungan?" },
    { category: "Definisi Cinta", question: "Apa yang menjadi fondasi penting di dalam hubungan menurutmu?" },
    { category: "Definisi Cinta", question: "Value atau nilai-nilai apa saja yang menurutmu harus ada dalam sebuah hubungan yang sehat?" },
    { category: "Definisi Cinta", question: "Apa batasan-batasan dalam hubungan ini yang perlu aku ketahui?" },
    { category: "Definisi Cinta", question: "Apa pandanganmu tentang kepercayaan dan kesetiaan dalam sebuah hubungan?" },
    { category: "Definisi Cinta", question: "Bagaimana kamu tahu kalau seseorang benar-benar mencintaimu?" },
    { category: "Definisi Cinta", question: "Apa yang membuatmu merasa aman dalam hubungan ini?" },
    { category: "Definisi Cinta", question: "Menurutmu, apakah privasi dibutuhkan dalam sebuah hubungan yang serius?" },
    { category: "Definisi Cinta", question: "Apa definisi pasangan ideal menurut pandangan pribadimu?" },

    // Kategori: Kenangan Bersama
    { category: "Kenangan Bersama", question: "Apa kenangan favoritmu tentang kita?" },
    { category: "Kenangan Bersama", question: "Apa yang kamu ingat saat pertama kali kita bertemu?" },
    { category: "Kenangan Bersama", question: "Apa kesan pertamamu tentangku?" },
    { category: "Kenangan Bersama", question: "Apa yang pertama kali membuatmu tertarik atau suka padaku?" },
    { category: "Kenangan Bersama", question: "Apa yang membuatmu jatuh cinta padaku?" },
    { category: "Kenangan Bersama", question: "Kapan kamu menyadari bahwa kamu jatuh cinta padaku?" },
    { category: "Kenangan Bersama", question: "Apa perjalanan atau kencan terbaik yang pernah kita lakukan bersama?" },
    { category: "Kenangan Bersama", question: "Momen apa dari masa lalu kita yang ingin kamu hidupkan kembali, dan mengapa?" },
    { category: "Kenangan Bersama", question: "Apa momen kita yang paling berkesan buat kamu?" },
    { category: "Kenangan Bersama", question: "Jelaskan momen ketika kamu merasa hubungan kita berkembang menjadi sesuatu yang lebih kuat." },
    { category: "Kenangan Bersama", question: "Ceritakan tentang percakapan dari awal hubungan kita yang masih melekat di pikiranmu." },
    { category: "Kenangan Bersama", question: "Apa kenangan pertama yang kamu ingat bersama?" },
    { category: "Kenangan Bersama", question: "Jika kisah cinta kita adalah sebuah buku, apa yang akan menjadi judul atau titik baliknya?" },
    { category: "Kenangan Bersama", question: "Apa lagu yang menurutmu paling cocok untuk menggambarkan hubungan kita?" },
    { category: "Kenangan Bersama", question: "Menurutmu, apa satu kata yang cocok untuk menggambarkan hubungan kita?" },
    { category: "Kenangan Bersama", question: "Kapan kamu menyadari aku akan menjadi teman hidup yang paling tepat untukmu?" },
    { category: "Kenangan Bersama", question: "Apa yang membuatmu yakin aku mencintaimu dengan tulus?" },
    { category: "Kenangan Bersama", question: "Apa momen dari masa lalu kita yang kamu syukuri kita alami bersama?" },
    { category: "Kenangan Bersama", question: "Apa momen paling berharga atau mengesankan yang pernah kita alami bersama?" },
    { category: "Kenangan Bersama", question: "Apa yang paling kamu nikmati dari setiap petualangan atau perjalanan kita bersama?" },

    // Kategori: Komunikasi & Konflik
    { category: "Komunikasi & Konflik", question: "Bagaimana kamu biasanya menangani pertengkaran atau konflik?" },
    { category: "Komunikasi & Konflik", question: "Saat kita menghadapi konflik, apa yang kamu harapkan dariku?" },
    { category: "Komunikasi & Konflik", question: "Jika kamu mengalami hari yang berat, bagaimana kamu ingin memberitahuku dan bagaimana kamu ingin aku menanggapinya?" },
    { category: "Komunikasi & Konflik", question: "Bagaimana aku bisa membuatmu merasa dihargai dan dicintai setelah kita bertengkar?" },
    { category: "Komunikasi & Konflik", question: "Apakah kamu lebih suka berbicara langsung saat ada masalah, atau membutuhkan waktu untuk berpikir dulu?" },
    { category: "Komunikasi & Konflik", question: "Menurutmu, komunikasi yang baik itu seperti apa?" },
    { category: "Komunikasi & Konflik", question: "Topik seperti apa yang kamu rasa tidak nyaman untuk kita diskusikan?" },
    { category: "Komunikasi & Konflik", question: "Bagaimana cara kita bisa lebih mendukung satu sama lain dalam mengatasi tantangan dan konflik?" },
    { category: "Komunikasi & Konflik", question: "Apa yang bisa membuatmu merasa tidak dihargai dalam sebuah hubungan?" },
    { category: "Komunikasi & Konflik", question: "Bentuk kesalahan seperti apa yang tidak bisa kamu toleransi dalam hubungan ini?" },
    { category: "Komunikasi & Konflik", question: "Pernahkah kita mempunyai masalah karena kepercayaan dalam hubungan kita?" },
    { category: "Komunikasi & Konflik", question: "Kalau lagi bertengkar, maunya diapakan? Diberi waktu atau langsung diselesaikan?" },
    { category: "Komunikasi & Konflik", question: "Ketika kamu marah, apa yang kamu harapkan aku lakukan?" },
    { category: "Komunikasi & Konflik", question: "Bagaimana perasaanmu tentang memberi dan menerima umpan balik dalam hubungan kita?" },
    { category: "Komunikasi & Konflik", question: "Adakah permasalahan yang kamu rasa belum tuntas dalam hubungan kita, namun kamu takut jika membahasnya akan membuatku marah?" },
    { category: "Komunikasi & Konflik", question: "Jika ada orang lain yang menyukaimu, bagaimana respons dan caramu menanganinya?" },
    { category: "Komunikasi & Konflik", question: "Menurutmu, apa masalah terbesar antara kita yang justru membuat kita lebih kuat sebagai pasangan?" },
    { category: "Komunikasi & Konflik", question: "Menurutmu, apa hal yang bisa merusak suatu hubungan?" },
    { category: "Komunikasi & Konflik", question: "Bagaimana kita dapat meningkatkan rasa percaya di antara kita?" },
    { category: "Komunikasi & Konflik", question: "Apa langkah yang dapat kita ambil untuk meningkatkan komunikasi kita?" },

    // Kategori: Apresiasi Pasangan
    { category: "Apresiasi Pasangan", question: "Apa yang paling kamu sukai dari diriku?" },
    { category: "Apresiasi Pasangan", question: "Apa sifat terbaik dariku menurutmu?" },
    { category: "Apresiasi Pasangan", question: "Kualitas apa dalam diriku yang kamu kagumi dan mungkin ingin kamu miliki juga?" },
    { category: "Apresiasi Pasangan", question: "Perubahan atau pertumbuhan apa yang telah kamu saksikan dalam diriku yang menghangatkan hatimu?" },
    { category: "Apresiasi Pasangan", question: "Apa hal kecil dariku yang paling kamu sukai?" },
    { category: "Apresiasi Pasangan", question: "Apa kebiasaan aku yang paling kamu suka?" },
    { category: "Apresiasi Pasangan", question: "Apa yang membuatmu merasa aku berbeda dari orang lain?" },
    { category: "Apresiasi Pasangan", question: "Apakah sifat atau tingkahku yang masih membuatmu kagum hingga saat ini?" },
    { category: "Apresiasi Pasangan", question: "Bagaimana kamu akan menggambarkan aku kepada orang asing?" },
    { category: "Apresiasi Pasangan", question: "Apa hal paling romantis yang pernah aku katakan atau lakukan untukmu?" },
    { category: "Apresiasi Pasangan", question: "Ceritakan tentang hadiah atau perlakuan tertentu dariku yang sangat menyentuh hatimu." },
    { category: "Apresiasi Pasangan", question: "Apa pujian terbaik yang pernah kamu terima dariku?" },
    { category: "Apresiasi Pasangan", question: "Apa yang paling menarik dari diriku menurutmu?" },
    { category: "Apresiasi Pasangan", question: "Kapan dan apa yang membuatmu merasa paling dicintai olehku?" },
    { category: "Apresiasi Pasangan", question: "Apakah perilaku atau tindakanku yang membuat kamu merasa paling disayang?" },
    { category: "Apresiasi Pasangan", question: "Apa yang membuatmu merasa dihargai dan dicintai?" },
    { category: "Apresiasi Pasangan", question: "Apa yang paling kamu hargai dari pasanganmu (aku)?" },
    { category: "Apresiasi Pasangan", question: "Apakah sikap atau tindakan dariku yang membuatmu merasa sangat didukung?" },
    { category: "Apresiasi Pasangan", question: "Apa yang membuatmu senang tentang hubungan kita?" },
    { category: "Apresiasi Pasangan", question: "Jika seseorang bertanya padamu, 'apa yang paling hebat dari menjalin hubungan bersamaku?' jawaban apa yang akan kamu berikan?" },

    // Kategori: Evaluasi Hubungan
    { category: "Evaluasi Hubungan", question: "Jika kamu bisa mengubah satu hal dalam hubungan kita, apa yang ingin kamu ubah?" },
    { category: "Evaluasi Hubungan", question: "Apa yang menurutmu kurang dari hubungan ini?" },
    { category: "Evaluasi Hubungan", question: "Adakah sesuatu dalam hubungan kita yang membuatmu tidak nyaman?" },
    { category: "Evaluasi Hubungan", question: "Apa yang menjadi kesulitanmu dalam menghadapi hubungan ini?" },
    { category: "Evaluasi Hubungan", question: "Apakah menurutmu kita sudah menghabiskan cukup waktu berkualitas bersama?" },
    { category: "Evaluasi Hubungan", question: "Apakah kamu pernah merasa aku menahanmu dari melakukan sesuatu?" },
    { category: "Evaluasi Hubungan", question: "Pernahkah kamu merasa cemburu dalam hubungan kita? Kapan?" },
    { category: "Evaluasi Hubungan", question: "Pernahkah kamu ragu dengan cintaku?" },
    { category: "Evaluasi Hubungan", question: "Apakah kamu pernah merasa kesepian saat bersamaku? Pada momen apa itu terjadi?" },
    { category: "Evaluasi Hubungan", question: "Pada momen apa kamu merasa aku tidak mencintaimu?" },
    { category: "Evaluasi Hubungan", question: "Apa ada hal yang kamu rasa aku kurang pahami tentangmu?" },
    { category: "Evaluasi Hubungan", question: "Apa sifat yang perlu aku tingkatkan menurutmu?" },
    { category: "Evaluasi Hubungan", question: "Kebiasaan dariku apa yang kamu benar-benar tidak suka?" },
    { category: "Evaluasi Hubungan", question: "Jika kamu bisa mengubah satu hal dari diriku, apa yang ingin kamu ubah?" },
    { category: "Evaluasi Hubungan", question: "Apa hal yang ingin kamu tingkatkan dalam hubungan kita?" },
    { category: "Evaluasi Hubungan", question: "Bagaimana perasaanmu terhadap komunikasi kita belakangan ini?" },
    { category: "Evaluasi Hubungan", question: "Apakah kamu merasa didengar dan dipahami dalam hubungan ini?" },
    { category: "Evaluasi Hubungan", question: "Apakah kepercayaan di antara kita masih terjaga?" },
    { category: "Evaluasi Hubungan", question: "Menurutmu, apa yang bisa membuat hubungan kita kuat sampai sekarang?" },
    { category: "Evaluasi Hubungan", question: "Tantangan apa saja yang berhasil kita atasi bersama?" },
    { category: "Evaluasi Hubungan", question: "Apa pelajaran paling penting dari hubungan kita sejauh ini?" },
    { category: "Evaluasi Hubungan", question: "Bagaimana kita dapat memastikan bahwa hubungan kita terus tumbuh dan berkembang seiring berjalannya waktu?" },
    { category: "Evaluasi Hubungan", question: "Apa pendapatmu mengenai keadaan hubungan kita saat ini?" },
    { category: "Evaluasi Hubungan", question: "Jika kita bisa kembali dan memberikan saran hubungan kepada diri kita yang lebih muda, apa itu?" },
    { category: "Evaluasi Hubungan", question: "Jika suatu hari hubungan kita berakhir, apa hal yang akan paling kamu rindukan?" },

    // Kategori: Tujuan Bersama
    { category: "Tujuan Bersama", question: "Menurut kamu, ke mana arah hubungan kita?" },
    { category: "Tujuan Bersama", question: "Apa harapanmu dari hubungan kita ke depannya?" },
    { category: "Tujuan Bersama", question: "Bagaimana kamu melihat masa depan kita? Apakah ada kekhawatiran yang kamu miliki?" },
    { category: "Tujuan Bersama", question: "Apa yang ingin kamu capai bersama-sama sebagai pasangan di masa depan?" },
    { category: "Tujuan Bersama", question: "Apa tujuan kita sebagai pasangan dalam setahun ke depan?" },
    { category: "Tujuan Bersama", question: "Bagaimana kamu membayangkan hidup kita bersama dalam 5, 10, atau 20 tahun?" },
    { category: "Tujuan Bersama", question: "Bagaimana aku bisa membantumu mencapai tujuan-tujuan pribadimu?" },
    { category: "Tujuan Bersama", question: "Bagaimana kita dapat saling mendukung pertumbuhan dan tujuan pribadi satu sama lain?" },
    { category: "Tujuan Bersama", question: "Adakah mimpi atau aspirasi yang bisa kita kejar bersama?" },
    { category: "Tujuan Bersama", question: "Jika kita bisa mempelajari keterampilan baru sebagai pasangan, apa yang akan kamu pilih?" },
    { category: "Tujuan Bersama", question: "Apa saja pengalaman atau tantangan baru yang bisa kita jelajahi bersama?" },
    { category: "Tujuan Bersama", question: "Bagaimana kita bisa menginspirasi dan memotivasi satu sama lain untuk menjadi versi terbaik dari diri kita?" },
    { category: "Tujuan Bersama", question: "Adakah proyek atau pencapaian pribadi yang ingin kamu raih di masa depan, dan bagaimana aku bisa membantumu meraihnya?" },
    { category: "Tujuan Bersama", question: "Apa harapan dan impianmu terkait dengan masa depan hubungan kita?" },
    { category: "Tujuan Bersama", question: "Jika kita bisa mengatasi tantangan apa pun bersama-sama, sesulit apa pun, apa yang akan kamu pilih?" },
    { category: "Tujuan Bersama", question: "Seberapa penting memiliki tujuan hidup yang sejalan dalam hubungan?" },
    { category: "Tujuan Bersama", question: "Apa cita-cita masa depan yang ingin kamu wujudkan bersama pasangan?" },
    { category: "Tujuan Bersama", question: "Apa harapanmu terhadap perjalanan liburan atau petualangan romantis bersama?" },
    { category: "Tujuan Bersama", question: "Apakah ada kegiatan atau tempat yang ingin kita kunjungi bersama di masa depan?" },
    { category: "Tujuan Bersama", question: "Jika kita membuat bucket list bersama, apa yang akan masuk di daftar pertama?" },

    // Kategori: Pernikahan & Keluarga
    { category: "Pernikahan & Keluarga", question: "Apa pendapatmu tentang pernikahan? Apa artinya bagimu?" },
    { category: "Pernikahan & Keluarga", question: "Apakah kamu ingin menikah suatu hari nanti? Kalau iya, kapan waktu yang ideal menurutmu?" },
    { category: "Pernikahan & Keluarga", question: "Apa pendapatmu tentang memiliki anak?" },
    { category: "Pernikahan & Keluarga", question: "Apakah kamu ingin punya anak? Jika ya, berapa jumlah yang kamu inginkan?" },
    { category: "Pernikahan & Keluarga", question: "Bagaimana kamu membayangkan kehidupan keluarga yang ideal?" },
    { category: "Pernikahan & Keluarga", question: "Seperti apa pola asuh yang menurutmu ideal untuk anak-anak kita kelak?" },
    { category: "Pernikahan & Keluarga", question: "Apa peran yang kamu ingin ambil dalam rumah tangga?" },
    { category: "Pernikahan & Keluarga", question: "Bagaimana pandanganmu tentang pembagian tugas rumah tangga?" },
    { category: "Pernikahan & Keluarga", question: "Apakah kamu ingin tetap bekerja setelah menikah atau memiliki anak?" },
    { category: "Pernikahan & Keluarga", question: "Apakah kamu siap berkompromi demi keluarga?" },
    { category: "Pernikahan & Keluarga", question: "Apa harapanmu terhadap pasangan dalam sebuah pernikahan?" },
    { category: "Pernikahan & Keluarga", question: "Seberapa penting restu orang tua dalam hubungan dan pernikahan kita?" },
    { category: "Pernikahan & Keluarga", question: "Apakah pernah membayangkan seperti apa kehidupan setelah menikah?" },
    { category: "Pernikahan & Keluarga", question: "Seperti apa rumah impianmu? Di mana lokasinya?" },
    { category: "Pernikahan & Keluarga", question: "Apakah kamu lebih suka tinggal di kota besar atau daerah yang tenang?" },
    { category: "Pernikahan & Keluarga", question: "Jika suatu saat kita harus tinggal berjauhan karena pekerjaan, bagaimana cara kita menjaga hubungan?" },
    { category: "Pernikahan & Keluarga", question: "Bagaimana pendapatmu tentang memperkenalkan pasangan kepada keluarga dan teman-teman terdekat?" },
    { category: "Pernikahan & Keluarga", question: "Apa peran keluarga dalam hubungan kita, dan bagaimana kamu melihat kita berinteraksi dengan keluarga masing-masing?" },
    { category: "Pernikahan & Keluarga", question: "Ceritakan pendapatmu tentang childfree." },
    { category: "Pernikahan & Keluarga", question: "Apakah pernah berpikir tentang peran menjadi orang tua?" },

    // Kategori: Keuangan Bersama
    { category: "Keuangan Bersama", question: "Menurutmu, keuangan keluarga sebaiknya dikelola bersama atau terpisah?" },
    { category: "Keuangan Bersama", question: "Apakah menurutmu pasangan harus berbagi rekening bank bersama?" },
    { category: "Keuangan Bersama", question: "Bagaimana pendapatmu tentang perencanaan keuangan untuk masa depan kita bersama?" },
    { category: "Keuangan Bersama", question: "Bagaimana sikapmu terhadap keuangan bersama dalam hubungan?" },
    { category: "Keuangan Bersama", question: "Apakah kamu lebih suka berbelanja atau menabung?" },
    { category: "Keuangan Bersama", question: "Apakah kamu lebih suka berutang untuk mendapatkan sesuatu yang diinginkan sekarang, atau menunggu dan menabung dulu?" },
    { category: "Keuangan Bersama", question: "Sebutkan sesuatu yang menurutmu selalu layak untuk dibelanjakan uang." },
    { category: "Keuangan Bersama", question: "Sebutkan sesuatu yang menurutmu tidak pernah layak untuk dibelanjakan uang." },
    { category: "Keuangan Bersama", question: "Apa penyesalan finansial terbesarmu?" },
    { category: "Keuangan Bersama", question: "Apakah kamu lebih suka menghabiskan uang untuk berkeliling dunia atau memiliki rumah impian?" },
    { category: "Keuangan Bersama", question: "Adakah mimpi besar yang ingin kita wujudkan bersama secara finansial?" },
    { category: "Keuangan Bersama", question: "Bagaimana kita bisa lebih baik dalam mengelola keuangan keluarga?" },
    { category: "Keuangan Bersama", question: "Apa tujuan keuangan jangka panjangmu?" },
    { category: "Keuangan Bersama", question: "Bagaimana perasaanmu tentang penganggaran dalam sebuah hubungan?" },
    { category: "Keuangan Bersama", question: "Apakah kamu memilih pekerjaan yang stabil dengan gaji standar atau gaji tinggi tapi tidak stabil?" },

    // Kategori: Keintiman & Gairah
    { category: "Keintiman & Gairah", question: "Seberapa sering kamu sebenarnya ingin bercinta?" },
    { category: "Keintiman & Gairah", question: "Apa yang kamu inginkan aku lakukan untuk memulai sesi bercinta?" },
    { category: "Keintiman & Gairah", question: "Foreplay seperti apa yang paling kamu sukai?" },
    { category: "Keintiman & Gairah", question: "Apakah kamu punya fantasi seksual yang ingin kamu bagikan?" },
    { category: "Keintiman & Gairah", question: "Bagaimana pendapatmu jika kita mencoba menggunakan sex toys?" },
    { category: "Keintiman & Gairah", question: "Apa kalimat, gestur, atau sentuhan yang dapat membuatmu terangsang?" },
    { category: "Keintiman & Gairah", question: "Pakaian seperti apa yang ingin kamu lihat aku kenakan untuk membuatmu bergairah?" },
    { category: "Keintiman & Gairah", question: "Di bagian mana dari kegiatan seks kita yang menurutmu terasa membosankan, dan bagaimana kita bisa mengubahnya?" },
    { category: "Keintiman & Gairah", question: "Apakah kamu suka ada suara saat bercinta atau lebih suka keheningan?" },
    { category: "Keintiman & Gairah", question: "Setelah bercinta, kegiatan apa yang paling kamu suka lakukan? Berpelukan, mengobrol, atau langsung tidur?" },
    { category: "Keintiman & Gairah", question: "Bagian tubuh mana dariku yang membuatmu paling bergairah saat melihatnya?" },
    { category: "Keintiman & Gairah", question: "Apakah ada hal yang membuatmu tidak nyaman untuk dilakukan saat bercinta?" },
    { category: "Keintiman & Gairah", question: "Apa arti \"baik di tempat tidur\" menurutmu?" },
    { category: "Keintiman & Gairah", question: "Bagaimana kehidupan seks kita memengaruhi kedekatan kita sebagai pasangan?" },
    { category: "Keintiman & Gairah", question: "Apa yang bisa kita lakukan jika salah satu dari kita menginginkan seks lebih sering daripada yang lain?" },
    { category: "Keintiman & Gairah", question: "Apa seks terbaik yang pernah kita lakukan dan mengapa?" },
    { category: "Keintiman & Gairah", question: "Apakah ada sesuatu yang selalu ingin kamu coba di ranjang?" },
    { category: "Keintiman & Gairah", question: "Bagaimana perasaanmu tentang keintiman fisik dan emosional, dan bagaimana kamu memilih untuk mengekspresikannya?" },
    { category: "Keintiman & Gairah", question: "Apakah ada bagian dari tubuhmu yang membuatmu merasa tidak aman?" },
    { category: "Keintiman & Gairah", question: "Apa yang membuatmu turn off saat foreplay atau bercinta?" },
    { category: "Keintiman & Gairah", question: "Apakah kamu keberatan jika kita menonton film porno bersama?" },
    { category: "Keintiman & Gairah", question: "Bagaimana kita bisa menjaga gairah tetap tinggi untuk bercinta di tengah kesibukan sehari-hari?" },
    { category: "Keintiman & Gairah", question: "Apa yang bisa kita lakukan untuk menjaga keintiman dalam hubungan kita?" },
    { category: "Keintiman & Gairah", question: "Apa pandanganmu tentang perselingkuhan?" },
    { category: "Keintiman & Gairah", question: "Jika aku menyukai orang lain saat masih menjalin hubungan denganmu, bagaimana kamu menyikapinya?" },

    // Kategori: Romantisme
    { category: "Romantisme", question: "Seperti apa kencan ideal menurutmu?" },
    { category: "Romantisme", question: "Apa hal paling romantis yang pernah kamu lakukan untuk seseorang?" },
    { category: "Romantisme", question: "Menurutmu, tempat apa yang paling romantis untuk kita kunjungi bersama?" },
    { category: "Romantisme", question: "Gerakan atau gestur kecil apa dariku yang selalu mencerahkan harimu?" },
    { category: "Romantisme", question: "Apa cara favoritmu untuk dirayu?" },
    { category: "Romantisme", question: "Bagaimana perasaanmu tentang menunjukkan kasih sayang di depan umum?" },
    { category: "Romantisme", question: "Menurutmu, peran apa yang harus dimainkan oleh spontanitas dan kejutan dalam hubungan kita?" },
    { category: "Romantisme", question: "Bagaimana perasaanmu saat merayakan acara-acara khusus, dan apa harapanmu dari momen tersebut?" },
    { category: "Romantisme", question: "Apa hal-hal kecil yang membuatmu merasa bahagia dan spesial dalam hubungan ini?" },
    { category: "Romantisme", question: "Kamu lebih suka quality time atau hadiah sebagai tanda cinta?" },
    { category: "Romantisme", question: "Kalau kita punya tradisi berdua, kamu ingin tradisi seperti apa?" },
    { category: "Romantisme", question: "Apa pendapat kamu soal kencan sederhana di rumah?" },
    { category: "Romantisme", question: "Kamu lebih suka aku memberimu kejutan kecil atau yang besar?" },
    { category: "Romantisme", question: "Tempat terindah apa yang pernah kamu bayangkan untuk melamarku?" },
    { category: "Romantisme", question: "Bagaimana cara terbaik bagimu untuk menjaga api cinta tetap menyala dalam hubungan jangka panjang?" },
    { category: "Romantisme", question: "Apa gerakan romantis paling berkesan yang pernah kamu buat atau terima?" },
    { category: "Romantisme", question: "Bagaimana kamu menggambarkan liburan romantis yang ideal?" },
    { category: "Romantisme", question: "Apa film paling romantis yang pernah kamu tonton?" },
    { category: "Romantisme", question: "Apa yang bisa kita lakukan untuk saling menunjukkan rasa cinta selain mengucapkan \"Aku cinta kamu\"?" },
    { category: "Romantisme", question: "Apa hal-hal yang ingin kamu lakukan bersama untuk mempererat hubungan kita?" },

    // Kategori: Imajinasi & Hipotetis
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa tinggal di manapun di dunia, kamu ingin tinggal di mana?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa bertukar kehidupan dengan siapa pun selama sehari, siapa orang itu dan mengapa?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa memiliki kekuatan super untuk satu hari, kekuatan apa yang akan kamu pilih dan apa yang akan kamu lakukan?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa melakukan perjalanan waktu, apakah kamu akan pergi ke masa lalu atau masa depan, dan mengapa?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu diberi waktu satu tahun untuk hidup, apa yang akan kamu ubah tentang caramu menghabiskan waktu?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa makan malam dengan tokoh sejarah mana pun, siapa yang akan kamu pilih dan apa yang akan kalian bicarakan?" },
    { category: "Imajinasi & Hipotetis", question: "Jika hidupmu adalah sebuah buku atau film, apa judulnya?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa memberikan satu nasihat kepada dirimu yang berusia 18 tahun, apa itu?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa menghapus satu penyesalan dari hidupmu, apa itu?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa menjadi ahli dalam satu hal secara instan, apa itu?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa mengubah satu hal di dunia ini, apa yang akan kamu ubah?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa memilih periode waktu mana pun untuk hidup, periode mana yang akan kamu pilih?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu harus melepaskan salah satu dari panca inderamu, mana yang akan kamu pilih dan mengapa?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu menulis sebuah buku, genre apa yang akan kamu tulis dan tentang apa?" },
    { category: "Imajinasi & Hipotetis", question: "Jika hari ini adalah hari terakhirmu di dunia, apa yang akan kamu lakukan?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa mengajukan satu pertanyaan kepada paranormal tentang masa depanmu, apa yang akan kamu tanyakan?" },
    { category: "Imajinasi & Hipotetis", question: "Siapa yang akan memerankanmu dalam film tentang hidupmu?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa mengingat kembali momen mana pun dari hubungan kita, manakah yang akan kamu pilih?" },
    { category: "Imajinasi & Hipotetis", question: "Jika gaji bukan masalah, apa pekerjaan yang paling ingin kamu lakukan?" },
    { category: "Imajinasi & Hipotetis", question: "Jika kamu bisa hidup di zaman apa pun, kamu pilih kapan?" },

    // Kategori: Kesenangan Sederhana
    { category: "Kesenangan Sederhana", question: "Apa hal pertama yang kamu pikirkan saat bangun di pagi hari?" },
    { category: "Kesenangan Sederhana", question: "Jelaskan harimu yang sempurna—dari pagi hingga malam." },
    { category: "Kesenangan Sederhana", question: "Apa hobi atau minat yang paling kamu nikmati?" },
    { category: "Kesenangan Sederhana", question: "Bagaimana kamu biasanya mengisi waktu luangmu?" },
    { category: "Kesenangan Sederhana", question: "Apa film atau serial TV yang bisa kamu tonton berulang kali?" },
    { category: "Kesenangan Sederhana", question: "Genre musik apa yang menjadi favoritmu?" },
    { category: "Kesenangan Sederhana", question: "Apa makanan aneh yang pernah kamu coba?" },
    { category: "Kesenangan Sederhana", question: "Apa makanan favoritmu yang bisa membuat suasana hatimu menjadi lebih baik?" },
    { category: "Kesenangan Sederhana", question: "Apa kebiasaan kecil yang membuatmu sangat bahagia?" },
    { category: "Kesenangan Sederhana", question: "Apa hal favoritmu untuk dilakukan sendirian?" },
    { category: "Kesenangan Sederhana", question: "Apa yang paling membuatmu stres saat bepergian?" },
    { category: "Kesenangan Sederhana", question: "Apakah kamu pernah ingin membuat tato? Gambar apa?" },
    { category: "Kesenangan Sederhana", question: "Apa hal yang disukai kebanyakan orang, tetapi kamu tidak menyukainya?" },
    { category: "Kesenangan Sederhana", question: "Apa hadiah terbaik yang pernah kamu terima?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu tertawa paling keras?" },
    { category: "Kesenangan Sederhana", question: "Film kartun apa yang paling kamu suka waktu kecil?" },
    { category: "Kesenangan Sederhana", question: "Hewan apa yang menurutmu paling lucu?" },
    { category: "Kesenangan Sederhana", question: "Kamu lebih suka liburan ke pantai atau pegunungan?" },
    { category: "Kesenangan Sederhana", question: "Apa tiga kata yang menurut orang lain paling sering digunakan untuk mendeskripsikanmu?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuat rumah atau tempat tinggal menjadi nyaman bagimu?" },
    { category: "Kesenangan Sederhana", question: "Apa pujian terbaik yang pernah kamu terima?" },
    { category: "Kesenangan Sederhana", question: "Apa hal termanis yang pernah seseorang lakukan untukmu?" },
    { category: "Kesenangan Sederhana", question: "Apa yang paling kamu sukai dari musim saat ini?" },
    { category: "Kesenangan Sederhana", question: "Apa aroma yang paling mengingatkanmu pada suatu kenangan indah?" },
    { category: "Kesenangan Sederhana", question: "Apa permainan papan atau video game favoritmu?" },
    { category: "Kesenangan Sederhana", question: "Kamu lebih suka kopi atau teh?" },
    { category: "Kesenangan Sederhana", question: "Apa buku terakhir yang kamu baca?" },
    { category: "Kesenangan Sederhana", question: "Apa konser terbaik yang pernah kamu datangi?" },
    { category: "Kesenangan Sederhana", question: "Apa bakat terpendam yang kamu miliki?" },
    { category: "Kesenangan Sederhana", question: "Apa hal favoritmu tentang dirimu sendiri?" },
    { category: "Kesenangan Sederhana", question: "Apa hal yang tidak kamu sukai dan ingin diubah dari dirimu?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu lakukan saat sedang bosan?" },
    { category: "Kesenangan Sederhana", question: "Apa menu andalanmu kalau masak sendiri?" },
    { category: "Kesenangan Sederhana", question: "Ada tempat nongkrong favorit yang sering kamu kunjungi?" },
    { category: "Kesenangan Sederhana", question: "Pizza dengan nanas atau tanpa nanas?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu syukuri hari ini?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa hidup?" },
    { category: "Kesenangan Sederhana", question: "Apa hal kecil yang bisa membuat harimu lebih baik?" },
    { category: "Kesenangan Sederhana", question: "Apa kebiasaan unikmu yang mungkin belum aku sadari?" },
    { category: "Kesenangan Sederhana", question: "Apa cara favoritmu untuk bersantai setelah hari yang melelahkan?" },
    { category: "Kesenangan Sederhana", question: "Apa yang paling kamu hargai dalam hidup ini?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling berarti?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu pikirkan sebelum tidur?" },
    { category: "Kesenangan Sederhana", question: "Apa hal paling spontan yang pernah kamu lakukan?" },
    { category: "Kesenangan Sederhana", question: "Apa yang ingin kamu pelajari atau kuasai dalam hidup ini?" },
    { category: "Kesenangan Sederhana", question: "Apa yang paling kamu banggakan dari pencapaianmu dalam karier sejauh ini?" },
    { category: "Kesenangan Sederhana", question: "Apa kegiatan yang dulu kamu pikir tidak menarik, tapi setelah dicoba bersamaku, ternyata seru?" },
    { category: "Kesenangan Sederhana", question: "Kamu lebih suka aku memakai gaya kasual atau formal?" },
    { category: "Kesenangan Sederhana", question: "Kalau aku sedang sedih atau marah, apa yang biasanya kamu lakukan untuk menghiburku?" },
    { category: "Kesenangan Sederhana", question: "Apa momen kita yang paling membuatmu merasa nyaman?" },
    { category: "Kesenangan Sederhana", question: "Apa tiga kesamaan yang kita miliki?" },
    { category: "Kesenangan Sederhana", question: "Apa perbedaan terbesar di antara kita yang justru membuat kita saling melengkapi?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu pelajari tentang dirimu sendiri dari hubungan kita?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu pelajari tentang aku baru-baru ini?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu masih bertahan dalam hubungan ini?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu yakin kita bisa melewati masa-masa sulit bersama?" },
    { category: "Kesenangan Sederhana", question: "Apa yang paling kamu kagumi dari hubungan orang tuamu?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu pelajari dari hubungan orang tuamu yang tidak ingin kamu ulangi?" },
    { category: "Kesenangan Sederhana", question: "Apa arti \"rumah\" bagimu? Apakah itu tempat atau perasaan?" },
    { category: "Kesenangan Sederhana", question: "Apa satu hal yang bisa aku lakukan lebih sering untuk membuatmu bahagia?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu pikirkan saat melihat bintang-bintang?" },
    { category: "Kesenangan Sederhana", question: "Apa hal paling aneh yang kamu yakini benar?" },
    { category: "Kesenangan Sederhana", question: "Apa hal kecil yang bisa membuatmu tersenyum tanpa alasan?" },
    { category: "Kesenangan Sederhana", question: "Apa lagu yang bisa langsung mengubah suasana hatimu?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu lakukan untuk merayakan keberhasilan kecil?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu anggap sebagai pengorbanan terbesar dalam hubungan?" },
    { category: "Kesenangan Sederhana", question: "Apakah kamu percaya dengan konsep \"jodoh\"?" },
    { category: "Kesenangan Sederhana", question: "Apa yang akan kamu lakukan jika kita memenangkan lotre?" },
    { category: "Kesenangan Sederhana", question: "Apa hal pertama yang akan kamu selamatkan dari rumah jika terjadi kebakaran (selain orang dan hewan peliharaan)?" },
    { category: "Kesenangan Sederhana", question: "Apa nasihat terbaik yang pernah kamu berikan kepada seseorang?" },
    { category: "Kesenangan Sederhana", question: "Apa hal yang paling membuatmu merasa paling damai?" },
    { category: "Kesenangan Sederhana", question: "Apa hal yang paling kamu rindukan dari masa sebelum pandemi?" },
    { category: "Kesenangan Sederhana", question: "Apa kebiasaan buruk yang sedang ingin kamu ubah?" },
    { category: "Kesenangan Sederhana", question: "Apa hal yang paling kamu hargai dari persahabatan kita di dalam hubungan ini?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa terhubung denganku bahkan saat kita tidak bersama?" },
    { category: "Kesenangan Sederhana", question: "Apa hal yang paling kamu syukuri tentang aku hari ini?" },
    { category: "Kesenangan Sederhana", question: "Apa satu hal yang kamu harap aku tahu tentangmu tanpa perlu kamu katakan?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa optimis tentang masa depan?" },
    { category: "Kesenangan Sederhana", question: "Apa hal yang membuatmu merasa paling kreatif?" },
    { category: "Kesenangan Sederhana", question: "Apa yang akan kamu lakukan jika memiliki satu jam ekstra dalam sehari?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu anggap sebagai kemewahan sejati dalam hidup?" },
    { category: "Kesenangan Sederhana", question: "Apa hal yang paling kamu nikmati dari kesendirian?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling berenergi?" },
    { category: "Kesenangan Sederhana", question: "Apa hal yang paling ingin kamu otomatisasi dalam hidupmu?" },
    { category: "Kesenangan Sederhana", question: "Apa hal yang paling kamu hargai dari teknologi?" },
    { category: "Kesenangan Sederhana", question: "Apa hal yang paling kamu benci dari teknologi?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu pikirkan tentang media sosial?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling terinspirasi?" },
    { category: "Kesenangan Sederhana", question: "Apa yang kamu anggap sebagai petualangan terbesar dalam hidup?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling hidup?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling rentan?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling kuat?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling dicintai?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling dipahami?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling didukung?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling bebas?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling terikat?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling bersyukur?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling bangga?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling bahagia?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling sedih?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling marah?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling takut?" },
    { category: "Kesenangan Sederhana", question: "Apa yang membuatmu merasa paling bersemangat?" },
    { category: "Kesenangan Sederhana", question: "Jika kamu bisa mengatakan satu hal kepada seluruh dunia saat ini, apa yang akan kamu katakan?" }
];

const uniqueCategories = ['Acak Semua', ...new Set(allQuestions.map(q => q.category))];

export default function DeepTalkGame() {
  const [gameState, setGameState] = useState<'category' | 'game'>('category');
  const [gameTitle, setGameTitle] = useState('Kartu Deep Talk');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [lastQuestionIndex, setLastQuestionIndex] = useState(-1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const selectCategory = (category: string) => {
    let questions;
    if (category === 'Acak Semua') {
      questions = [...allQuestions];
      setGameTitle("Kartu Deep Talk (Acak)");
    } else {
      questions = allQuestions.filter(q => q.category === category);
      setGameTitle(`Kategori: ${category}`);
    }
    setCurrentQuestions(questions);
    setGameState('game');
    setIsFlipped(false);
    setCurrentQuestion(null); // Reset question so the front of the card shows
    setLastQuestionIndex(-1); // Reset last index for the new category
  };

  const showCategorySelection = () => {
    setGameState('category');
  };
  
  const drawCard = () => {
    if (isAnimating || currentQuestions.length === 0) return;

    setIsAnimating(true);
    
    // If a card is already shown, flip it back first
    if (isFlipped) {
      setIsFlipped(false);
      // Wait for flip-out animation before drawing a new card
      setTimeout(getNewCard, 300);
    } else {
      getNewCard();
    }
  };

  const getNewCard = () => {
    let randomIndex;
    // Ensure new card is different from the last one if there's more than one card
    if (currentQuestions.length > 1) {
      do {
        randomIndex = Math.floor(Math.random() * currentQuestions.length);
      } while (randomIndex === lastQuestionIndex);
    } else {
      randomIndex = 0;
    }
  
    setLastQuestionIndex(randomIndex);
    const nextQuestion = currentQuestions[randomIndex];
    
    setCurrentQuestion(nextQuestion);
    setIsFlipped(true);
    // Animation of flip-in takes 600ms
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <>
      {/* Layar Pemilihan Kategori */}
      <div className={cn("w-full max-w-lg text-center transition-all duration-500 ease-in-out", { 'absolute opacity-0 pointer-events-none': gameState !== 'category', 'relative opacity-100': gameState === 'category' })}>
        <h1 className="font-display text-4xl md:text-5xl text-gray-800">Pilih Kategori</h1>
        <p className="text-gray-600 mt-2 mb-8">Pilih topik untuk memulai percakapan.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {uniqueCategories.map(category => (
            <button
              key={category}
              onClick={() => selectCategory(category)}
              className="category-btn bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg shadow-sm"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Layar Game Utama */}
      <div className={cn("w-full flex flex-col items-center justify-center transition-all duration-500 ease-in-out", { 'absolute opacity-0 pointer-events-none': gameState !== 'game', 'relative opacity-100': gameState === 'game' })}>
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl md:text-5xl text-gray-800">{gameTitle}</h1>
          <p className="text-gray-600 mt-2">Ambil kartu untuk memulai percakapan.</p>
        </div>

        {/* Kontainer Kartu */}
        <div style={{ perspective: '1000px' }} className="w-full max-w-md h-80 md:h-96">
          <div
            className={cn(
              "card-element relative w-full h-full rounded-2xl shadow-lg",
              { 'is-flipped': isFlipped }
            )}
          >
            {/* Sisi Depan Kartu */}
            <div className="card-face card-front absolute w-full h-full bg-white rounded-2xl flex flex-col items-center justify-center p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-pink-300 mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <h2 className="font-display text-2xl text-gray-700">Siap Terhubung?</h2>
              <p className="text-gray-500 mt-2">Klik tombol di bawah untuk mengambil kartu.</p>
            </div>

            {/* Sisi Belakang Kartu */}
            <div className="card-face card-back absolute w-full h-full bg-white rounded-2xl flex flex-col p-6 md:p-8 text-center">
               <div className={cn("flex flex-col h-full w-full transition-opacity duration-300", { 'opacity-0': !isFlipped, 'opacity-100': isFlipped })}>
                  {currentQuestion && (
                    <>
                        <div className="flex-shrink-0">
                             <div className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {currentQuestion.category}
                            </div>
                        </div>
                        <div className="flex-grow flex items-center justify-center">
                            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
                            {currentQuestion.question}
                            </p>
                        </div>
                    </>
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Tombol */}
        <div className="flex space-x-4 mt-8">
          <button
            onClick={showCategorySelection}
            disabled={isAnimating}
            className="btn bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-6 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Ganti Kategori
          </button>
          <button
            onClick={drawCard}
            disabled={isAnimating}
            className="btn bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnimating ? '...' : 'Ambil Kartu'}
          </button>
        </div>
      </div>
      <style jsx>{`
        .btn {
            transition: all 0.3s ease-in-out;
        }
        .btn:not(:disabled):hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .category-btn {
             transition: all 0.2s ease-in-out;
        }
        .category-btn:hover {
            transform: scale(1.05);
            background-color: #f9fafb; /* gray-50 */
        }
        .card-element {
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        .card-element.is-flipped {
          transform: rotateY(180deg);
        }
        .card-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .card-back {
          transform: rotateY(180deg);
        }
        .gradient-bg {
          background: linear-gradient(135deg, #fde6f1 0%, #e6e9f0 100%);
        }
      `}</style>
    </>
  );
}
