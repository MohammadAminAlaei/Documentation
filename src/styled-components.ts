import * as styledComponents from 'styled-components';
import type { ResolvedThemeInterface } from './theme';

export type { ResolvedThemeInterface };

const {
  default: styled,
  css,
  createGlobalStyle: originalCreateGlobalStyle,
  keyframes,
  ThemeProvider,
} = styledComponents as unknown as styledComponents.ThemedStyledComponentsModule<ResolvedThemeInterface>;

// Create a new global style with RTL support
const createGlobalStyleWithRTL = (...args: Parameters<typeof originalCreateGlobalStyle>) => {
  return originalCreateGlobalStyle`
    * {
  text-align:right
  }
  html, body {
    direction: rtl;
      }
    ${css(...args)}
  `;
};

export const media = {
  lessThan(
    breakpoint: keyof ResolvedThemeInterface['breakpoints'],
    print?: boolean,
    extra?: string,
  ) {
    return (...args: any[]) => css`
      @media ${print ? 'print, ' : ''} screen and (max-width: ${props =>
          props.theme.breakpoints[breakpoint]}) ${extra || ''} {
        ${(css as any)(...args)};
      }
    `;
  },

  greaterThan(breakpoint: keyof ResolvedThemeInterface['breakpoints']) {
    return (...args: any[]) => css`
      @media (min-width: ${props => props.theme.breakpoints[breakpoint]}) {
        ${(css as any)(...args)};
      }
    `;
  },

  between(
    firstBreakpoint: keyof ResolvedThemeInterface['breakpoints'],
    secondBreakpoint: keyof ResolvedThemeInterface['breakpoints'],
  ) {
    return (...args: any[]) => css`
      @media (min-width: ${props =>
          props.theme.breakpoints[firstBreakpoint]}) and (max-width: ${props =>
          props.theme.breakpoints[secondBreakpoint]}) {
        ${(css as any)(...args)};
      }
    `;
  },
};

export { css, createGlobalStyleWithRTL as createGlobalStyle, keyframes, ThemeProvider };
export default styled;

export function extensionsHook(styledName: string) {
  return (props: any) => {
    if (!props.theme.extensionsHook) {
      return;
    }
    return props.theme.extensionsHook(styledName, props);
  };
}
