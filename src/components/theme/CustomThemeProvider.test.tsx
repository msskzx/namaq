// @vitest-environment jsdom
import React from 'react';
import { beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomThemeProvider from './CustomThemeProvider';

beforeAll(() => {
  window.matchMedia ??= (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  } as unknown as MediaQueryList);
});

describe('CustomThemeProvider', () => {
  it('renders children synchronously, without waiting for a mount effect', () => {
    render(
      <CustomThemeProvider>
        <div>content</div>
      </CustomThemeProvider>
    );

    expect(screen.getByText('content')).not.toBeNull();
  });
});
