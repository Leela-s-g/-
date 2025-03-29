// 漫画阅读器的核心功能
class ComicReader {
    constructor() {
        this.currentChapter = 1;
        this.zoomLevel = 100;
        this.isVerticalMode = true;

        this.initElements();
        this.initEventListeners();
        this.loadChapterFromUrl();
    }

    initElements() {
        this.chapterTitle = document.getElementById('chapterTitle');
        this.comicPages = document.getElementById('comicPages');
        this.prevChapter = document.getElementById('prevChapter');
        this.nextChapter = document.getElementById('nextChapter');
        this.prevChapterBottom = document.getElementById('prevChapterBottom');
        this.nextChapterBottom = document.getElementById('nextChapterBottom');
        this.toggleReadingMode = document.getElementById('toggleReadingMode');
        this.zoomIn = document.getElementById('zoomIn');
        this.zoomOut = document.getElementById('zoomOut');
        this.zoomReset = document.getElementById('zoomReset');

        // 隐藏所有章节，只显示当前章节
        this.hideAllChapters();
    }

    initEventListeners() {
        this.prevChapter.addEventListener('click', () => this.changeChapter(-1));
        this.nextChapter.addEventListener('click', () => this.changeChapter(1));
        this.prevChapterBottom.addEventListener('click', () => this.changeChapter(-1));
        this.nextChapterBottom.addEventListener('click', () => this.changeChapter(1));
        this.zoomIn.addEventListener('click', () => this.zoom(10));
        this.zoomOut.addEventListener('click', () => this.zoom(-10));
        this.zoomReset.addEventListener('click', () => this.resetZoom());
        this.toggleReadingMode.addEventListener('click', () => this.toggleMode());

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'ArrowUp':
                        this.changeChapter(-1);
                        break;
                    case 'ArrowDown':
                        this.changeChapter(1);
                        break;
                }
            }
        });
    }

    loadChapterFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const chapter = parseInt(params.get('chapter')) || 1;
        this.loadChapter(chapter);
    }

    loadChapter(chapter) {
        if (chapter < 1 || chapter > 8) return;

        this.currentChapter = chapter;
        this.chapterTitle.textContent = this.getChapterTitle(chapter);
        
        // 隐藏所有章节，显示当前章节
        this.hideAllChapters();
        this.showCurrentChapter();

        // 更新导航按钮状态
        this.updateNavigationButtons();
    }

    hideAllChapters() {
        const chapters = this.comicPages.querySelectorAll('.chapter-pages');
        chapters.forEach(chapter => chapter.style.display = 'none');
    }

    showCurrentChapter() {
        const currentChapterElement = this.comicPages.querySelector(`[data-chapter="${this.currentChapter}"]`);
        if (currentChapterElement) {
            currentChapterElement.style.display = 'block';
        }
    }

    getChapterTitle(chapter) {
        const titles = {
            1: '第1集：一朵云的身材焦虑',
            2: '第2集：感谢你的出现',
            3: '第3集：接受离别，就像接受一个人的来到一样',
            4: '第4集：平凡的非凡',
            5: '第5集：送给敏感的你',
            6: '第6集：社恐人自有出路',
            7: '第7集：若即若离的朋友',
            8: '第8集：完美爱人'
        };
        return titles[chapter] || '未知章节';
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    changeChapter(delta) {
        const newChapter = this.currentChapter + delta;
        if (newChapter >= 1 && newChapter <= 8) {
            // 更新URL，但不重新加载页面
            const url = new URL(window.location.href);
            url.searchParams.set('chapter', newChapter);
            window.history.pushState({}, '', url);

            this.currentChapter = newChapter;
            this.chapterTitle.textContent = this.getChapterTitle(newChapter);
            this.hideAllChapters();
            this.showCurrentChapter();
            this.scrollToTop();
            this.updateNavigationButtons();
        }
    }

    updateNavigationButtons() {
        this.prevChapter.disabled = this.currentChapter <= 1;
        this.nextChapter.disabled = this.currentChapter >= 8;
        this.prevChapterBottom.disabled = this.currentChapter <= 1;
        this.nextChapterBottom.disabled = this.currentChapter >= 8;
    }

    toggleMode() {
        this.isVerticalMode = !this.isVerticalMode;
        this.comicPages.classList.toggle('vertical-mode');
        this.toggleReadingMode.querySelector('span').textContent = 
            this.isVerticalMode ? '纵向模式' : '横向模式';
    }

    zoom(delta) {
        this.zoomLevel = Math.max(50, Math.min(200, this.zoomLevel + delta));
        const currentChapterElement = this.comicPages.querySelector(`[data-chapter="${this.currentChapter}"]`);
        if (currentChapterElement) {
            const images = currentChapterElement.querySelectorAll('img');
            images.forEach(img => img.style.width = `${this.zoomLevel}%`);
        }
    }

    resetZoom() {
        this.zoomLevel = 100;
        const currentChapterElement = this.comicPages.querySelector(`[data-chapter="${this.currentChapter}"]`);
        if (currentChapterElement) {
            const images = currentChapterElement.querySelectorAll('img');
            images.forEach(img => img.style.width = '100%');
        }
    }
}

// 当页面加载完成时初始化阅读器
document.addEventListener('DOMContentLoaded', () => {
    window.comicReader = new ComicReader();
});