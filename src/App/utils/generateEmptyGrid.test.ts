import { describe, expect, it } from 'vitest';

import { generateEmptyGrid } from './generateEmptyGrid';

describe('generateEmptyGrid', () => {
  it('генерируются значения для пустой таблицы', () => {
    const expectedResult = {
      columns: [
        { key: 'col_1', name: '' },
        { key: 'col_2', name: '' },
        { key: 'col_3', name: '' },
      ],
      rows: [
        { col_1: '', col_2: '', col_3: '' },
        { col_1: '', col_2: '', col_3: '' },
        { col_1: '', col_2: '', col_3: '' },
      ],
    };
    const result = generateEmptyGrid(3, 3);
    expect(result).toEqual(expectedResult);
  });
});
