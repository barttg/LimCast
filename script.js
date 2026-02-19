// Script para LimCast con galería de 50 imágenes

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página LimCast cargada');

    // ===== CONFIGURACIÓN DE IMÁGENES =====
    const totalImagenes = 100; // Tenemos 50 imágenes
    const imagenesPorCarga = 12; // Cargar 12 imágenes inicialmente
    let imagenesCargadas = 0;
    let imagenesArray = [];
    let imagenActual = 0;

    // Generar array con nombres de imágenes (asumiendo que son 1.jpeg, 2.jpeg, etc.)
    for (let i = 1; i <= totalImagenes; i++) {
        imagenesArray.push({
            id: i,
            src: `mgs/${i}.jpeg`,
            alt: `Trabajo LimCast ${i}`,
            descripcion: `Proyecto de limpieza, jardinería o mantenimiento ${i}`
        });
    }

    // Elementos
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const whatsappBtn = document.querySelector('.whatsapp-float');
    const contactForm = document.getElementById('contactForm');
    
    // Elementos de la galería
    const imagenesGrid = document.getElementById('imagenesGrid');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const totalImagenesSpan = document.getElementById('totalImagenes');
    
    // Elementos del modal
    const modal = document.getElementById('imagenModal');
    const modalImg = document.getElementById('modalImg');
    const modalInfo = document.getElementById('modalInfo');
    const cerrarModal = document.getElementById('cerrarModal');
    const prevImagen = document.getElementById('prevImagen');
    const nextImagen = document.getElementById('nextImagen');
    
    // Actualizar contador de imágenes
    if (totalImagenesSpan) {
        totalImagenesSpan.textContent = totalImagenes;
    }
    
    // ===== FUNCIÓN PARA CARGAR IMÁGENES =====
    function cargarImagenes(cantidad) {
        if (!imagenesGrid) return;
        
        const inicio = imagenesCargadas;
        const fin = Math.min(inicio + cantidad, totalImagenes);
        
        for (let i = inicio; i < fin; i++) {
            const img = imagenesArray[i];
            
            const gridItem = document.createElement('div');
            gridItem.className = 'grid-item';
            gridItem.dataset.id = img.id;
            
            // Crear contenedor de imagen
            const imgContainer = document.createElement('div');
            imgContainer.className = 'grid-imagen-container';
            
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.alt = img.alt;
            imgElement.className = 'grid-imagen';
            imgElement.loading = 'lazy'; // Carga diferida para mejor rendimiento
            
            // Manejar error de carga de imagen
            imgElement.onerror = function() {
                this.onerror = null;
                this.src = ''; // Limpiar src
                this.style.display = 'none';
                
                // Mostrar placeholder si la imagen no carga
                const placeholder = document.createElement('div');
                placeholder.className = 'grid-placeholder';
                placeholder.innerHTML = `<i class="fas fa-image"></i><span>Imagen ${img.id}</span>`;
                imgContainer.appendChild(placeholder);
            };
            
            imgContainer.appendChild(imgElement);
            
            const imgDesc = document.createElement('p');
            imgDesc.textContent = `Trabajo ${img.id}`;
            
            gridItem.appendChild(imgContainer);
            gridItem.appendChild(imgDesc);
            
            // Abrir modal al hacer clic
            gridItem.addEventListener('click', function() {
                abrirModal(img.id);
            });
            
            imagenesGrid.appendChild(gridItem);
            imagenesCargadas++;
        }
        
        // Ocultar botón si ya no hay más imágenes
        if (imagenesCargadas >= totalImagenes && loadMoreContainer) {
            loadMoreContainer.style.display = 'none';
        }
    }
    
    // ===== FUNCIÓN PARA ABRIR MODAL =====
    function abrirModal(id) {
        if (!modal || !modalImg || !modalInfo) return;
        
        imagenActual = id - 1; // Convertir a índice 0-based
        const imgData = imagenesArray[imagenActual];
        
        modalImg.src = imgData.src;
        modalImg.alt = imgData.alt;
        modalInfo.textContent = `Imagen ${imgData.id} de ${totalImagenes}`;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        
        // Precargar imágenes adyacentes
        precargarImagenesAdyacentes();
    }
    
    // ===== FUNCIÓN PARA PRECARGAR IMÁGENES =====
    function precargarImagenesAdyacentes() {
        // Precargar imagen anterior
        if (imagenActual > 0) {
            const imgPrev = new Image();
            imgPrev.src = imagenesArray[imagenActual - 1].src;
        }
        
        // Precargar imagen siguiente
        if (imagenActual < totalImagenes - 1) {
            const imgNext = new Image();
            imgNext.src = imagenesArray[imagenActual + 1].src;
        }
    }
    
    // ===== FUNCIÓN PARA CAMBIAR IMAGEN EN MODAL =====
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
    
    // ===== CARGAR IMÁGENES INICIALES =====
    if (imagenesGrid) {
        cargarImagenes(imagenesPorCarga);
    }
    
    // ===== BOTÓN CARGAR MÁS =====
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            cargarImagenes(imagenesPorCarga);
        });
    }
    
    // ===== MODAL =====
    if (cerrarModal) {
        cerrarModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restaurar scroll
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
    
    // Cerrar modal al hacer clic fuera de la imagen
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Navegación con teclado en modal
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
            
            // Cambiar icono
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }
    
    // ===== NAVEGACIÓN SUAVE =====
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
    
    // ===== WHATSAPP =====
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function() {
            window.open('https://wa.me/525583908175', '_blank');
        });
    }
    
    // ===== FORMULARIO =====
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación simple
            const inputs = this.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (!isValid) {
                mostrarMensaje('Por favor completa todos los campos obligatorios', 'error');
                return;
            }
            
            // Simular envío
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                mostrarMensaje('¡Mensaje enviado! Te contactaremos pronto.', 'success');
                contactForm.reset();
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // ===== FUNCIÓN PARA MENSAJES =====
    function mostrarMensaje(texto, tipo) {
        const mensaje = document.createElement('div');
        mensaje.className = `mensaje-flotante ${tipo}`;
        mensaje.innerHTML = `
            <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${texto}</span>
        `;
        
        mensaje.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            left: 20px;
            background: ${tipo === 'success' ? '#2ecc71' : '#e74c3c'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 2000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideDown 0.3s ease;
            max-width: 400px;
            margin: 0 auto;
        `;
        
        document.body.appendChild(mensaje);
        
        setTimeout(() => {
            mensaje.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => mensaje.remove(), 300);
        }, 3000);
    }
    
    // ===== RESALTAR NAVEGACIÓN ACTIVA =====
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
    
    // ===== ESTILOS PARA ANIMACIONES =====
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(0); opacity: 1; }
            to { transform: translateY(-20px); opacity: 0; }
        }
        
        .mensaje-flotante {
            font-weight: 500;
            z-index: 2000;
        }
        
        .nav-link.active {
            color: var(--verde-oscuro);
            font-weight: 600;
        }
    `;
    document.head.appendChild(style);
});