import { describe, expect, it } from 'vitest';

import { generateEmptyGrid } from './generateEmptyGrid';

describe('generateEmptyGrid', () => {
  it('генерируются значения для пустой таблицы', () => {
    const expectedResult = {
      columns: [
        { key: 'col_1', name: 'Колонка 1' },
        { key: 'col_2', name: 'Колонка 2' },
        { key: 'col_3', name: 'Колонка 3' },
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
