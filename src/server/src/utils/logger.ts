type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
type Loggable = string | number | boolean | object;

class Logger {
  private formatMessage(level: LogLevel, message: string, params: Loggable[]): string {
    const formattedParams = params.map((p) => this.stringifyParam(p)).join(' ');

    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toLocaleString('fi-FI', { timeZone: 'Europe/Helsinki' });
      return `${timestamp} [${level}] ${message} ${formattedParams}`.trim();
    }

    return `[${level}] ${message} ${formattedParams}`.trim();
  }

  private log(level: LogLevel, message: string, ...params: Loggable[]) {
    const logMessage = this.formatMessage(level, message, params);

    if (level === 'ERROR') {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
  }

  private stringifyParam(param: Loggable): string {
    if (param instanceof Error) {
      return `${param.name}: ${param.message}\n${param.stack}`;
    }
    if (typeof param === 'object' && param !== null) {
      try {
        return JSON.stringify(param);
      } catch {
        return '[Unserializable object]';
      }
    }
    return String(param);
  }

  debug(message: string, ...params: Loggable[]) {
    this.log('DEBUG', message, ...params);
  }

  info(message: string, ...params: Loggable[]) {
    this.log('INFO', message, ...params);
  }

  warn(message: string, ...params: Loggable[]) {
    this.log('WARN', message, ...params);
  }

  error(message: string, ...params: unknown[]) {
    const processedParams = params.map((param) =>
      param instanceof Error ? param : this.stringifyParam(param as Loggable)
    );
    this.log('ERROR', message, ...processedParams);
  }
}

export default new Logger();
