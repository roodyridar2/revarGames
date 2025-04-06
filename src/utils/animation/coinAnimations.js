import anime from "animejs";

export const coinAnimations = {
  rainfall: (coinElem, originX, originY) => {
    coinElem.style.left = `${Math.random() * window.innerWidth}px`;
    coinElem.style.top = `${Math.random() * -100}px`;
    anime({
      targets: coinElem,
      translateY: window.innerHeight + 30,
      duration: 2500,
      easing: "easeInQuad",
      complete: () => coinElem.remove(),
    });
  },

  firework: (coinElem, originX, originY) => {
    coinElem.style.left = `${originX}px`;
    coinElem.style.top = `${originY}px`;
    const direction = Math.random() < 0.5 ? -1 : 1;
    anime
      .timeline({ targets: coinElem, easing: "easeOutExpo" })
      .add({
        translateX: direction * (Math.random() * 150 + 50),
        translateY: -(Math.random() * 100 + 50),
        rotate: direction * (Math.random() * 60 + 20),
        duration: 500,
      })
      .add({
        translateY: window.innerHeight - originY + 30,
        translateX: direction * (Math.random() * 50),
        duration: 1200,
        easing: "easeInQuad",
        complete: () => coinElem.remove(),
      });
  },

  spiralDrift: (coinElem, originX, originY) => {
    coinElem.style.left = `${originX}px`;
    coinElem.style.top = `${originY}px`;
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 150;
    anime
      .timeline({ targets: coinElem, easing: "easeOutSine" })
      .add({
        translateX: radius * Math.cos(angle),
        translateY: radius * Math.sin(angle),
        duration: 500,
      })
      .add({
        translateX: radius * Math.cos(angle),
        translateY: radius * Math.sin(angle) + (window.innerHeight - originY),
        duration: 1500,
        easing: "easeInQuad",
        complete: () => coinElem.remove(),
      });
  },

  confettiDrift: (coinElem, originX, originY) => {
    coinElem.style.left = `${originX + (Math.random() - 0.5) * 60}px`;
    coinElem.style.top = `${originY}px`;
    anime({
      targets: coinElem,
      translateY: window.innerHeight - originY + 50,
      translateX: (Math.random() - 0.5) * 40,
      duration: 2000,
      easing: "easeInOutSine",
      complete: () => coinElem.remove(),
    });
  },

  zoomFade: (coinElem, originX, originY) => {
    coinElem.style.left = `${originX}px`;
    coinElem.style.top = `${originY}px`;
    coinElem.style.opacity = 1;
    anime
      .timeline({ targets: coinElem, easing: "easeOutQuad" })
      .add({
        scale: [0.5, 1.2],
        duration: 400,
      })
      .add({
        translateY: window.innerHeight - originY + 50,
        opacity: [1, 0],
        duration: 1500,
        easing: "easeInQuad",
        complete: () => coinElem.remove(),
      });
  },

  twinkleCascade: (coinElem, originX, originY) => {
    coinElem.style.left = `${originX}px`;
    coinElem.style.top = `${originY}px`;
    coinElem.style.opacity = 1;
    anime
      .timeline({ targets: coinElem, easing: "easeInOutSine" })
      .add({
        translateX: [
          { value: 20, duration: 250 },
          { value: -20, duration: 250 },
          { value: 10, duration: 250 },
          { value: -10, duration: 250 },
        ],
        duration: 1000,
      })
      .add({
        translateY: window.innerHeight - originY + 50,
        opacity: [1, 0],
        duration: 1500,
        easing: "easeInQuad",
        complete: () => coinElem.remove(),
      });
  },

  driftSpiral: (coinElem, originX, originY) => {
    coinElem.style.left = `${originX}px`;
    coinElem.style.top = `${originY}px`;
    anime
      .timeline({ targets: coinElem, easing: "easeInOutCubic" })
      .add({
        translateX: 30 * Math.cos(2 * Math.PI * Math.random()),
        translateY: 30 * Math.sin(2 * Math.PI * Math.random()),
        rotate: 45,
        duration: 600,
      })
      .add({
        translateX: function () {
          return 50 * Math.cos(2 * Math.PI * Math.random());
        },
        translateY: window.innerHeight - originY + 50,
        rotate: 360,
        duration: 1500,
        easing: "easeInQuad",
        complete: () => coinElem.remove(),
      });
  },
};
