/**
 * Throttle streaming text updates to control render speed
 */

export const useThrottledStream = (callback, delay = 50) => {
  const timeoutRef = React.useRef(null);
  const bufferRef = React.useRef('');
  const lastUpdateRef = React.useRef(Date.now());

  const throttledCallback = React.useCallback((chunk) => {
    bufferRef.current += chunk;

    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    // If enough time has passed, update immediately
    if (timeSinceLastUpdate >= delay) {
      callback(bufferRef.current);
      bufferRef.current = '';
      lastUpdateRef.current = now;
      return;
    }

    // Otherwise, schedule an update
    if (!timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        callback(bufferRef.current);
        bufferRef.current = '';
        lastUpdateRef.current = Date.now();
        timeoutRef.current = null;
      }, delay - timeSinceLastUpdate);
    }
  }, [callback, delay]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return throttledCallback;
};

/**
 * Character-by-character streaming with adjustable speed
 */
export class StreamingTextRenderer {
  constructor(onUpdate, charsPerSecond = 30) {
    this.onUpdate = onUpdate;
    this.charsPerSecond = charsPerSecond;
    this.buffer = '';
    this.displayedText = '';
    this.intervalId = null;
    this.isActive = false;
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;

    const intervalMs = 1000 / this.charsPerSecond;
    
    this.intervalId = setInterval(() => {
      if (this.buffer.length === 0 && this.displayedText.length === 0) {
        return;
      }

      if (this.buffer.length > 0) {
        // Take next character(s) from buffer
        const chunkSize = Math.min(3, this.buffer.length); // Process up to 3 chars at once
        const nextChunk = this.buffer.substring(0, chunkSize);
        this.buffer = this.buffer.substring(chunkSize);
        this.displayedText += nextChunk;
        this.onUpdate(this.displayedText);
      } else if (!this.isActive) {
        // If no more buffer and not active, stop
        this.stop();
      }
    }, intervalMs);
  }

  addChunk(chunk) {
    this.buffer += chunk;
    if (!this.isActive) {
      this.start();
    }
  }

  finish() {
    this.isActive = false;
    // Flush remaining buffer
    if (this.buffer.length > 0) {
      this.displayedText += this.buffer;
      this.buffer = '';
      this.onUpdate(this.displayedText);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
  }

  reset() {
    this.stop();
    this.buffer = '';
    this.displayedText = '';
  }
}
