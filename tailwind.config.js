module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
            backgroundImage: {
                'gradient-button': "url('/button-bg.svg')",
            },
            backgroundSize: {
                'size-200': '200% 200%',
            },
            backgroundPosition: {
                'pos-0': '0% 0%',
                'pos-100': '100% 100%',
            },
      fontFamily: {
            bilo: ["bilo"],
            sofiaPro:["sofia-pro"],
            sofira:["sofia-pro"],
            poppins: ["Poppins"]
      },
      colors: {
        'indigo': {
            500: '#292e42'
        },
          'avatea-blue-dark': {
            500: "#5ea8b5"
          },
          'avatea-yellow-dark': {
            500:'#c4b082'
          },
          'avatea-blue-light': {
            500: "#6ee0ff"
          },
          'avatea-yellow-light': {
            500:'#ffde99'
          },
          'light-yellow': {
            500:'#FFFFF5'
          },
          'dark-blue': {
            500:'#292E42'
          }


      },
      width: {
        25: "6.25rem",
        38: "9.5rem",
        50: "12.5rem",
        66.25: "16.5625rem",
        75: "18.75rem",
        100: "25rem",
      },
      maxWidth: {
        42.5: "10.625rem",
        66.25: "16.5625rem",
      },
      height: {
        0.75: "0.1875rem",
        7.5: "1.875rem",
        12.5: "3.125rem",
        19: "4.75rem",
        25: "6.25rem",
        38: "9.5rem",
        68.75: "17.1875rem",
        85: "21.25rem",
        100: "25rem",
        110: "27.5rem",
        120: "30rem"
      },
      inset: {
        7.5: "1.875rem",
      },
      borderRadius: {
        "0.5xl": "0.625rem",
        "2.5xl": "1.25rem",
        "4xl": "1.875rem",
      },
      margin: {
        3.75: "0.9375rem",
        6.25: "1.5625rem",
        7.5: "1.875rem",
      },
      padding: {
        0.5: "0.125rem",
        1.25: "0.3125rem",
        3.75: "0.9375rem",
        5.5: "1.375rem",
        6.25: "1.5625rem",
        7.5: "1.875rem",
        100: "25rem",
      },
      space: {
        3.75: "0.9375rem",
        4.5: "1.125rem",
        6.25: "1.5625rem",
        7.5: "1.875rem",
        12.5: "3.125rem",
      },
      gap: {
        3.75: "0.9375rem",
        7.5: "1.875rem",
      },
      screens: {
        "xsm-sm": "560px",
        "sm-md": "700px",
        "md-lg": "840px",
        "lg-xl": "1240px",
        "xl-2xl": "1360px",
        "2xl-3xl": "1560px",
        "3xl-4xl": "1750px",
      },
      backgroundSize: {
        "50%": "50%",
      },
      animation: {
        marquee: 'marquee 40s linear infinite'
      },
      keyframes: {
        marquee: {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-100%)' }
        }
      }
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
