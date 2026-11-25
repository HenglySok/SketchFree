// Command-based undo/redo (spec 6.5) with a memory budget.

export interface Command {
  id: string;
  type: string;
  timestamp: number;
  /** Approximate bytes retained by this command (pixel patches). */
  bytes: number;
  execute(): void;
  undo(): void;
  dispose?(): void;
}

export class History {
  private stack: Command[] = [];
  private index = -1; // index of the last applied command

  constructor(private readonly maxBytes = 400 * 1024 * 1024) {}

  get canUndo(): boolean {
    return this.index >= 0;
  }
  get canRedo(): boolean {
    return this.index < this.stack.length - 1;
  }
  get size(): number {
    return this.stack.length;
  }
  get bytes(): number {
    return this.stack.reduce((n, c) => n + c.bytes, 0);
  }

  /** Execute a command and record it, discarding any redo branch. */
  run(cmd: Command): void {
    cmd.execute();
    this.record(cmd);
  }

  /** Record a command whose effect has already been applied. */
  record(cmd: Command): void {
    for (const dropped of this.stack.splice(this.index + 1)) dropped.dispose?.();
    this.stack.push(cmd);
    this.index = this.stack.length - 1;
    this.trim();
  }

  undo(): boolean {
    if (!this.canUndo) return false;
    this.stack[this.index]!.undo();
    this.index--;
    return true;
  }

  redo(): boolean {
    if (!this.canRedo) return false;
    this.index++;
    this.stack[this.index]!.execute();
    return true;
  }

  clear(): void {
    for (const c of this.stack) c.dispose?.();
    this.stack = [];
    this.index = -1;
  }

  private trim(): void {
    // Drop the oldest commands while over budget, always keeping the newest.
    while (this.stack.length > 1 && this.bytes > this.maxBytes) {
      this.stack.shift()!.dispose?.();
      this.index--;
    }
  }
}
