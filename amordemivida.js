// --- Contador de Tiempo ---
const fechaInicio = new Date('2024-06-23T00:00:00'); // Establece la fecha de inicio aquí

function actualizarContador() {
    const ahora = new Date();
    let diferencia = ahora - fechaInicio;

    if (diferencia < 0) {
        document.getElementById('anios').textContent = '0';
        document.getElementById('meses').textContent = '0';
        document.getElementById('dias').textContent = '0';
        document.getElementById('horas').textContent = '0';
        document.getElementById('minutos').textContent = '0';
        document.getElementById('segundos').textContent = '0';
        return;
    }

    let totalSegundos = Math.floor(diferencia / 1000);
    let segundos = totalSegundos % 60;
    let totalMinutos = Math.floor(totalSegundos / 60);
    let minutos = totalMinutos % 60;
    let totalHoras = Math.floor(totalMinutos / 60);
    let horas = totalHoras % 24;
    let totalDias = Math.floor(totalHoras / 24);

    let anios = 0;
    let meses = 0;
    let diasRestantes = totalDias;

    anios = Math.floor(diasRestantes / 365.25);
    diasRestantes -= anios * 365.25;
    meses = Math.floor(diasRestantes / 30.44);
    diasRestantes -= meses * 30.44;
    diasRestantes = Math.floor(diasRestantes);

    document.getElementById('anios').textContent = anios;
    document.getElementById('meses').textContent = meses;
    document.getElementById('dias').textContent = diasRestantes;
    document.getElementById('horas').textContent = horas;
    document.getElementById('minutos').textContent = minutos;
    document.getElementById('segundos').textContent = segundos;
}

setInterval(actualizarContador, 1000);
actualizarContador();


// --- Reproductor de Música ---
const audio = document.getElementById('miAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.getElementById('progressBar');
const playlistSelect = document.getElementById('playlistSelect');

// ¡IMPORTANTE! Aquí están tus canciones, asegurate que los nombres de archivo coincidan con tus .mp3
// Como dijiste que están en la misma carpeta que el HTML, no usamos 'musica/'
const playlist = [
    { name: 'El vino de tu boca - Alejandro Sanz', src: '1.mp3' },
    { name: 'Venus - Zoé', src: '2.mp3' },
    { name: 'Tarde - Siddhartha', src: 'tarde.mp3' },
    { name: 'Iris - Goo Goo Dolls', src: 'iris.mp3' },
    { name: 'Eres tú - Carla Morrison', src: 'erestu.mp3' },
    // Agrega más canciones aquí si tienes
];

let currentSongIndex = 0;
// La variable 'userInitiatedPlay' ya no es necesaria con este enfoque,
// ya que siempre esperamos la interacción del botón play/pause.

function loadSong(index) {
    if (playlist.length === 0) {
        console.warn("La playlist está vacía. No se puede cargar ninguna canción.");
        audio.src = ''; // Limpia la fuente del audio
        playPauseBtn.textContent = 'Reproducir'; // Asegura el texto del botón
        // Desactivar controles si no hay canciones
        playPauseBtn.disabled = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        progressBar.disabled = true;
        volumeSlider.disabled = true;
        playlistSelect.disabled = true;
        return;
    }

    // Asegurarse de que los controles estén habilitados si hay canciones
    playPauseBtn.disabled = false;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
    progressBar.disabled = false;
    volumeSlider.disabled = false;
    playlistSelect.disabled = false;


    const selectedSong = playlist[index];
    if (!selectedSong) {
        console.error("Índice de canción no válido:", index, "en playlist de longitud", playlist.length);
        return;
    }

    console.log("Cargando canción:", selectedSong.name, "desde", selectedSong.src);
    audio.src = selectedSong.src;
    playlistSelect.value = index; // Sincroniza el select con la canción actual
    audio.load(); // Intenta cargar la nueva fuente

    // **IMPORTANTE**: No hay "audio.play()" automático aquí.
    // La reproducción se iniciará solo al presionar el botón Play/Pause.
    playPauseBtn.textContent = 'Reproducir'; // Asegurar que el botón muestre "Reproducir" al cargar nueva canción
    progressBar.value = 0; // Reiniciar la barra de progreso
}

function playPause() {
    if (playlist.length === 0) {
        console.warn("No hay canciones en la playlist para reproducir/pausar.");
        return;
    }

    if (audio.paused || audio.ended) {
        audio.play().then(() => {
            playPauseBtn.textContent = 'Pausar';
            console.log("Reproduciendo:", playlist[currentSongIndex].name);
        }).catch(error => {
            console.error("Error al intentar reproducir:", error);
            alert("No se pudo reproducir la música. Asegúrate de que el archivo de audio exista. Revisa la consola (F12) para más detalles.");
            playPauseBtn.textContent = 'Reproducir';
        });
    } else {
        audio.pause();
        playPauseBtn.textContent = 'Reproducir';
        console.log("Pausado.");
    }
}

function playNextSong() {
    if (playlist.length <= 1) {
        console.log("No hay suficientes canciones para pasar a la siguiente.");
        return;
    }
    const wasPlaying = !audio.paused; // Guarda si estaba reproduciendo antes de cambiar la canción
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex); // Carga la siguiente canción
    if (wasPlaying) { // Si estaba reproduciendo, continúa reproduciendo la siguiente
        audio.play().catch(e => console.error("Error al reproducir siguiente canción:", e));
        playPauseBtn.textContent = 'Pausar';
    } else {
        playPauseBtn.textContent = 'Reproducir'; // Si estaba pausado, se queda en reproducir
    }
    console.log("Siguiente canción:", playlist[currentSongIndex].name);
}

