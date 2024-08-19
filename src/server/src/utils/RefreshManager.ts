export class RefreshManager {
  private static instance: RefreshManager;
  private ipList: Set<string> = new Set();
  private timeoutId: NodeJS.Timeout | null = null;
  private readonly durationMinutes: number;
  private isRunning: boolean = false;

  private constructor(durationMinutes: number) {
    this.durationMinutes = durationMinutes;
  }

  // Default value is set to 3 minutes for practical reasons:
  // all clients should request changes in 3 minutes
  public static getInstance(durationMinutes: number = 3): RefreshManager {
    if (!RefreshManager.instance) {
      RefreshManager.instance = new RefreshManager(durationMinutes);
    }
    return RefreshManager.instance;
  }

  public addIp(ip: string | undefined) {
    if (this.isRunning && ip) {
      this.ipList.add(ip);
    }
  }

  public checkIp(ip: string | undefined): boolean {
    if (!this.isRunning || !ip) {
      return false;
    }
    return !this.ipList.has(ip);
  }

  public start(): void {
    this.ipList.clear();
    this.isRunning = true;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(
      () => {
        this.isRunning = false;
        this.ipList.clear();
      },
      this.durationMinutes * 60 * 1000
    );
  }
}
