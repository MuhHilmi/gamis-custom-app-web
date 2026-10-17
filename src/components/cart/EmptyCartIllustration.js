// Ilustrasi keranjang belanja minimalis untuk state keranjang kosong.
// Murni dekoratif: judul dan pesan di sekitarnya sudah menjelaskan status,
// jadi elemen ini disembunyikan dari pembaca layar.
export default function EmptyCartIllustration() {
  return (
    <svg
      viewBox="0 0 200 170"
      className="h-40 w-auto sm:h-48"
      role="presentation"
      aria-hidden="true"
    >
      {/* Partikel: bintang & hati */}
      <g>
        <path
          className="sparkle"
          style={{ animationDelay: "0.2s" }}
          d="M36 30l2.4 5 5 2.4-5 2.4-2.4 5-2.4-5-5-2.4 5-2.4z"
          fill="var(--color-emas)"
        />
        <path
          className="sparkle"
          style={{ animationDelay: "1.1s" }}
          d="M170 92l1.8 3.8 3.8 1.8-3.8 1.8-1.8 3.8-1.8-3.8-3.8-1.8 3.8-1.8z"
          fill="var(--color-emas)"
          fillOpacity="0.8"
        />
        <path
          className="sparkle"
          style={{ animationDelay: "0.6s" }}
          d="M166 36c-4-4-10-1-10 4 0 4 6 8 10 11 4-3 10-7 10-11 0-5-6-8-10-4z"
          fill="var(--color-emas)"
          fillOpacity="0.85"
        />
        <circle
          className="sparkle"
          style={{ animationDelay: "1.5s" }}
          cx="30"
          cy="104"
          r="3"
          fill="var(--color-zaitun-muda)"
        />
      </g>

      {/* Gagang keranjang */}
      <path
        d="M74 68C74 34 126 34 126 68"
        fill="none"
        stroke="var(--color-zaitun)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Badan keranjang */}
      <path
        d="M46 68H154L144 148A6 6 0 0 1 138 154H62A6 6 0 0 1 56 148Z"
        fill="var(--color-krem-tua)"
        stroke="var(--color-zaitun)"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Anyaman */}
      <g
        stroke="var(--color-zaitun)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.25"
      >
        <path d="M49 92H151" />
        <path d="M51.5 112H148.5" />
        <path d="M54 132H146" />
        <path d="M78 74V148" />
        <path d="M122 74V148" />
      </g>

      {/* Aksen emas pada bibir keranjang */}
      <path
        d="M40 68H160"
        stroke="var(--color-emas)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
