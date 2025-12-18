// Aguarda que todo o conteúdo HTML (DOM) seja carregado antes de executar o script
// Isso garante que os elementos que queremos manipular já existam na página
document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // Menu Mobile (Hambúrguer)
    // =========================================
    
    // Seleciona o botão do menu hambúrguer
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    // Seleciona a lista de navegação (o menu em si)
    const navList = document.querySelector('.nav-list');
    // Seleciona todos os links dentro do menu de navegação
    const navLinks = document.querySelectorAll('.nav-link');

    // Verifica se o botão do menu existe na página para evitar erros
    if (mobileMenuBtn) {
        // Adiciona um evento de 'click' ao botão do menu
        mobileMenuBtn.addEventListener('click', () => {
            // Alterna a classe 'active' na lista de navegação (mostra/esconde o menu)
            navList.classList.toggle('active');
            // Alterna a classe 'active' no botão também (para animação do ícone)
            mobileMenuBtn.classList.toggle('active');
            
            // Animação do ícone Hambúrguer para X (fechar)
            // Seleciona as 3 linhas (spans) dentro do botão
            const spans = mobileMenuBtn.querySelectorAll('span');
            
            // Se o menu estiver ativo (aberto)
            if (navList.classList.contains('active')) {
                // Roda a primeira linha 45 graus e move-a
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                // Torna a linha do meio invisível
                spans[1].style.opacity = '0';
                // Roda a última linha -45 graus e move-a
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                // Se o menu fechar, volta tudo à posição original (hambúrguer)
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Fecha o menu mobile automaticamente quando o utilizador clica num link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Só faz isso se o menu estiver aberto
            if (navList.classList.contains('active')) {
                // Remove a classe 'active' para fechar o menu
                navList.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                
                // Reseta o ícone de volta para hambúrguer
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // =========================================
    // Formulário de Marcação (Simulação de Envio)
    // =========================================
    
    // Seleciona o formulário pelo seu ID
    const bookingForm = document.getElementById('bookingForm');
    
    // Verifica se o formulário existe
    if (bookingForm) {
        // Adiciona um evento ao submeter o formulário
        bookingForm.addEventListener('submit', (e) => {
            // Impede o envio real do formulário (que recarregaria a página)
            e.preventDefault();

            // Captura os valores incluindo o novo campo de telefone (para uso futuro)
            const formData = new FormData(bookingForm);
            const phone = formData.get('phone');
            console.log("Telefone capturado:", phone);
            
            // Seleciona o botão de enviar dentro deste formulário
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            // Guarda o texto original do botão ("Agendar Agora")
            const originalText = submitBtn.innerText;
            
            // Muda o texto do botão para indicar processamento
            submitBtn.innerText = 'Enviando...';
            // Desativa o botão para evitar múltiplos, cliques
            // Desativa o botão para evitar múltiplos, cliques
            submitBtn.disabled = true;


            // Convertemos para um objeto simples de JavaScript
            // Nota: formData já foi criado acima, reaproveitamos
            const data = Object.fromEntries(formData.entries());

            // Enviar para o nosso Servidor (Node.js)
            fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(result => {
                console.log('Sucesso:', result);
                
                // Mostra um alerta de sucesso ao utilizador
                alert('Obrigado! A sua marcação foi recebida e guardada. Entraremos em contacto em breve.');
                
                // Limpa todos os campos do formulário
                bookingForm.reset();
            })
            .catch((error) => {
                console.error('Erro:', error);
                alert('Houve um erro ao enviar a marcação. Por favor tente novamente ou ligue para nós.');
            })
            .finally(() => {
                // Restaura o botão independentemente se deu erro ou sucesso
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });
    }


    // =========================================
    // MODAL DE MARCAÇÕES (Pop-up)
    // =========================================

    const modal = document.getElementById('bookingModal');
    const closeButton = document.querySelector('.close-button');
    
    // Função para abrir o modal
    function openModal() {
        if (modal) {
            modal.style.display = 'block';
            // Pequeno delay para a animação de opacidade funcionar
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }
    }

    // Função para fechar o modal
    function closeModal() {
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300); // Espera a animação terminar
        }
    }

    // Fechar ao clicar no X
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Fechar ao clicar fora do modal
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // =========================================
    // Scroll Suave e Links do Modal
    // =========================================
    
    // Seleciona todos os links que começam com # (âncoras internas)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Previne o comportamento padrão de salto imediato
            e.preventDefault();
            
            // Obtém o ID do alvo (ex: #servicos)
            const targetId = this.getAttribute('href');
            
            // SE for o link para marcações (#Marcacao), ABRE O MODAL
            if (targetId === '#Marcacao' || targetId === '#marcacoes') {
                openModal();
                return; // Não faz scroll
            }

            // Se for apenas #, não faz nada
            if (targetId === '#') return;
            
            // Seleciona o elemento alvo na página
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Define o tamanho do cabeçalho fixo para descontar na rolagem
                // (para que o título não fique escondido atrás do menu)
                const headerOffset = 80;
                // Calcula a posição do elemento em relação ao topo da janela
                const elementPosition = targetElement.getBoundingClientRect().top;
                // Calcula a posição final de rolagem
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
                // Executa a rolagem suave
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // =========================================
    // SLIDER ENGINE (Genérico para Hero e Serviços)
    // =========================================
    
    /**
     * Inicializa um slider com configurações personalizadas
     * @param {string} wrapperId - ID do wrapper do slider
     * @param {object} options - Opções de configuração
     */
    function initSlider(wrapperSelector, options = {}) {
        const wrapper = document.querySelector(wrapperSelector);
        if (!wrapper) return;

        const track = wrapper.querySelector('.hero-track, .slider-track');
        const slides = wrapper.querySelectorAll('.hero-slide, .slider-slide');
        const nextBtn = wrapper.querySelector('.hero-next, .slider-next');
        const prevBtn = wrapper.querySelector('.hero-prev, .slider-prev');
        const dotsContainer = wrapper.querySelector('.hero-dots');
        let dots = [];

        if (dotsContainer) {
            dots = dotsContainer.querySelectorAll('.dot');
        }

        if (!track || slides.length === 0) return;

        // Configurações Padrão
        const config = {
            autoSlide: true,
            interval: 4000,
            itemsPerView: 1, // Pode ser um número ou uma função
            responsive: null, // Função para definir itemsPerView dinamicamente
            ...options
        };

        let currentIndex = 0;
        let slideTimer;
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Determina quantos items são visíveis (para carrossel)
        function getItemsPerView() {
            if (typeof config.itemsPerView === 'function') {
                return config.itemsPerView();
            }
            return config.itemsPerView;
        }

        function updateSlidePosition() {
            const itemsVisible = getItemsPerView();
            const percentMove = 100 / itemsVisible;
            
            // Move o track
            track.style.transform = `translateX(-${currentIndex * percentMove}%)`;
            
            // Atualiza active (opcional, para estilização)
            slides.forEach(s => s.classList.remove('active'));
            // Marca os visíveis como ativos
            for (let i = 0; i < itemsVisible; i++) {
                if (slides[currentIndex + i]) {
                    slides[currentIndex + i].classList.add('active');
                }
            }

            // Atualiza Dots (se existirem)
            // A lógica dos dots no carrossel multi-item é simplificada aqui: 1 dot por "página" se quiser
            // ou 1 dot por item. Vamos assumir 1 dot por item principal.
            if (dots.length > 0) {
                dots.forEach(d => d.classList.remove('active'));
                const activeDotIndex = Math.floor(currentIndex); 
                if (dots[activeDotIndex]) {
                    dots[activeDotIndex].classList.add('active');
                }
            }
        }

        function goToSlide(index) {
            const totalItems = slides.length;
            const itemsVisible = getItemsPerView();
            const maxIndex = totalItems - itemsVisible; // O índice máximo que podemos ir sem mostrar vazio no fim

            // Lógica de Loop Infinito (Simples: Volta ao início)
            if (index < 0) {
                // Se for carrossel infinito real precisaria clonar, mas aqui vamos só pular pro fim
                index = maxIndex; 
                // Se itemsVisible > 1, maxIndex > 0. 
                // Se totalItems < itemsVisible (nunca deve acontecer se configurado bem), index=0
                 if(index < 0) index = 0; 
            } else if (index > maxIndex) {
                 index = 0; // Volta ao início
            }

            currentIndex = index;
            updateSlidePosition();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        function startTimer() {
            if (config.autoSlide) {
                stopTimer();
                slideTimer = setInterval(nextSlide, config.interval);
            }
        }

        function stopTimer() {
            if (slideTimer) clearInterval(slideTimer);
        }

        // Event Listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startTimer();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startTimer();
            });
        }

        if (dots.length > 0) {
            dots.forEach((dot, idx) => {
                dot.addEventListener('click', () => {
                   currentIndex = idx;
                   updateSlidePosition();
                   startTimer();
                });
            });
        }

        // Swipe Support
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopTimer();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startTimer();
        }, { passive: true });

        function handleSwipe() {
             if (touchEndX < touchStartX - 50) nextSlide();
             if (touchEndX > touchStartX + 50) prevSlide();
        }

        // Pause on Hover
        wrapper.addEventListener('mouseenter', stopTimer);
        wrapper.addEventListener('mouseleave', startTimer);

        // Inicialização
        updateSlidePosition();
        startTimer();

        // Listener de Resize para recalcular itemsPerView se dinâmico
        window.addEventListener('resize', () => {
            updateSlidePosition(); // Reajusta posição pois a porcentagem pode mudar
        });
    }

    // =========================================
    // INICIALIZAÇÃO DOS SLIDERS
    // =========================================

    // 1. Hero Slider (1 item por vez, Dots, Cores)
    initSlider('.hero-slider', {
        autoSlide: true,
        interval: 4000,
        itemsPerView: 1
    });

    // Função auxiliar para responsividade do carrossel
    const getResponsiveItems = () => {
        return window.innerWidth > 768 ? 3 : 1;
    };

    // 2. Serviços Slider (3 desktop, 1 mobile)
    initSlider('#services-slider', {
        autoSlide: true,
        interval: 5000,
        itemsPerView: getResponsiveItems
    });

    // 3. Especializações Slider (3 desktop, 1 mobile)
    initSlider('#specializations-slider', {
        autoSlide: true,
        interval: 6000, // Tempo levemente diferente para não rodarem todos juntos visualmente
        itemsPerView: getResponsiveItems
    });

    // =========================================
    // DARK MODE TOGGLE
    // =========================================
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeBtn ? themeBtn.querySelector('.icon') : null;

    // Check saved preference
    const savedTheme = localStorage.getItem('vinmark-theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        if (icon) icon.textContent = '☀️';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            
            // Update Icon
            if (icon) {
                icon.textContent = isDark ? '☀️' : '🌙';
            }

            // Save Preference
            localStorage.setItem('vinmark-theme', isDark ? 'dark' : 'light');
        });
    }

});
