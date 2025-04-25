import { css } from 'lit';

export const styles = css`
  .wrapper {
    display: flex;
    align-items: center;

    padding: 0.25em 0.5em;

    outline-offset: 2px;
    border: 2px solid black;
    border-radius: 4px;

    &:has(input:focus-visible) {
      outline: 2px solid dodgerblue;
    }
  }

  input {
    appearance: none;
    border: none;
    outline: none;
    font: inherit;
    padding: 0;

    field-sizing: content;

    &:focus {
      & ~ .suggestion {
        display: inline;
      }
    }

    &::-webkit-calendar-picker-indicator {
      display: none !important;
    }
    &::-webkit-list-button {
      /*display: none !important;*/
    }
  }
  .actions {
    margin-inline-start: auto;
  }
  .suggestion {
    display: none;
    opacity: 0.5;
  }
`;
