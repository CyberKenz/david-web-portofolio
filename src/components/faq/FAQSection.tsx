const faqs = [
  {
    q: 'Apa saja spesialisasi latihan David Andreas?',
    a: 'Muscle Gain (hipertrofi), Fat Loss (komposisi tubuh), Basic Fitness (fondasi pemula), Strength (kekuatan), dan Functional Training (pola gerak sehari-hari).',
  },
  {
    q: 'Di mana David Andreas melatih klien?',
    a: 'Di Elluna Gym & MMA, Pontianak, Kalimantan Barat.',
  },
  {
    q: 'Bagaimana cara menghubungi David Andreas untuk latihan personal?',
    a: 'Lewat WhatsApp 081255854107, email davidandreas312@gmail.com, atau Instagram @davittt.dreas.',
  },
  {
    q: 'Apakah David Andreas punya sertifikasi?',
    a: 'Sertifikasi Elluna Gym Foundation dari Elluna Gym & MMA.',
  },
  {
    q: 'Berapa biaya latihan personal dengan David Andreas?',
    a: 'Informasi biaya belum tersedia di situs ini. Hubungi David langsung lewat WhatsApp, email, atau Instagram untuk mengetahui paket latihan.',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="section relative overflow-hidden bg-cream" data-aos="fade-up" data-aos-duration="800" data-aos-once="true">
      <div className="shell relative">
        <span className="label-pill">07 // Pertanyaan Umum</span>
        <h2 className="mt-4 text-h2 text-night">
          Pertanyaan yang sering diajukan<span className="text-brand">.</span>
        </h2>
        <div className="mt-10 grid gap-3 sm:gap-4 lg:gap-6" data-aos="fade-up" data-aos-duration="700" data-aos-once="true">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border-2 border-night bg-paper p-4 sm:p-5 shadow-[3px_3px_0_0_#242323]"
            >
              <p className="font-display text-[1.1rem] font-extrabold leading-tight text-night">
                {faq.q}
              </p>
              <p className="mt-2 text-[13px] leading-6 text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
