declare namespace gitConfigLocal {
  interface Options {
    readonly gitDir?: string;
  }
}

declare function gitConfigLocal(
  dir: string,
  options?: gitConfigLocal.Options
): Promise<Record<string, any>>;

export = gitConfigLocal;
