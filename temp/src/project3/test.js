document.addEventListener('DOMContentLoaded', () => {
    const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
            if (entry.name.includes('GIGA_MAG32.ksplat')) {
                console.log(`Файл ${entry.name} загружен.`);
                console.log('Длительность загрузки:', entry.duration);

                // Останавливаем наблюдатель, если файл найден
                observer.disconnect();

                // Триггерим "полную загрузку страницы"
                triggerFullLoad();
            }
        }
    });

    // Начинаем наблюдать за сетевыми запросами
    observer.observe({ entryTypes: ['resource'] });

    // Функция для триггера "полной загрузки страницы"
    function triggerFullLoad() {
        console.log('full load');
    }
});
