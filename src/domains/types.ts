/**
 * Result型の定義
 */
export type Result<T, E = Error> =
	| {
			ok: true;
			value: T;
	  }
	| {
			ok: false;
			error: E;
	  };

/**
 * Branded型の定義
 */
export type Branded<T, B> = T & { _brand: B };
