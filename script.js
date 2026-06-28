/* ==========================================================================
   Midnight Neon Portfolio JavaScript Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Sticky Header Scroll Effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 2. Mobile Nav Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once revealed
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Skills Bar Progression Animation
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  const skillsSection = document.getElementById('skills');
  
  if (skillsSection && skillBars.length > 0) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
          });
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      threshold: 0.2
    });
    
    skillsObserver.observe(skillsSection);
  }

  // 5. Active Nav Link Tracking on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 120; // Offset for header height

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 6. Project Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from buttons and apply to current
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        // Hide card first with style
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8) translateY(20px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.style.display = 'flex';
            // Wait for display change to apply transitions
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // 7. Auto-Typing Effect in Hero Title
  const typingText = document.getElementById('typingText');
  const words = ['Web Applications.', 'SaaS Interfaces.', 'Scalable APIs.', 'Smart AI Solutions.'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typingText) return;
    
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deletion speed is faster
    } else {
      typingText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal typing speed
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Wait time at the end of the word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500; // Delay before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  // 8. Contact Form Submission (Simulated Client-Side)
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('btnSubmitForm');
  
  if (contactForm && formStatus && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Collect input fields
      const name = document.getElementById('formName').value.trim();
      const email = document.getElementById('formEmail').value.trim();
      const subject = document.getElementById('formSubject').value.trim();
      const message = document.getElementById('formMessage').value.trim();
      
      // Simple validation fallback
      if (!name || !email || !subject || !message) {
        formStatus.textContent = 'Please fill out all the input fields.';
        formStatus.className = 'form-status error';
        return;
      }
      
      // Modify button to show sending progress
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
      
      formStatus.style.display = 'none';
      
      // Simulate asynchronous server post delay
      setTimeout(() => {
        // Reset form
        contactForm.reset();
        
        // Show success status
        formStatus.textContent = `Thank you, ${name}! Your message was sent successfully. I will get back to you shortly.`;
        formStatus.className = 'form-status success';
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }, 1500);
    });
  }

  // 9. Three.js 3D Face from PFP using Displacement Mapping
  const container3d = document.getElementById('avatarCanvasContainer');
  if (container3d && typeof THREE !== 'undefined') {

    // Wait for container to have real dimensions
    const initScene = () => {
      const w = container3d.clientWidth  || 320;
      const h = container3d.clientHeight || 320;

      // ── Scene & Camera ──────────────────────────────────────────────
      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
      camera.position.z = 3.5;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      container3d.appendChild(renderer.domElement);

      // ── Cinematic Portrait Lighting ──────────────────────────────────
      // Soft ambient base
      scene.add(new THREE.AmbientLight(0x1a1a2e, 3));

      // Key light – warm white from upper-left front
      const keyLight = new THREE.DirectionalLight(0xfff5e4, 4);
      keyLight.position.set(-2, 3, 4);
      scene.add(keyLight);

      // Fill light – cool cyan from the right
      const fillLight = new THREE.PointLight(0x06b6d4, 3, 12);
      fillLight.position.set(3, 0, 3);
      scene.add(fillLight);

      // Rim / hair light – magenta from behind-below
      const rimLight = new THREE.PointLight(0xd946ef, 2, 8);
      rimLight.position.set(0, -3, -2);
      scene.add(rimLight);

      // Top accent – indigo bounce
      const topLight = new THREE.PointLight(0x6366f1, 1.5, 10);
      topLight.position.set(0, 4, 1);
      scene.add(topLight);

      // ── Load PFP texture ─────────────────────────────────────────────
      const loader = new THREE.TextureLoader();
      loader.load('assets/pfp-portfolio.jpg', (texture) => {
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.generateMipmaps = true;

        // ── High-res displaced plane (the "3D face") ───────────────────
        // 220×220 segments = 48 400 triangles – enough to show facial features
        const faceGeo = new THREE.PlaneGeometry(2.8, 2.8, 220, 220);
        const faceMat = new THREE.MeshStandardMaterial({
          map:             texture,
          displacementMap: texture,   // brightness → vertex depth
          displacementScale: 0.42,    // how "deep" the face pops out
          displacementBias:  -0.08,   // offset so darkest areas sit flush
          roughness: 0.55,
          metalness: 0.12,
          envMapIntensity: 0.6,
        });
        const faceMesh = new THREE.Mesh(faceGeo, faceMat);
        scene.add(faceMesh);

        // ── Clipping circular mask (ring border) ─────────────────────
        const innerRing = new THREE.RingGeometry(1.42, 1.52, 80);
        const innerRingMat = new THREE.MeshBasicMaterial({
          color: 0x6366f1, side: THREE.DoubleSide,
          transparent: true, opacity: 0.95
        });
        const ringMesh = new THREE.Mesh(innerRing, innerRingMat);
        ringMesh.position.z = 0.02;
        scene.add(ringMesh);

        // ── Outer glow ring (pulsing) ─────────────────────────────────
        const outerRing = new THREE.RingGeometry(1.52, 1.78, 80);
        const outerRingMat = new THREE.MeshBasicMaterial({
          color: 0x06b6d4, side: THREE.DoubleSide,
          transparent: true, opacity: 0.35
        });
        const glowRing = new THREE.Mesh(outerRing, outerRingMat);
        glowRing.position.z = 0.01;
        scene.add(glowRing);

        // ── Spinning wireframe torus (hologram feel) ──────────────────
        const torusGeo = new THREE.TorusGeometry(1.65, 0.018, 16, 100);
        const torusMat = new THREE.MeshBasicMaterial({
          color: 0x6366f1, transparent: true, opacity: 0.55
        });
        const torus = new THREE.Mesh(torusGeo, torusMat);
        scene.add(torus);

        // ── Orbital particle ring ─────────────────────────────────────
        const particleCount = 220;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
          const angle  = (i / particleCount) * Math.PI * 2;
          const spread = 0.08;
          const r = 1.92 + (Math.random() - 0.5) * spread;
          pPos[i * 3]     = Math.cos(angle) * r;
          pPos[i * 3 + 1] = Math.sin(angle) * r;
          pPos[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({
          color: 0x06b6d4, size: 0.028, transparent: true, opacity: 0.85
        });
        const particles = new THREE.Points(pGeo, pMat);
        scene.add(particles);

        // ── Background star-dust ─────────────────────────────────────
        const starCount = 180;
        const sGeo = new THREE.BufferGeometry();
        const sPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i += 3) {
          sPos[i]     = (Math.random() - 0.5) * 10;
          sPos[i + 1] = (Math.random() - 0.5) * 10;
          sPos[i + 2] = (Math.random() - 0.5) * 3 - 1;
        }
        sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
        const sMat = new THREE.PointsMaterial({
          color: 0x9ca3af, size: 0.022, transparent: true, opacity: 0.4
        });
        scene.add(new THREE.Points(sGeo, sMat));

        // ── Mouse parallax ────────────────────────────────────────────
        let mouseX = 0, mouseY = 0, targX = 0, targY = 0;
        document.addEventListener('mousemove', (e) => {
          mouseX =  (e.clientX / window.innerWidth  - 0.5) * 0.65;
          mouseY = -(e.clientY / window.innerHeight - 0.5) * 0.65;
        });

        // ── Animation loop ────────────────────────────────────────────
        let clock = 0;
        const animate = () => {
          requestAnimationFrame(animate);
          clock += 0.012;

          // Smooth mouse easing
          targX += (mouseX - targX) * 0.055;
          targY += (mouseY - targY) * 0.055;

          // Face tilt follows mouse
          faceMesh.rotation.y =  targX;
          faceMesh.rotation.x = -targY;
          ringMesh.rotation.y =  targX;
          ringMesh.rotation.x = -targY;
          glowRing.rotation.y =  targX;
          glowRing.rotation.x = -targY;
          torus.rotation.y    =  targX;
          torus.rotation.x    = -targY;
          particles.rotation.y = targX * 0.5;
          particles.rotation.x = -targY * 0.5;

          // Floating bob
          const bob = Math.sin(clock * 0.9) * 0.09;
          faceMesh.position.y = bob;
          ringMesh.position.y = bob;
          glowRing.position.y = bob;
          torus.position.y    = bob;
          particles.position.y = bob;

          // Torus slow spin
          torus.rotation.z += 0.004;

          // Orbital particles spin faster
          particles.rotation.z += 0.006;

          // Pulse outer glow opacity
          outerRingMat.opacity = 0.25 + Math.sin(clock * 1.4) * 0.18;
          // Pulse torus opacity
          torusMat.opacity = 0.4 + Math.sin(clock * 2) * 0.2;

          renderer.render(scene, camera);
        };
        animate();

        // ── Resize handler ────────────────────────────────────────────
        window.addEventListener('resize', () => {
          const nw = container3d.clientWidth;
          const nh = container3d.clientHeight;
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        });

      }, undefined, () => {
        // Fallback glowing sphere if texture load fails
        const geo = new THREE.SphereGeometry(1.2, 64, 64);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x6366f1, roughness: 0.1, metalness: 0.8,
          emissive: 0x06b6d4, emissiveIntensity: 0.3
        });
        const sphere = new THREE.Mesh(geo, mat);
        scene.add(sphere);
        const anim = () => {
          requestAnimationFrame(anim);
          sphere.rotation.y += 0.01;
          renderer.render(scene, camera);
        };
        anim();
      });
    };

    // Defer until layout is ready
    if (container3d.clientWidth > 0) {
      initScene();
    } else {
      setTimeout(initScene, 200);
    }
  }
});
