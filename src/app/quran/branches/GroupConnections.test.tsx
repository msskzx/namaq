// @vitest-environment jsdom
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { groups } from '@/lib/quran/mutashabih/data';
import { ConnectionLines, GroupConnections } from './GroupConnections';
import { GroupDetails } from './GroupDetails';

vi.mock('@/components/language/LanguageContext', () => ({ useLanguage: () => ({ language: 'ar' }) }));
afterEach(cleanup);
const group = groups.find(group => group.citations.some(citation => citation.id === 'K02'))!;

function Matrix({ defaultOn = false }: { defaultOn?: boolean }) {
  const lane = useRef<HTMLDivElement>(null);
  return <GroupConnections group={group} defaultOn={defaultOn}>
    <div ref={lane}>
      {(['2:48', '2:123'] as const).map(key => <div data-current data-col="0" key={key}>
        {[11, 13, 14, 15].map(index => <span key={index} data-word-position={`${key}:${index}`}>word</span>)}
      </div>)}
      <ConnectionLines lane={lane} column={0} ready />
    </div>
    <GroupDetails group={group} />
  </GroupConnections>;
}


function SurroundingColumn() {
  const lane = useRef<HTMLDivElement>(null);
  return <GroupConnections group={group} defaultOn>
    <div ref={lane}>
      <div data-current data-col="0">Surrounding ayah</div>
      <div data-col="1"><p data-current>
        {(['2:48', '2:123'] as const).flatMap(key => [11, 15, 14].map(index =>
          <span key={`${key}:${index}`} data-word-position={`${key}:${index}`}>word</span>))}
      </p></div>
      <ConnectionLines lane={lane} column={0} ready />
    </div>
  </GroupConnections>;
}

describe('matrix connector overlay', () => {
  it('does not draw through a surrounding column from hidden main-ayah words', () => {
    const { container } = render(<SurroundingColumn />);
    expect(container.querySelectorAll('[data-word-connectors] path')).toHaveLength(0);
  });

  it('starts with connectors off unless the saved default enables them', async () => {
    const { container } = render(<Matrix />);
    expect(container.querySelectorAll('[data-word-connectors] path')).toHaveLength(0);
    expect(screen.getByRole('button', { name: 'تقديم وتأخير' }).getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'تقديم وتأخير' }));
    await waitFor(() => expect(container.querySelectorAll('[data-word-connectors] path')).toHaveLength(2));
  });

  it('draws the default type on the first mount, then switches color and clears', async () => {
    const { container } = render(<Matrix defaultOn />);
    const paths = () => container.querySelectorAll('[data-word-connectors] path');
    await waitFor(() => expect(paths()).toHaveLength(2));
    expect(container.querySelector('[data-word-connectors]')?.getAttribute('stroke')).toContain('--home-slot-1');
    fireEvent.click(screen.getByRole('button', { name: 'إبدال كلمة' }));
    await waitFor(() => expect(paths()).toHaveLength(1));
    expect(container.querySelector('[data-word-connectors]')?.getAttribute('stroke')).toContain('--home-slot-3');
    fireEvent.click(screen.getByRole('button', { name: 'إبدال كلمة' }));
    await waitFor(() => expect(paths()).toHaveLength(0));
  });
});
