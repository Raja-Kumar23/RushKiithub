// PDF.js loader utility
class PDFLoader {
  constructor() {
    this.isLoaded = false;
    this.isLoading = false;
    this.loadPromise = null;
  }

  async loadPDFJS() {
    if (this.isLoaded) return true;
    if (this.isLoading) return this.loadPromise;

    this.isLoading = true;
    this.loadPromise = this.performLoad();
    
    try {
      await this.loadPromise;
      this.isLoaded = true;
      return true;
    } catch (error) {
      console.error('Failed to load PDF.js:', error);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async performLoad() {
    if (typeof window === 'undefined') return false;

    // Check if PDF.js is already loaded
    if (window.pdfjsLib) {
      this.setupWorker();
      return true;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;

      script.onload = () => {
        if (window.pdfjsLib) {
          this.setupWorker();
          resolve(true);
        } else {
          reject(new Error('PDF.js failed to initialize'));
        }
      };

      script.onerror = () => {
        reject(new Error('Failed to load PDF.js script'));
      };

      document.head.appendChild(script);
    });
  }

  setupWorker() {
    if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
      // Optimize for mobile
      window.pdfjsLib.GlobalWorkerOptions.disableTextLayer = true;
      window.pdfjsLib.GlobalWorkerOptions.disableAnnotationLayer = true;
    }
  }

  isReady() {
    return this.isLoaded && window.pdfjsLib;
  }
}

export const pdfLoader = new PDFLoader();