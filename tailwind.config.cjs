module.exports = {
  "theme": {
    "extend": {
      "colors": {
        "ocopGreen": "#0F382C",
        "ocopGreenLight": "#165B46",
        "ocopGreenDark": "#0A261E",
        "ocopGold": "#D4AF37",
        "ocopGoldHover": "#B89528",
        "ocopWarmBg": "#FAF8F5",
        "ocopCream": "#F4EFE6",
        "cyberCyan": "#00F0FF",
        "aiEmerald": "#10B981"
      },
      "boxShadow": {
        "glass": "0 20px 40px rgba(15, 56, 44, 0.08)",
        "floating": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        "gold-glow": "0 0 35px rgba(212, 175, 55, 0.5)",
        "cyber-glow": "0 0 40px rgba(0, 240, 255, 0.35)",
        "ai-glow": "0 0 50px rgba(16, 185, 129, 0.4)"
      },
      "animation": {
        "fade-in": "fadeIn 0.25s ease-out forwards",
        "pop-in": "popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "pulse-glow": "pulseGlow 2s infinite",
        "float-slow": "floatSlow 4s ease-in-out infinite",
        "antigravity": "antigravity 6s ease-in-out infinite",
        "wiggle": "wiggle 2s ease-in-out infinite",
        "hologram": "hologramScan 3s linear infinite"
      },
      "keyframes": {
        "fadeIn": {
          "0%": {
            "opacity": "0",
            "transform": "translateY(8px)"
          },
          "100%": {
            "opacity": "1",
            "transform": "translateY(0)"
          }
        },
        "popIn": {
          "0%": {
            "opacity": "0",
            "transform": "scale(0.92)"
          },
          "100%": {
            "opacity": "1",
            "transform": "scale(1)"
          }
        },
        "pulseGlow": {
          "0%, 100%": {
            "boxShadow": "0 0 20px rgba(212, 175, 55, 0.4)"
          },
          "50%": {
            "boxShadow": "0 0 45px rgba(212, 175, 55, 0.9)"
          }
        },
        "floatSlow": {
          "0%, 100%": {
            "transform": "translateY(0px) rotate(0deg)"
          },
          "50%": {
            "transform": "translateY(-12px) rotate(1deg)"
          }
        },
        "antigravity": {
          "0%, 100%": {
            "transform": "translateY(0px) scale(1)"
          },
          "50%": {
            "transform": "translateY(-18px) scale(1.02)"
          }
        },
        "wiggle": {
          "0%, 100%": {
            "transform": "rotate(0deg)"
          },
          "10%": {
            "transform": "rotate(12deg)"
          },
          "20%": {
            "transform": "rotate(-12deg)"
          },
          "30%": {
            "transform": "rotate(8deg)"
          },
          "40%": {
            "transform": "rotate(0deg)"
          }
        },
        "hologramScan": {
          "0%": {
            "backgroundPosition": "0% 0%"
          },
          "100%": {
            "backgroundPosition": "0% 200%"
          }
        }
      }
    }
  },
  "content": [
    "./index.html",
    "./admin-recordings.html",
    "./*.js"
  ]
};