function playPrevSong() {
    if (playlist.length <= 1) {
        console.log("No hay suficientes canciones para pasar a la anterior.");
        return;
    }
    const wasPlaying = !audio.paused; // Guarda si estaba reproduciendo
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex); // Carga la canción anterior
    if (wasPlaying) { // Si estaba reproduciendo, continúa reproduciendo la anterior
        audio.play().catch(e => console.error("Error al reproducir canción anterior:", e));
        playPauseBtn.textContent = 'Pausar';
    } else {
        playPauseBtn.textContent = 'Reproducir';
    }
    console.log("Canción anterior:", playlist[currentSongIndex].name);
}

// Event Listeners para los botones
playPauseBtn.addEventListener('click', playPause);
prevBtn.addEventListener('click', playPrevSong);
nextBtn.addEventListener('click', playNextSong);

// Control de volumen
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
});

// Barra de progreso
audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
        progressBar.value = audio.currentTime / audio.duration;
    } else {
        progressBar.value = 0;
    }
});

progressBar.addEventListener('input', () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
        audio.currentTime = progressBar.value * audio.duration;
        // Si el usuario mueve la barra y no estaba reproduciendo, NO lo forzamos a reproducir.
        // Solo lo hacemos si ya estaba en Play.
    }
});

// Cuando la canción actual termina, reproduce la siguiente
audio.addEventListener('ended', playNextSong);

// Llenar el select con las canciones de la playlist
function populatePlaylistSelect() {
    playlistSelect.innerHTML = ''; // Limpiar opciones anteriores
    if (playlist.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'No hay canciones';
        playlistSelect.appendChild(option);
        playlistSelect.disabled = true;
        return;
    }
    playlistSelect.disabled = false;
    playlist.forEach((song, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = song.name;
        playlistSelect.appendChild(option);
    });
    if (playlist.length > 0) {
        playlistSelect.value = currentSongIndex;
    }
}

// Listener para cuando se selecciona una canción del desplegable
playlistSelect.addEventListener('change', (event) => {
    const wasPlaying = !audio.paused; // Guarda si estaba reproduciendo
    currentSongIndex = parseInt(event.target.value);
    loadSong(currentSongIndex); // Carga la nueva canción
    if (wasPlaying) { // Si estaba reproduciendo antes de seleccionar, que siga sonando la nueva
        audio.play().catch(e => console.error("Error al reproducir canción seleccionada:", e));
        playPauseBtn.textContent = 'Pausar';
    } else {
        playPauseBtn.textContent = 'Reproducir'; // Si estaba pausado, se queda en reproducir
    }
});


