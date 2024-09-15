let intensity = 1;
let width, height;
let currentStep = 10; // Начинаем с максимальной интенсивности
const downloadWidth = 888;
const downloadHeight = 888;
let isDownloading = false;

function generateNoise(width, height, intensity) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let d = '';

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let value = Math.random();
            if (value >= intensity) {
                d += `M${x},${y}h1v1h-1z`;
            }
        }
    }

    path.setAttribute('d', d);
    path.setAttribute('fill', 'white');
    svg.appendChild(path);

    return new XMLSerializer().serializeToString(svg);
}

function updateSVG() {
    intensity = 0.94 + (currentStep - 1) * 0.006;
    const svgContent = generateNoise(width, height, intensity);
    svgContainer.innerHTML = svgContent;
}

function downloadSVG() {
    if (isDownloading) return;
    isDownloading = true;

    const svgContent = generateNoise(downloadWidth, downloadHeight, intensity);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grain_texture_${downloadWidth}x${downloadHeight}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setTimeout(() => {
        isDownloading = false;
    }, 1000); // Предотвращаем повторную загрузку в течение 1 секунды
}

const svgContainer = document.getElementById('svgContainer');

// Обработчик изменения размера окна
function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    updateSVG();
}

// Обработчик колесика мыши
function handleWheel(event) {
    event.preventDefault();
    if (event.deltaY < 0 && currentStep < 10) {
        currentStep++;
    } else if (event.deltaY > 0 && currentStep > 1) {
        currentStep--;
    }
    updateSVG();
}

// Обработчик отпускания кнопки мыши для скачивания
function handleMouseUp(event) {
    if (event.button === 0) { // Левая кнопка мыши
        downloadSVG();
    }
}

// Инициализация
handleResize();
window.addEventListener('resize', handleResize);
window.addEventListener('wheel', handleWheel, { passive: false });
window.addEventListener('mouseup', handleMouseUp);

// Начальная генерация SVG
updateSVG();