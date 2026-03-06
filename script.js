// Script para LimCast con Videos e Imágenes

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página LimCast cargada');

    // ===== CONFIGURACIÓN DE IMÁGENES =====
    const totalImagenes = 100; 
    const imagenesPorCarga = 12;
    let imagenesCargadas = 0;
    let imagenesArray = [];
    let imagenActual = 0;

    for (let i = 1; i <= totalImagenes; i++) {
        imagenesArray.push({
            id: i,
            src: `mgs/${i}.jpeg`,
            alt: `Trabajo LimCast ${i}`,
            descripcion: `Proyecto de limpieza, jardinería o mantenimiento ${i}`
        });
    }

    const totalVideos = 7;
    let videoActual = 0;


    const videosCarruselTrack = document.getElementById('videosCarruselTrack');
    const prevVideo = document.getElementById('prevVideo');
    const nextVideo = document.getElementById('nextVideo');
    const videoIndicators = document.querySelectorAll('.video-indicator');
    const currentVideoSpan = document.getElementById('currentVideo');
    const totalVideosSpan = document.getElementById('totalVideos');

    if (totalVideosSpan) {
        totalVideosSpan.textContent = totalVideos;
    }

    function actualizarCarruselVideos() {
        if (!videosCarruselTrack) return;
        
        const slideWidth = document.querySelector('.video-slide')?.offsetWidth || 300;
        const gap = 15;
        const scrollPosition = videoActual * (slideWidth + gap);
        
        videosCarruselTrack.style.transform = `translateX(-${scrollPosition}px)`;
        

        videoIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === videoActual);
        });

        if (currentVideoSpan) {
            currentVideoSpan.textContent = videoActual + 1;
        }
    }

    if (prevVideo) {
        prevVideo.addEventListener('click', function() {
            videoActual = (videoActual - 1 + totalVideos) % totalVideos;
            actualizarCarruselVideos();
        });
    }

    if (nextVideo) {
        nextVideo.addEventListener('click', function() {
            videoActual = (videoActual + 1) % totalVideos;
            actualizarCarruselVideos();
        });
    }

    videoIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            videoActual = index;
            actualizarCarruselVideos();
        });
    });

    let touchStartX = 0;
    let touchEndX = 0;

    if (videosCarruselTrack) {
        videosCarruselTrack.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        videosCarruselTrack.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleVideoSwipe();
        }, { passive: true });
    }

    function handleVideoSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                videoActual = (videoActual + 1) % totalVideos;
            } else {
                videoActual = (videoActual - 1 + totalVideos) % totalVideos;
            }
            actualizarCarruselVideos();
        }
    }

    actualizarCarruselVideos();

    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const whatsappBtn = document.querySelector('.whatsapp-float');
    const contactForm = document.getElementById('contactForm');
    const imagenesGrid = document.getElementById('imagenesGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const totalImagenesSpan = document.getElementById('totalImagenes');
    const modal = document.getElementById('imagenModal');
    const modalImg = document.getElementById('modalImg');
    const modalInfo = document.getElementById('modalInfo');
    const cerrarModal = document.getElementById('cerrarModal');
    const prevImagen = document.getElementById('prevImagen');
    const nextImagen = document.getElementById('nextImagen');

    if (totalImagenesSpan) {
        totalImagenesSpan.textContent = totalImagenes;
    }
    
    // ===== FUNCIONES PARA IMÁGENES =====
    function cargarImagenes(cantidad) {
        if (!imagenesGrid) return;
        
        const inicio = imagenesCargadas;
        const fin = Math.min(inicio + cantidad, totalImagenes);
        
        for (let i = inicio; i < fin; i++) {
            const img = imagenesArray[i];
            
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.dataset.id = img.id;
            
            const imgContainer = document.createElement('div');
            imgContainer.className = 'grid-imagen-container';
            
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.alt = img.alt;
            imgElement.className = 'grid-imagen';
            imgElement.loading = 'lazy';
            
            imgElement.onerror = function() {
                this.onerror = null;
                this.src = '';
                this.style.display = 'none';
                
                const placeholder = document.createElement('div');
                placeholder.className = 'grid-placeholder';
                placeholder.innerHTML = `<i class="fas fa-image"></i><span>Imagen ${img.id}</span>`;
                imgContainer.appendChild(placeholder);
            };
            
            imgContainer.appendChild(imgElement);
            
            const imgDesc = document.createElement('p');
            imgDesc.textContent = ``;
            
            gridItem.appendChild(imgContainer);
            gridItem.appendChild(imgDesc);
            
            gridItem.addEventListener('click', function() {
                abrirModal(img.id);
            });
            
            imagenesGrid.appendChild(gridItem);
            imagenesCargadas++;
        }
        
        if (imagenesCargadas >= totalImagenes && loadMoreContainer) {
            loadMoreContainer.style.display = 'none';
        }
    }
    
    function abrirModal(id) {
        if (!modal || !modalImg || !modalInfo) return;
        
        imagenActual = id - 1;
        const imgData = imagenesArray[imagenActual];
        
        modalImg.src = imgData.src;
        modalImg.alt = imgData.alt;
        modalInfo.textContent = `Imagen ${imgData.id} de ${totalImagenes}`;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        precargarImagenesAdyacentes();
    }
    
    function precargarImagenesAdyacentes() {
        if (imagenActual > 0) {
            const imgPrev = new Image();
            imgPrev.src = imagenesArray[imagenActual - 1].src;
        }
        if (imagenActual < totalImagenes - 1) {
            const imgNext = new Image();
            imgNext.src = imagenesArray[imagenActual + 1].src;
        }
    }
    
    function cambiarImagen(direccion) {
        const nuevaImagen = imagenActual + direccion;
        
        if (nuevaImagen >= 0 && nuevaImagen < totalImagenes) {
            imagenActual = nuevaImagen;
            const imgData = imagenesArray[imagenActual];
            
            modalImg.src = imgData.src;
            modalImg.alt = imgData.alt;
            modalInfo.textContent = `Imagen ${imgData.id} de ${totalImagenes}`;
            
            precargarImagenesAdyacentes();
        }
    }

    if (imagenesGrid) {
        cargarImagenes(imagenesPorCarga);
    }
    
    // Botón cargar más
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            cargarImagenes(imagenesPorCarga);
        });
    }
    
    // Modal
    if (cerrarModal) {
        cerrarModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (prevImagen) {
        prevImagen.addEventListener('click', function() {
            cambiarImagen(-1);
        });
    }
    
    if (nextImagen) {
        nextImagen.addEventListener('click', function() {
            cambiarImagen(1);
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener('keydown', function(event) {
        if (modal && modal.style.display === 'block') {
            if (event.key === 'ArrowLeft') {
                cambiarImagen(-1);
            } else if (event.key === 'ArrowRight') {
                cambiarImagen(1);
            } else if (event.key === 'Escape') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
    
    // ===== MENÚ MÓVIL =====
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            window.open('https://wa.me/525583908175', '_blank');
        });
    }

    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    window.addEventListener('resize', function() {
        actualizarCarruselVideos();
    });
});