// --- Inicialización al cargar la página ---
document.addEventListener('DOMContentLoaded', () => {
    populatePlaylistSelect(); // Primero llena el selector

    if (playlist.length > 0) {
        audio.src = playlist[currentSongIndex].src; // Carga la primera canción
        audio.load(); // La carga pero NO la reproduce
        audio.volume = volumeSlider.value; // Establece el volumen inicial
        playPauseBtn.textContent = 'Reproducir'; // Asegura que el botón diga 'Reproducir' al inicio
        console.log("Reproductor inicializado. Presiona 'Reproducir' para empezar.");
    } else {
        console.warn("Playlist vacía al iniciar. Reproductor deshabilitado.");
        // Desactivar todos los controles si la playlist está vacía
        playPauseBtn.disabled = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        progressBar.disabled = true;
        volumeSlider.disabled = true;
        playlistSelect.disabled = true;
    }
    // ¡Se elimina toda la lógica de 'userInteractionHandler' para el autoplay!
});

document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-btn');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            const imgAlt = item.querySelector('img').alt;

            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = imgAlt; // Opcional: muestra el alt como caption
            lightbox.style.display = 'flex'; // Muestra el lightbox
        });
    });

    // Cierra el lightbox al hacer clic en la "x"
    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // Cierra el lightbox al hacer clic fuera de la imagen (en el fondo oscuro)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    // Cierra el lightbox al presionar la tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
        }
    });
});

// ... (resto de tu código JavaScript anterior para el contador, reproductor de música y galería de fotos) ...

// --- Galería de Videos (Ajustado para videos locales y apertura de modal) ---
document.addEventListener('DOMContentLoaded', () => {
    const videoItems = document.querySelectorAll('.video-item');
    const videoModal = document.getElementById('videoModal'); // Asegúrate que 'videoModal' es el ID de tu div principal de video modal
    const closeButton = videoModal.querySelector('.close-button'); // Selecciona el botón de cierre dentro de ese modal
    const videoPlayer = document.getElementById('videoPlayer'); // Es el elemento <video> dentro del modal

    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoSrc = item.getAttribute('data-video-src');
            if (videoSrc) {
                videoPlayer.src = videoSrc; // Establece la URL del video local en el <video>
                videoPlayer.load(); // Carga el video

                // Intenta reproducir el video. El navegador puede bloquear el autoplay sin interacción directa del usuario.
                videoPlayer.play().then(() => {
                    console.log("Video reproduciéndose.");
                    // Opcional: Puedes añadir una clase al modal para animaciones de entrada aquí si lo deseas
                    // videoModal.classList.add('fade-in'); 
                }).catch(error => {
                    console.warn("No se pudo reproducir automáticamente el video. Es posible que el navegador requiera interacción del usuario o que el video no se haya cargado completamente:", error);
                    // Muestra los controles del video para que el usuario pueda reproducir manualmente si el autoplay falla
                    videoPlayer.controls = true; 
                });

                videoModal.style.display = 'flex'; // ¡Esto muestra el modal!
                
                // Detener la música si está reproduciéndose
                // Asegúrate de que 'audio' y 'playPauseBtn' estén declarados globalmente o accesibles en este scope
                const audio = document.getElementById('miAudio'); 
                const playPauseBtn = document.getElementById('playPauseBtn'); 
                if (audio && !audio.paused) { 
                    audio.pause();
                    if (playPauseBtn) {
                        playPauseBtn.textContent = 'Reproducir';
                    }
                }

            } else {
                console.error("No se encontró la URL del video en el atributo data-video-src del elemento:", item);
            }
        });
    });

    // Event listener para cerrar el modal usando el botón 'x'
    closeButton.addEventListener('click', () => {
        videoModal.style.display = 'none'; // Oculta el modal
        videoPlayer.pause(); // Pausa el video
        videoPlayer.currentTime = 0; // Reinicia el video al principio
        videoPlayer.src = ''; // Limpia la fuente del video para liberar recursos y evitar precarga
        videoPlayer.controls = false; // Oculta los controles si se activaron por un bloqueo de autoplay
    });

    // Ocultar modal al hacer clic fuera del contenido del modal
    videoModal.addEventListener('click', (event) => {
        // Solo cierra el modal si el clic ocurre directamente en el fondo oscuro del modal, no en su contenido
        if (event.target === videoModal) { 
            videoModal.style.display = 'none';
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
            videoPlayer.src = '';
            videoPlayer.controls = false;
        }
    });

    // Ocultar modal al presionar la tecla ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && videoModal.style.display === 'flex') {
            videoModal.style.display = 'none';
            videoPlayer.pause();
            videoPlayer.currentTime = 0;
            videoPlayer.src = '';
            videoPlayer.controls = false;
        }
    });
});