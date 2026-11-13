import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import NoteDialog from './NoteDialog';

vi.mock('@/lib/quran/quranText', () => ({ quranContexts: async () => [] }));

afterEach(() => { cleanup(); localStorage.clear(); });

describe('the note dialog', () => {
  it('starts typing in a new note and keeps it on closing', () => {
    const onClose = vi.fn();
    render(<NoteDialog ayah="2:255" ar onClose={onClose} />);
    const box = screen.getByRole('textbox', { name: 'تأملك في هذه الآية' });
    expect(document.activeElement).toBe(box);
    fireEvent.change(box, { target: { value: 'تأمل' } });
    fireEvent.click(screen.getByRole('button', { name: 'إغلاق' }));
    cleanup();
    expect(JSON.parse(localStorage.getItem('ayah-notes')!)['2:255'].text).toBe('تأمل');
  });
});
