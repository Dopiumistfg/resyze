// BackgroundScene.js

import React, { useEffect } from "react";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

const BackgroundScene = () => {
  useEffect(() => {
    if (window.innerWidth < 768) return

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const generateRandomShape = () => {
      const random = Math.random();
      let geometry, size;

      if (random < 0.33) {
        geometry = new THREE.BoxGeometry(1, 1, 1);
      } else if (random < 0.66) {
        geometry = new THREE.SphereGeometry(1, 8, 8);
      } else {
        geometry = new THREE.TetrahedronGeometry(1);
      }

      size = Math.random() * 5 + 1;

      geometry.scale(size, size, size);

      return geometry;
    };

    const globalColor = new THREE.Color("hsl(200, 50%, 40%)"); // Set a global color here

    const updateColors = (hue) => {
      // Update shapes color to a new hue based on the global color
      const newHue = hue / 360;
      scene.traverse((child) => {
        if (child.isMesh) {
          child.material.color.setHSL(newHue, 0.5, 0.3);
        }
      });

      // Update text color to a new hue based on the global color
      const textElements = document.querySelectorAll(".syze-text");
      const loadingTextElements = document.querySelectorAll(".loading-text");
      const loader = document.querySelector(".loader");


      textElements.forEach((element) => {
        element.style.color = `hsl(${hue}, 50%, 60%)`;
      });
      // set thec colors if they exist
      if (loadingTextElements.length > 0) {
        loadingTextElements.forEach((element) => {
          element.style.color = `hsl(${hue}, 50%, 60%)`;
        });
      }
      if (loader) {
        loader.style.borderTopColor = `hsl(${hue}, 50%, 60%)`;
      }
      
    };

    const animateColors = () => {
      let hue = 0; // Starting hue value

      const changeHue = () => {
        hue = (hue + 1) % 360; // Adjust the hue shift speed (slower than before)

        updateColors(hue); // Update colors based on the new hue

        requestAnimationFrame(changeHue); // Use requestAnimationFrame for smoother color changes
      };

      changeHue();
    };

    animateColors();

    for (let i = 0; i < 100; i++) {
      const geometry = generateRandomShape();
      const initialColor = new THREE.Color(
        `hsl(${Math.random() * 360}, 50%, 30%)`
      );
      const material = new THREE.MeshBasicMaterial({
        color: initialColor,
        wireframe: true,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const initialOpacity = Math.random() * 0.5 + 0.1;
      material.opacity = initialOpacity;

      const offsetX = (Math.random() < 0.5 ? -1 : 1) * window.innerWidth * 0.3;
      const offsetY = (Math.random() < 0.5 ? -1 : 1) * window.innerHeight * 0.1;

      mesh.position.x = offsetX;
      mesh.position.y = offsetY;
      mesh.position.z = -100;

      scene.add(mesh);

      const duration = Math.random() * 5000 + 3000;
      const targetPosition = {
        x: (Math.random() - 0.5) * window.innerWidth * 0.1,
        y: (Math.random() - 0.5) * window.innerHeight * 0.1,
        z: 0,
      };

      new TWEEN.Tween(mesh.position)
        .to(targetPosition, duration)
        .delay(Math.random() * 1000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
          const time = performance.now() * 0.001;
          mesh.material.opacity =
            Math.abs(Math.sin(time * 2 + i)) * initialOpacity;
        })
        .start();

      animateColors(mesh);
    }

    const animate = () => {
      requestAnimationFrame(animate);

      TWEEN.update();

      scene.children.forEach((child) => {
        child.rotation.x += 0.01;
        child.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default BackgroundScene;
