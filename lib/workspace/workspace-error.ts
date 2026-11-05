export class WorkspaceError extends Error {
  constructor(message: string, public readonly status: 403 | 404) {
    super(message);
    this.name = "WorkspaceError";
  }
}
