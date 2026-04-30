import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

import { parseClipboardData } from './clipboard';

describe('parseClipboardData', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('возвращает null если строка пустая', () => {
    expect(parseClipboardData('')).toBeNull();
  });

  it('корректно парситься TSV строка в колонки и строки', () => {
    const clipboardText = 'Name\tAge\nAlice\t30\nBob\t25\n\n';
    const result = parseClipboardData(clipboardText);

    expect(result).not.toBeNull();

    if (!result) return;

    expect(result.newColumns).toHaveLength(2);
    expect(result.newColumns[0].name).toBe('Name');

    expect(result.newRows).toHaveLength(2);
    expect(result.newRows[0]).toEqual({
      [result.newColumns[0].key]: 'Alice',
      [result.newColumns[1].key]: '30',
    });
  });
});
